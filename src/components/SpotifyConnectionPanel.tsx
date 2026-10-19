"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Button from "./Button";
import {
  disconnectSpotify,
  getSpotifyStatus,
  SpotifyApiError,
  spotifyControlsEnabled,
  startSpotifyConnection,
  type SpotifyConnectionStatus,
} from "@/src/services/spotify";
import type { SpotifyCallbackResult } from "@/src/services/spotify-callback";

type Props = {
  callbackResult?: SpotifyCallbackResult | null;
  onSessionExpired: () => void;
  navigate?: (url: string) => void;
};

function navigateCurrentTab(url: string) {
  window.location.assign(url);
}

function errorMessage(error: unknown): string {
  if (error instanceof SpotifyApiError) {
    switch (error.code) {
      case "unauthorized":
        return "Your application session expired. Please sign in again.";
      case "forbidden":
        return "Spotify connection is unavailable from this website.";
      case "connection_changed":
        return "Your connection changed. Check its current status and try again.";
      case "rate_limited":
        return "Too many requests. Please wait before trying again.";
      case "unavailable":
        return "Spotify connection is currently unavailable.";
    }
  }

  return "Could not complete the Spotify request. Check the status and try again.";
}

function callbackMessage(
  result: SpotifyCallbackResult | null | undefined,
  status: SpotifyConnectionStatus | null,
): string | null {
  switch (result) {
    case "connected":
      return status?.state === "connected"
        ? "Spotify connection confirmed."
        : null;
    case "denied":
      return "Spotify authorization was cancelled. Your existing connection was kept.";
    case "invalid_transaction":
      return "This Spotify authorization attempt is invalid or expired. Please try again.";
    case "session_expired":
      return "Your application session expired. Please sign in again.";
    case "account_conflict":
      return "This Spotify account could not be linked. Disconnect before switching accounts; an account already linked to another user cannot be connected here.";
    case "provider_error":
      return "Spotify authorization could not be completed. Your existing connection was kept.";
    default:
      return null;
  }
}

export default function SpotifyConnectionPanel({
  callbackResult,
  onSessionExpired,
  navigate = navigateCurrentTab,
}: Props) {
  const enabled = spotifyControlsEnabled();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [status, setStatus] = useState<SpotifyConnectionStatus | null>(null);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      const controller = new AbortController();
      controllerRef.current = controller;
      busyRef.current = true;

      async function load() {
        try {
          const current = await getSpotifyStatus(controller.signal);
          if (!controller.signal.aborted) setStatus(current);
        } catch (error) {
          if (!controller.signal.aborted) {
            setMessage(errorMessage(error));
            if (error instanceof SpotifyApiError && error.code === "unauthorized") {
              onSessionExpired();
            }
          }
        } finally {
          if (!controller.signal.aborted) {
            busyRef.current = false;
            setBusy(false);
          }
        }
      }

      void load();
    }

    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [enabled, onSessionExpired]);

  async function act(action: "connect" | "disconnect" | "status") {
    if (!enabled || busyRef.current) return;
    if (action === "connect" && !acceptedTerms) return;

    busyRef.current = true;
    setBusy(true);
    setMessage(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      if (action === "connect") {
        const url = await startSpotifyConnection(controller.signal);
        if (!controller.signal.aborted && mountedRef.current) navigate(url);
      } else if (action === "disconnect") {
        await disconnectSpotify(controller.signal);
        if (!controller.signal.aborted && mountedRef.current) {
          setStatus({ state: "disconnected", account: null });
          setMessage("Spotify disconnected from this application.");
        }
      } else {
        const current = await getSpotifyStatus(controller.signal);
        if (!controller.signal.aborted && mountedRef.current) setStatus(current);
      }
    } catch (error) {
      if (!controller.signal.aborted && mountedRef.current) {
        setMessage(errorMessage(error));

        if (error instanceof SpotifyApiError && error.code === "unauthorized") {
          onSessionExpired();
        } else if (action === "disconnect") {
          // A lost response does not prove whether cleanup committed.
          // Re-read database status before offering another mutation.
          setStatus(null);
          try {
            const current = await getSpotifyStatus(controller.signal);
            if (!controller.signal.aborted && mountedRef.current) setStatus(current);
          } catch {
            // Keep the bounded original error and offer a status retry.
          }
        }
      }
    } finally {
      if (!controller.signal.aborted && mountedRef.current) {
        busyRef.current = false;
        setBusy(false);
      }
    }
  }

  const callbackNotice = callbackMessage(callbackResult, status);

  return (
    <section
      aria-labelledby="spotify-heading"
      className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4"
    >
      <h2 id="spotify-heading" className="text-xl font-semibold">
        Spotify connection
      </h2>

      <div className="inline-block p-5">
        <Image
          src="/spotify/spotify-logo-white.svg"
          alt="Spotify"
          width={146}
          height={40}
          className="h-auto w-[146px]"
        />
      </div>

      <p className="text-sm text-gray-300">
        Your application login is separate from Spotify. This portfolio integration
        is in Development Mode and is available only to allowlisted Spotify accounts.
        It does not provide playback or playlist synchronization.
      </p>

      {!enabled ? (
        <p role="status">
          Spotify connection controls are disabled for this deployment.
        </p>
      ) : (
        <>
          <div aria-live="polite" aria-busy={busy}>
            {busy && <p>Checking Spotify connection…</p>}
            {!busy && status?.state === "disconnected" && <p>Not connected.</p>}
            {!busy && status?.state === "connected" && (
              <p>
                Connected to Spotify
                {status.account.displayName
                  ? ` as ${status.account.displayName}`
                  : ""}.
              </p>
            )}
            {!busy && status?.state === "reauthorization_required" && (
              <p>Spotify authorization needs to be renewed.</p>
            )}
            {!busy && !status && <p>Connection status could not be verified.</p>}
          </div>

          {callbackNotice && <p role="status">{callbackNotice}</p>}
          {message && <p role="status">{message}</p>}

          <div className="space-y-2 text-sm">
            <p>
              Before connecting, read the{" "}
              <Link href="/privacy" className="underline">Privacy notice</Link>{" "}
              and{" "}
              <Link href="/terms" className="underline">Terms of use</Link>.
              The connection uses your Spotify account identifier, available
              display name, and backend-held authorization credentials.
            </p>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={event => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                I agree to the Terms of use and have read the Privacy notice.
              </span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            {status && (
              <Button disabled={busy || !acceptedTerms} onClick={() => void act("connect")}>
                {status.state === "disconnected"
                  ? "Connect Spotify"
                  : "Reconnect Spotify"}
              </Button>
            )}

            {status && status.state !== "disconnected" && (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void act("disconnect")}
              >
                Disconnect Spotify
              </Button>
            )}

            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => void act("status")}
            >
              Check connection status
            </Button>
          </div>
        </>
      )}

      <p className="text-sm text-gray-300">
        To switch Spotify accounts, disconnect first. Disconnecting removes the
        Spotify connection from this application but does not revoke Spotify consent.
        To revoke access, open{" "}
        <a
          href="https://www.spotify.com/account/apps/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Spotify’s Apps page
        </a>{" "}
        and choose Remove Access.
      </p>
    </section>
  );
}
