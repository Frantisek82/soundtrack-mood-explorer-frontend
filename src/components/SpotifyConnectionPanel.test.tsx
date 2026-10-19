import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SpotifyConnectionPanel from "./SpotifyConnectionPanel";
import {
  disconnectSpotify,
  getSpotifyStatus,
  SpotifyApiError,
  spotifyControlsEnabled,
  startSpotifyConnection,
} from "@/src/services/spotify";

jest.mock("@/src/services/spotify", () => ({
  ...jest.requireActual("@/src/services/spotify"),
  disconnectSpotify: jest.fn(),
  getSpotifyStatus: jest.fn(),
  spotifyControlsEnabled: jest.fn(),
  startSpotifyConnection: jest.fn(),
}));

const statusMock = jest.mocked(getSpotifyStatus);
const startMock = jest.mocked(startSpotifyConnection);
const disconnectMock = jest.mocked(disconnectSpotify);
const enabledMock = jest.mocked(spotifyControlsEnabled);
const sessionExpired = jest.fn();
const navigate = jest.fn();

function show(
  callbackResult?:
    | "connected"
    | "denied"
    | "provider_error"
    | "invalid_transaction"
    | "session_expired"
    | "account_conflict",
) {
  return render(
    <SpotifyConnectionPanel
      callbackResult={callbackResult}
      onSessionExpired={sessionExpired}
      navigate={navigate}
    />,
  );
}

beforeEach(() => {
  jest.resetAllMocks();
  enabledMock.mockReturnValue(true);
  statusMock.mockResolvedValue({ state: "disconnected", account: null });
  disconnectMock.mockResolvedValue(undefined);
  startMock.mockResolvedValue("https://accounts.spotify.com/authorize?test");
});

it("shows the disconnected state and does not poll", async () => {
  show();
  expect(await screen.findByText("Not connected.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Connect Spotify" })).toBeDisabled();
  expect(statusMock).toHaveBeenCalledTimes(1);
});

it("shows a connected account and its controls", async () => {
  statusMock.mockResolvedValue({
    state: "connected",
    account: { displayName: "Test Listener" },
  });
  show();
  expect(await screen.findByText("Connected to Spotify as Test Listener."))
    .toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reconnect Spotify" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Disconnect Spotify" })).toBeEnabled();
});

it("supports a connected account without a display name", async () => {
  statusMock.mockResolvedValue({
    state: "connected",
    account: { displayName: null },
  });
  show();
  expect(await screen.findByText("Connected to Spotify.")).toBeInTheDocument();
});

it("offers reconnect when reauthorization is required", async () => {
  statusMock.mockResolvedValue({
    state: "reauthorization_required",
    account: { displayName: null },
  });
  show();
  expect(await screen.findByText("Spotify authorization needs to be renewed."))
    .toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reconnect Spotify" })).toBeDisabled();
});

it("navigates the current tab using the service result", async () => {
  const user = userEvent.setup();
  show();
  await screen.findByText("Not connected.");
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Connect Spotify" }));
  expect(startMock).toHaveBeenCalledTimes(1);
  expect(navigate).toHaveBeenCalledWith(
    "https://accounts.spotify.com/authorize?test",
  );
});

it("prevents duplicate submissions while authorization starts", async () => {
  const user = userEvent.setup();
  let finish!: (url: string) => void;
  startMock.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  show();
  const button = await screen.findByRole("button", { name: "Connect Spotify" });
  await screen.findByText("Not connected.");
  await user.click(screen.getByRole("checkbox"));
  await user.dblClick(button);
  expect(startMock).toHaveBeenCalledTimes(1);
  expect(button).toBeDisabled();
  await act(async () => { finish("https://accounts.spotify.com/authorize?test"); });
});

it("disconnects and shows the disconnected state", async () => {
  const user = userEvent.setup();
  statusMock.mockResolvedValue({
    state: "connected",
    account: { displayName: null },
  });
  show();
  await user.click(await screen.findByRole("button", { name: "Disconnect Spotify" }));
  expect(await screen.findByText("Spotify disconnected from this application."))
    .toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Connect Spotify" })).toBeDisabled();
});

it("rechecks status after an uncertain disconnect failure", async () => {
  const user = userEvent.setup();
  statusMock
    .mockResolvedValueOnce({ state: "connected", account: { displayName: null } })
    .mockResolvedValueOnce({ state: "disconnected", account: null });
  disconnectMock.mockRejectedValue(new Error("private transport details"));
  show();
  await user.click(await screen.findByRole("button", { name: "Disconnect Spotify" }));
  expect(await screen.findByText("Not connected.")).toBeInTheDocument();
  expect(statusMock).toHaveBeenCalledTimes(2);
  expect(screen.queryByText(/private transport details/)).not.toBeInTheDocument();
});

