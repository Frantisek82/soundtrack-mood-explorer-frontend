import {
  addFavorite,
  getFavorites,
  isFavorite,
  removeFavorite,
} from "./favorites";

const API_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
}/favorites`;

describe("favorites service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFavorites", () => {
    it("returns the user's favorites", async () => {
      const favorites = [
        {
          _id: "1",
          title: "Time",
          movie: "Inception",
          composer: "Hans Zimmer",
          moods: ["focus"],
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(favorites),
      });

      await expect(getFavorites()).resolves.toEqual(favorites);

      expect(global.fetch).toHaveBeenCalledWith(API_URL, {
        credentials: "include",
      });
    });

    it("throws when fetching favorites fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getFavorites()).rejects.toThrow("Failed to fetch favorites");
    });
  });

  describe("addFavorite", () => {
    it("adds a favorite successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await expect(addFavorite("track123")).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          soundtrackId: "track123",
        }),
      });
    });

    it("throws when adding a favorite fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(addFavorite("track123")).rejects.toThrow(
        "Failed to add favorite",
      );
    });
  });

  describe("removeFavorite", () => {
    it("removes a favorite successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await expect(removeFavorite("track123")).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/track123`, {
        method: "DELETE",
        credentials: "include",
      });
    });

    it("throws when removing a favorite fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(removeFavorite("track123")).rejects.toThrow(
        "Failed to remove favorite",
      );
    });
  });

  describe("isFavorite", () => {
    it("returns true when the soundtrack is a favorite", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          isFavorite: true,
        }),
      });

      await expect(isFavorite("track123")).resolves.toBe(true);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/track123`, {
        credentials: "include",
      });
    });

    it("returns false when the request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(isFavorite("track123")).resolves.toBe(false);
    });
  });
});
