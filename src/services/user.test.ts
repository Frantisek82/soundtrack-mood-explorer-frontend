import {
  deleteAccount,
  getCurrentUser,
  updatePassword,
} from "./user";

const API_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
}/user/me`;

describe("user service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrentUser", () => {
    it("returns the current user", async () => {
      const user = {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(user),
      });

      await expect(getCurrentUser()).resolves.toEqual(user);

      expect(global.fetch).toHaveBeenCalledWith(API_URL, {
        credentials: "include",
      });
    });

    it("throws when fetching the current user fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getCurrentUser()).rejects.toThrow(
        "Failed to fetch user"
      );
    });
  });

  describe("updatePassword", () => {
    it("updates the password successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await expect(
        updatePassword("newPassword123")
      ).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: "newPassword123",
        }),
      });
    });

    it("throws the API error message when the update fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: "Password is too short",
        }),
      });

      await expect(
        updatePassword("123")
      ).rejects.toThrow("Password is too short");
    });
  });

  describe("deleteAccount", () => {
    it("deletes the account successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await expect(deleteAccount()).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(API_URL, {
        method: "DELETE",
        credentials: "include",
      });
    });

    it("throws when account deletion fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(deleteAccount()).rejects.toThrow(
        "Failed to delete account"
      );
    });
  });
});