import { getSoundtrackById, getSoundtracks } from "./soundtracks";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

describe("soundtracks service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSoundtracks", () => {
    it("returns all soundtracks", async () => {
      const soundtracks = [
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
        json: jest.fn().mockResolvedValue(soundtracks),
      });

      await expect(getSoundtracks()).resolves.toEqual(soundtracks);

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/soundtracks`, {
        cache: "no-store",
      });
    });

    it("throws when loading soundtracks fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getSoundtracks()).rejects.toThrow(
        "Failed to load soundtracks",
      );
    });
  });

  describe("getSoundtrackById", () => {
    it("returns a soundtrack by id", async () => {
      const soundtrack = {
        _id: "1",
        title: "Time",
        movie: "Inception",
        composer: "Hans Zimmer",
        moods: ["focus"],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(soundtrack),
      });

      await expect(getSoundtrackById("1")).resolves.toEqual(soundtrack);

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/soundtracks/1`, {
        cache: "no-store",
      });
    });

    it("throws when loading a soundtrack fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getSoundtrackById("1")).rejects.toThrow(
        "Failed to load soundtrack",
      );
    });
  });
});
