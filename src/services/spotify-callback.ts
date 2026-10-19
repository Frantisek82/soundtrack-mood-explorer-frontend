export type SpotifyCallbackResult =
  | "connected"
  | "denied"
  | "invalid_transaction"
  | "session_expired"
  | "account_conflict"
  | "provider_error";

const results = new Set<string>([
  "connected",
  "denied",
  "invalid_transaction",
  "session_expired",
  "account_conflict",
  "provider_error",
]);

export function readSpotifyCallback(url: URL): {
  result: SpotifyCallbackResult | null;
  cleanPath: string;
} {
  const cleaned = new URL(url.href);
  const values = cleaned.searchParams.getAll("spotify");
  cleaned.searchParams.delete("spotify");

  let result: SpotifyCallbackResult | null = null;

  if (values.length > 0) {
    result =
      values.length === 1 && results.has(values[0])
        ? (values[0] as SpotifyCallbackResult)
        : "invalid_transaction";
  }

  return {
    result,
    cleanPath: `${cleaned.pathname}${cleaned.search}${cleaned.hash}`,
  };
}

export function spotifySessionExpiredLoginPath(): string {
  return "/login?spotify=session_expired";
}

export function hasSpotifySessionExpiredNotice(url: URL): boolean {
  const values = url.searchParams.getAll("spotify");
  return values.length === 1 && values[0] === "session_expired";
}
