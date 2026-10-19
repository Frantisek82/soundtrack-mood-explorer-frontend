export type SpotifyConnectionStatus =
  | { state: "disconnected"; account: null }
  | {
      state: "connected" | "reauthorization_required";
      account: { displayName: string | null };
    };

type ErrorCode =
  | "unauthorized"
  | "forbidden"
  | "connection_changed"
  | "rate_limited"
  | "unavailable"
  | "request_failed"
  | "invalid_response"
  | "cancelled";

export class SpotifyApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly status?: number,
  ) {
    super("Spotify request failed");
    this.name = "SpotifyApiError";
  }
}

export function spotifyControlsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SPOTIFY_ENABLED === "true" &&
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview";
}

function apiBase(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;
  if (
    !spotifyControlsEnabled() ||
    (value !== "http://127.0.0.1:3000/api" &&
      value !== "https://soundtrack-mood-explorer-backend.vercel.app/api")
  ) {
    throw new SpotifyApiError("unavailable");
  }
  return value;
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new SpotifyApiError("invalid_response");
  }
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, keys: string[]) {
  if (
    Object.keys(value).length !== keys.length ||
    keys.some(key => !Object.prototype.hasOwnProperty.call(value, key))
  ) {
    throw new SpotifyApiError("invalid_response");
  }
}

function parseStatus(value: unknown): SpotifyConnectionStatus {
  const body = object(value);
  exactKeys(body, ["state", "account"]);

  if (body.state === "disconnected" && body.account === null) {
    return { state: "disconnected", account: null };
  }

  if (body.state !== "connected" && body.state !== "reauthorization_required") {
    throw new SpotifyApiError("invalid_response");
  }

  const account = object(body.account);
  exactKeys(account, ["displayName"]);
  if (
    account.displayName !== null &&
    (typeof account.displayName !== "string" || account.displayName.length > 256)
  ) {
    throw new SpotifyApiError("invalid_response");
  }

  return {
    state: body.state,
    account: { displayName: account.displayName as string | null },
  };
}

function authorizationUrl(value: unknown): string {
  const body = object(value);
  exactKeys(body, ["authorizationUrl"]);
  const raw = body.authorizationUrl;

  if (
    typeof raw !== "string" ||
    raw.length > 8192 ||
    raw !== raw.trim()
  ) {
    throw new SpotifyApiError("invalid_response");
  }

  const url = new URL(raw);
  if (
    url.origin !== "https://accounts.spotify.com" ||
    url.pathname !== "/authorize" ||
    url.username !== "" ||
    url.password !== "" ||
    url.hash !== ""
  ) {
    throw new SpotifyApiError("invalid_response");
  }

  const required = [
    "client_id",
    "response_type",
    "redirect_uri",
    "state",
    "code_challenge_method",
    "code_challenge",
  ];
  const seen = new Set<string>();
  for (const key of url.searchParams.keys()) {
    if (!required.includes(key) || seen.has(key)) {
      throw new SpotifyApiError("invalid_response");
    }
    seen.add(key);
  }

  if (
    seen.size !== required.length ||
    !/^[a-f0-9]{32}$/i.test(url.searchParams.get("client_id") ?? "") ||
    url.searchParams.get("response_type") !== "code" ||
    url.searchParams.get("redirect_uri") !== `${apiBase()}/spotify/callback` ||
    url.searchParams.get("code_challenge_method") !== "S256" ||
    !/^[A-Za-z0-9_-]{43}$/.test(url.searchParams.get("state") ?? "") ||
    !/^[A-Za-z0-9_-]{43}$/.test(url.searchParams.get("code_challenge") ?? "")
  ) {
    throw new SpotifyApiError("invalid_response");
  }

  return url.href;
}

function responseError(status: number): SpotifyApiError {
  return new SpotifyApiError(
    status === 401
      ? "unauthorized"
      : status === 403
        ? "forbidden"
        : status === 409
          ? "connection_changed"
          : status === 429
            ? "rate_limited"
            : status === 503
              ? "unavailable"
              : "request_failed",
    status,
  );
}

async function request<T>(
  path: string,
  method: "GET" | "POST" | "DELETE",
  parse: (body: unknown) => T,
  externalSignal?: AbortSignal,
): Promise<T> {
  const base = apiBase();
  if (externalSignal?.aborted) throw new SpotifyApiError("cancelled");

  const controller = new AbortController();
  const cancel = () => controller.abort();
  externalSignal?.addEventListener("abort", cancel, { once: true });
  const timeout = setTimeout(cancel, 15_000);

  try {
    const response = await fetch(`${base}/spotify/${path}`, {
      method,
      credentials: "include",
      cache: "no-store",
      redirect: "error",
      signal: controller.signal,
      ...(method === "POST"
        ? { headers: { "Content-Type": "application/json" }, body: "{}" }
        : {}),
    });

    if (!response.ok) throw responseError(response.status);

    if (method === "DELETE") {
      if (response.status !== 204) throw new SpotifyApiError("invalid_response");
      return parse(null);
    }

    if (response.status !== 200) throw new SpotifyApiError("invalid_response");

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new SpotifyApiError("invalid_response");
    }

    if (controller.signal.aborted) throw new SpotifyApiError("request_failed");

    try {
      return parse(body);
    } catch {
      throw new SpotifyApiError("invalid_response");
    }
  } catch (error) {
    if (externalSignal?.aborted) throw new SpotifyApiError("cancelled");
    if (error instanceof SpotifyApiError) throw error;
    throw new SpotifyApiError("request_failed");
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", cancel);
  }
}

export function getSpotifyStatus(
  signal?: AbortSignal,
): Promise<SpotifyConnectionStatus> {
  return request("status", "GET", parseStatus, signal);
}

export function startSpotifyConnection(signal?: AbortSignal): Promise<string> {
  return request("connect", "POST", authorizationUrl, signal);
}

export function disconnectSpotify(signal?: AbortSignal): Promise<void> {
  return request("disconnect", "DELETE", () => undefined, signal);
}
