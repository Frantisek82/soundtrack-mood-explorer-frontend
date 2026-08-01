import { isAuthenticated, logout } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

describe("auth utilities", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when the user is authenticated", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    await expect(isAuthenticated()).resolves.toBe(true);

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/user/me`, {
      credentials: "include",
    });
  });

  it("returns false when the request is not successful", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(isAuthenticated()).resolves.toBe(false);
  });

  it("returns false when fetch throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(isAuthenticated()).resolves.toBe(false);
  });

  it("calls the logout endpoint", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({});

    await logout();

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  });
});