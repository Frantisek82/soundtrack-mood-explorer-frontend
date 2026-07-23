import { fetchSoundtracks } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

describe("API service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches all soundtracks when no mood is provided", async () => {
    const mockData = [{ id: 1, title: "Interstellar" }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    await expect(fetchSoundtracks()).resolves.toEqual(mockData);

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/soundtracks`);
  });

  it("fetches soundtracks filtered by mood", async () => {
    const mockData = [{ id: 2, title: "Inception" }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    await expect(fetchSoundtracks("happy")).resolves.toEqual(mockData);

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/soundtracks?mood=happy`,
    );
  });

  it("throws an error when the request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(fetchSoundtracks()).rejects.toThrow(
      "Failed to fetch soundtracks",
    );
  });

  it("propagates fetch errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(fetchSoundtracks()).rejects.toThrow("Network error");
  });
});
