import {
  hasSpotifySessionExpiredNotice,
  readSpotifyCallback,
  spotifySessionExpiredLoginPath,
} from "./spotify-callback";

describe("Spotify callback notifications", () => {
  it.each([
    "connected",
    "denied",
    "invalid_transaction",
    "session_expired",
    "account_conflict",
    "provider_error",
  ])("recognizes the bounded result %s", result => {
    expect(
      readSpotifyCallback(
        new URL(`http://127.0.0.1:3001/profile?spotify=${result}`),
      ),
    ).toEqual({ result, cleanPath: "/profile" });
  });

  it("returns no notification when the parameter is absent", () => {
    expect(
      readSpotifyCallback(new URL("http://127.0.0.1:3001/profile")),
    ).toEqual({ result: null, cleanPath: "/profile" });
  });

  it.each([
    "?spotify=",
    "?spotify=unknown",
    "?spotify=https%3A%2F%2Fexample.com",
    "?spotify=connected&spotify=connected",
    "?spotify=connected&spotify=denied",
  ])("rejects an unknown or duplicate result: %s", query => {
    expect(
      readSpotifyCallback(
        new URL(`http://127.0.0.1:3001/profile${query}`),
      ),
    ).toEqual({
      result: "invalid_transaction",
      cleanPath: "/profile",
    });
  });

  it("preserves unrelated navigation without returning an external URL", () => {
    expect(
      readSpotifyCallback(
        new URL(
          "http://127.0.0.1:3001/profile?tab=account&spotify=connected#settings",
        ),
      ),
    ).toEqual({
      result: "connected",
      cleanPath: "/profile?tab=account#settings",
    });
  });

  it("does not mutate the supplied URL", () => {
    const url = new URL(
      "http://127.0.0.1:3001/profile?spotify=connected",
    );
    readSpotifyCallback(url);
    expect(url.searchParams.get("spotify")).toBe("connected");
  });

  it("uses a fixed login destination for an expired session", () => {
    expect(spotifySessionExpiredLoginPath()).toBe(
      "/login?spotify=session_expired",
    );
  });

  it("recognizes the single expired-session notice", () => {
    expect(
      hasSpotifySessionExpiredNotice(
        new URL("http://127.0.0.1:3001/login?spotify=session_expired"),
      ),
    ).toBe(true);
  });

  it.each([
    "",
    "?spotify=connected",
    "?spotify=unknown",
    "?spotify=session_expired&spotify=session_expired",
    "?spotify=session_expired&spotify=connected",
  ])("does not accept another login notification: %s", query => {
    expect(
      hasSpotifySessionExpiredNotice(
        new URL(`http://127.0.0.1:3001/login${query}`),
      ),
    ).toBe(false);
  });
});
