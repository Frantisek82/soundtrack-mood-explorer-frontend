import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfilePage from "@/src/app/profile/page";
import LoginPage from "@/src/app/login/page";
import { isAuthenticated } from "@/src/utils/auth";
import { getCurrentUser } from "@/src/services/user";
import { getFavorites } from "@/src/services/favorites";
import { loginUser } from "@/src/services/auth";

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@/src/utils/auth", () => ({
  isAuthenticated: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("@/src/services/user", () => ({
  getCurrentUser: jest.fn(),
  updatePassword: jest.fn(),
  deleteAccount: jest.fn(),
}));

jest.mock("@/src/services/favorites", () => ({
  getFavorites: jest.fn(),
}));

jest.mock("@/src/services/auth", () => ({
  loginUser: jest.fn(),
}));

jest.mock("@/src/components/SpotifyConnectionPanel", () => ({
  __esModule: true,
  default: ({
    callbackResult,
    onSessionExpired,
  }: {
    callbackResult: string | null;
    onSessionExpired: () => void;
  }) => (
    <section aria-label="Spotify test panel">
      <p>Callback: {callbackResult ?? "none"}</p>
      <button onClick={onSessionExpired}>Simulate expired session</button>
    </section>
  ),
}));

beforeEach(() => {
  jest.resetAllMocks();
  window.history.replaceState({}, "", "/profile");
  jest.mocked(isAuthenticated).mockResolvedValue(true);
  jest.mocked(getCurrentUser).mockResolvedValue({
    _id: "test-user",
    name: "Test User",
    email: "test@example.com",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
  jest.mocked(getFavorites).mockResolvedValue([]);
});

it("passes a bounded callback result to the panel and cleans the URL", async () => {
  window.history.replaceState({}, "", "/profile?tab=account&spotify=connected");
  render(<ProfilePage />);
  expect(await screen.findByText("Callback: connected")).toBeInTheDocument();
  expect(window.location.pathname + window.location.search)
    .toBe("/profile?tab=account");
  expect(screen.getByRole("button", { name: "Update Password" }))
    .toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Delete Account" }))
    .toBeInTheDocument();
});

it("preserves the callback result through Strict Mode effect replay", async () => {
  window.history.replaceState({}, "", "/profile?spotify=denied");
  render(<StrictMode><ProfilePage /></StrictMode>);
  expect(await screen.findByText("Callback: denied")).toBeInTheDocument();
  expect(window.location.search).toBe("");
});

it("does not pass duplicate success results as a successful callback", async () => {
  window.history.replaceState({}, "", "/profile?spotify=connected&spotify=connected");
  render(<ProfilePage />);
  expect(await screen.findByText("Callback: invalid_transaction"))
    .toBeInTheDocument();
  expect(window.location.search).toBe("");
});

it("preserves an expired-session notice when profile authentication fails", async () => {
  jest.mocked(isAuthenticated).mockResolvedValue(false);
  window.history.replaceState({}, "", "/profile?spotify=session_expired");
  render(<ProfilePage />);
  await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith(
    "/login?spotify=session_expired",
  ));
  expect(getCurrentUser).not.toHaveBeenCalled();
  expect(window.location.search).toBe("");
});

it("uses the ordinary login route without an OAuth callback", async () => {
  jest.mocked(isAuthenticated).mockResolvedValue(false);
  render(<ProfilePage />);
  await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/login"));
});

it("handles session expiry reported by the Spotify panel", async () => {
  const user = userEvent.setup();
  render(<ProfilePage />);
  await user.click(await screen.findByRole("button", {
    name: "Simulate expired session",
  }));
  expect(mockRouter.replace).toHaveBeenCalledWith("/login?spotify=session_expired");
});

it("shows the login notice and removes its query parameter", async () => {
  window.history.replaceState({}, "", "/login?spotify=session_expired");
  render(<StrictMode><LoginPage /></StrictMode>);
  expect(await screen.findByRole("status"))
    .toHaveTextContent("Your application session expired during Spotify authorization.");
  expect(window.location.pathname).toBe("/login");
  expect(window.location.search).toBe("");
});

it("ignores and removes duplicate login notices", async () => {
  window.history.replaceState(
    {},
    "",
    "/login?spotify=session_expired&spotify=session_expired",
  );
  render(<LoginPage />);
  await waitFor(() => expect(window.location.search).toBe(""));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("preserves normal application login after the Spotify notice", async () => {
  const user = userEvent.setup();
  jest.mocked(loginUser).mockResolvedValue(undefined);
  window.history.replaceState({}, "", "/login?spotify=session_expired");
  render(<LoginPage />);
  await screen.findByRole("status");
  await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
  await user.type(screen.getByPlaceholderText("Password"), "test-password");
  await user.click(screen.getByRole("button", { name: "Login" }));
  await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/explore"));
});