it("does not treat the callback parameter as proof of connection", async () => {
  show("connected");
  await screen.findByText("Not connected.");
  expect(screen.queryByText("Spotify connection confirmed.")).not.toBeInTheDocument();
});

it("confirms callback success only after connected status is fetched", async () => {
  statusMock.mockResolvedValue({
    state: "connected",
    account: { displayName: null },
  });
  show("connected");
  expect(await screen.findByText("Spotify connection confirmed."))
    .toBeInTheDocument();
});

it.each(["denied", "provider_error"] as const)(
  "shows a bounded notice for %s",
  async result => {
    show(result);
    await screen.findByText("Not connected.");
    expect(screen.getByText(/Your existing connection was kept/)).toBeInTheDocument();
  },
);

it("handles an unavailable backend without claiming disconnection", async () => {
  statusMock.mockRejectedValue(new SpotifyApiError("unavailable", 503));
  show();
  expect(await screen.findByText("Spotify connection is currently unavailable."))
    .toBeInTheDocument();
  expect(screen.queryByText("Not connected.")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Connect Spotify" }))
    .not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Check connection status" }))
    .toBeEnabled();
});

it("hands an expired session back to the profile guard", async () => {
  statusMock.mockRejectedValue(new SpotifyApiError("unauthorized", 401));
  show();
  await waitFor(() => expect(sessionExpired).toHaveBeenCalledTimes(1));
});

it("makes no requests when controls are disabled", () => {
  enabledMock.mockReturnValue(false);
  show();
  expect(screen.getByText("Spotify connection controls are disabled for this deployment."))
    .toBeInTheDocument();
  expect(statusMock).not.toHaveBeenCalled();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("supports keyboard activation", async () => {
  const user = userEvent.setup();
  show();
  const button = await screen.findByRole("button", { name: "Connect Spotify" });
  await screen.findByText("Not connected.");
  await user.click(screen.getByRole("checkbox"));
  button.focus();
  await user.keyboard("{Enter}");
  expect(startMock).toHaveBeenCalledTimes(1);
});

it("aborts pending status work when unmounted", () => {
  statusMock.mockImplementation(() => new Promise(() => {}));
  const view = show();
  const signal = statusMock.mock.calls[0][0];
  view.unmount();
  expect(signal?.aborted).toBe(true);
});

it.each([
  {
    result: "invalid_transaction",
    text: /authorization attempt is invalid or expired/,
  },
  {
    result: "session_expired",
    text: /Your application session expired/,
  },
  {
    result: "account_conflict",
    text: /This Spotify account could not be linked/,
  },
] as const)("explains the $result callback", async ({ result, text }) => {
  show(result);
  await screen.findByText("Not connected.");
  expect(screen.getByText(text)).toBeInTheDocument();
  expect(screen.queryByText("Spotify connection confirmed."))
    .not.toBeInTheDocument();
});

it.each([
  {
    code: "forbidden",
    text: "Spotify connection is unavailable from this website.",
  },
  {
    code: "connection_changed",
    text: "Your connection changed. Check its current status and try again.",
  },
  {
    code: "rate_limited",
    text: "Too many requests. Please wait before trying again.",
  },
] as const)("handles a $code authorization failure", async ({ code, text }) => {
  const user = userEvent.setup();
  startMock.mockRejectedValue(new SpotifyApiError(code));
  show();
  await screen.findByText("Not connected.");
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Connect Spotify" }));
  expect(await screen.findByText(text)).toBeInTheDocument();
  expect(navigate).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Connect Spotify" })).toBeEnabled();
});

it("allows an explicit status retry after an outage", async () => {
  const user = userEvent.setup();
  statusMock
    .mockRejectedValueOnce(new SpotifyApiError("unavailable", 503))
    .mockResolvedValueOnce({
      state: "connected",
      account: { displayName: null },
    });

  show();
  await screen.findByText("Spotify connection is currently unavailable.");
  await user.click(screen.getByRole("button", { name: "Check connection status" }));
  expect(await screen.findByText("Connected to Spotify.")).toBeInTheDocument();
  expect(statusMock).toHaveBeenCalledTimes(2);
});
