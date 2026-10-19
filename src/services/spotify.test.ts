import {
  disconnectSpotify,
  getSpotifyStatus,
  SpotifyApiError,
  spotifyControlsEnabled,
  startSpotifyConnection,
} from "./spotify";

const base = "http://127.0.0.1:3000/api";
const originalFetch = global.fetch;
const originalEnv = {
  api: process.env.NEXT_PUBLIC_API_URL,
  enabled: process.env.NEXT_PUBLIC_SPOTIFY_ENABLED,
  preview: process.env.NEXT_PUBLIC_VERCEL_ENV,
};

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function response(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  };
}

function validAuthorization() {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.search = new URLSearchParams({
    client_id: "a".repeat(32),
    response_type: "code",
    redirect_uri: `${base}/spotify/callback`,
    state: "a".repeat(43),
    code_challenge_method: "S256",
    code_challenge: "b".repeat(43),
  }).toString();
  return url;
}

describe("Spotify frontend service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.NEXT_PUBLIC_API_URL = base;
    process.env.NEXT_PUBLIC_SPOTIFY_ENABLED = "true";
    process.env.NEXT_PUBLIC_VERCEL_ENV = "development";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    restore("NEXT_PUBLIC_API_URL", originalEnv.api);
    restore("NEXT_PUBLIC_SPOTIFY_ENABLED", originalEnv.enabled);
    restore("NEXT_PUBLIC_VERCEL_ENV", originalEnv.preview);
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it.each([
    { state: "disconnected", account: null },
    { state: "connected", account: { displayName: "Test Listener" } },
    { state: "reauthorization_required", account: { displayName: null } },
  ])("returns the validated $state status", async body => {
    (fetch as jest.Mock).mockResolvedValue(response(body));
    await expect(getSpotifyStatus()).resolves.toEqual(body);
    expect(fetch).toHaveBeenCalledWith(`${base}/spotify/status`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      redirect: "error",
      signal: expect.any(AbortSignal),
    });
  });

  it("starts authorization using an exact JSON POST and returns its validated URL", async () => {
    const url = validAuthorization().href;
    (fetch as jest.Mock).mockResolvedValue(response({ authorizationUrl: url }));

    await expect(startSpotifyConnection()).resolves.toBe(url);
    expect(fetch).toHaveBeenCalledWith(`${base}/spotify/connect`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      redirect: "error",
      signal: expect.any(AbortSignal),
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
  });

  it("disconnects without adding a content type or parsing a 204 body", async () => {
    const result = response(null, 204);
    (fetch as jest.Mock).mockResolvedValue(result);

    await expect(disconnectSpotify()).resolves.toBeUndefined();
    expect(result.json).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(`${base}/spotify/disconnect`, {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
      redirect: "error",
      signal: expect.any(AbortSignal),
    });
  });

  it.each([
    null,
    [],
    {},
    { state: "unknown", account: null },
    { state: "disconnected", account: { displayName: "Unexpected" } },
    { state: "connected", account: null },
    { state: "connected", account: { displayName: 42 } },
    { state: "connected", account: { displayName: "x".repeat(257) } },
    { state: "connected", account: { displayName: null, accountId: "private" } },
    { state: "disconnected", account: null, accessToken: "private" },
  ])("rejects malformed or unexpected status fields", async body => {
    (fetch as jest.Mock).mockResolvedValue(response(body));
    await expect(getSpotifyStatus()).rejects.toMatchObject({
      code: "invalid_response",
      message: "Spotify request failed",
    });
  });

  it.each([
    [401, "unauthorized"],
    [403, "forbidden"],
    [409, "connection_changed"],
    [429, "rate_limited"],
    [503, "unavailable"],
    [500, "request_failed"],
  ])("maps HTTP %s without reading or forwarding provider text", async (status, code) => {
    const result = response({ message: "test-only-private-error" }, status as number);
    (fetch as jest.Mock).mockResolvedValue(result);

    await expect(getSpotifyStatus()).rejects.toMatchObject({
      code,
      status,
      message: "Spotify request failed",
    });
    expect(result.json).not.toHaveBeenCalled();
  });

  it.each([
    "https://example.com/authorize",
    "https://accounts.spotify.com.evil.test/authorize",
    "http://accounts.spotify.com/authorize",
    "javascript:alert(1)",
    "//accounts.spotify.com/authorize",
    "not-a-url",
  ])("rejects an untrusted authorization destination: %s", async authorizationUrl => {
    (fetch as jest.Mock).mockResolvedValue(response({ authorizationUrl }));
    await expect(startSpotifyConnection()).rejects.toMatchObject({
      code: "invalid_response",
    });
  });

  it.each([
    ["redirect_uri", "https://example.com/callback"],
    ["response_type", "token"],
    ["code_challenge_method", "plain"],
    ["state", "short"],
    ["code_challenge", ""],
    ["client_id", "invalid"],
    ["scope", "user-read-email"],
    ["next", "https://example.com"],
  ])("rejects invalid authorization parameter %s", async (key, value) => {
    const url = validAuthorization();
    url.searchParams.set(key, value);
    (fetch as jest.Mock).mockResolvedValue(response({
      authorizationUrl: url.href,
    }));

    await expect(startSpotifyConnection()).rejects.toMatchObject({
      code: "invalid_response",
    });
  });

  it("rejects duplicate authorization parameters", async () => {
    const url = validAuthorization();
    url.searchParams.append("state", "c".repeat(43));
    (fetch as jest.Mock).mockResolvedValue(response({
      authorizationUrl: url.href,
    }));
    await expect(startSpotifyConnection()).rejects.toMatchObject({
      code: "invalid_response",
    });
  });

  it("rejects authorization fragments", async () => {
    const url = validAuthorization();
    url.hash = "unexpected";
    (fetch as jest.Mock).mockResolvedValue(response({
      authorizationUrl: url.href,
    }));
    await expect(startSpotifyConnection()).rejects.toMatchObject({
      code: "invalid_response",
    });
  });

  it.each(["false", "", undefined])(
    "makes no request when the feature flag is %s",
    async enabled => {
      restore("NEXT_PUBLIC_SPOTIFY_ENABLED", enabled);
      expect(spotifyControlsEnabled()).toBe(false);
      await expect(getSpotifyStatus()).rejects.toMatchObject({
        code: "unavailable",
      });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("disables requests on Preview deployments", async () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    expect(spotifyControlsEnabled()).toBe(false);
    await expect(startSpotifyConnection()).rejects.toMatchObject({
      code: "unavailable",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    "http://localhost:3000/api",
    "https://example.com/api",
    undefined,
  ])("rejects an unapproved backend URL: %s", async api => {
    restore("NEXT_PUBLIC_API_URL", api);
    await expect(getSpotifyStatus()).rejects.toBeInstanceOf(SpotifyApiError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sanitizes network errors", async () => {
    (fetch as jest.Mock).mockRejectedValue(
      new Error("test-only-private-network-details"),
    );
    await expect(getSpotifyStatus()).rejects.toMatchObject({
      code: "request_failed",
      message: "Spotify request failed",
    });
  });

  it("sanitizes malformed JSON", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new Error("private-parse-details")),
    });
    await expect(getSpotifyStatus()).rejects.toMatchObject({
      code: "invalid_response",
    });
  });

  it("rejects unexpected successful disconnect statuses", async () => {
    (fetch as jest.Mock).mockResolvedValue(response({}, 200));
    await expect(disconnectSpotify()).rejects.toMatchObject({
      code: "invalid_response",
    });
  });

  it("does not dispatch an already-cancelled request", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getSpotifyStatus(controller.signal)).rejects.toMatchObject({
      code: "cancelled",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("bounds a request with a timeout", async () => {
    jest.useFakeTimers();
    (fetch as jest.Mock).mockImplementation(
      (_url: string, options: RequestInit) => new Promise((_, reject) => {
        options.signal?.addEventListener("abort", () => {
          reject(new Error("test-only-abort-details"));
        }, { once: true });
      }),
    );

    const pending = getSpotifyStatus();
    const checked = expect(pending).rejects.toMatchObject({
      code: "request_failed",
    });
    jest.advanceTimersByTime(15_000);
    await checked;
  });
});
