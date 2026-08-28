import {
  addSoundtrackToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylists,
  removeSoundtrackFromPlaylist,
  updatePlaylist,
} from "./playlists";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/playlists`;

const playlist = {
  _id: "playlist123",
  name: "Focus",
  description: "Soundtracks for focused work",
  soundtracks: [],
};

describe("playlists service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPlaylists", () => {
    it("returns the user's playlists", async () => {
      const playlists = [playlist];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(playlists),
      });

      await expect(getPlaylists()).resolves.toEqual(playlists);

      expect(global.fetch).toHaveBeenCalledWith(API_URL, {
        credentials: "include",
      });
    });

    it("throws when fetching playlists fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getPlaylists()).rejects.toThrow(
        "Failed to fetch playlists",
      );
    });
  });

  describe("getPlaylist", () => {
    it("returns a playlist", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(playlist),
      });

      await expect(getPlaylist("playlist123")).resolves.toEqual(playlist);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/playlist123`,
        {
          credentials: "include",
        },
      );
    });

    it("throws when fetching a playlist fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(getPlaylist("missing")).rejects.toThrow(
        "Failed to fetch playlist",
      );
    });
  });

  describe("createPlaylist", () => {
    it("creates and returns a playlist", async () => {
      const data = {
        name: "Focus",
        description: "Soundtracks for focused work",
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(playlist),
      });

      await expect(createPlaylist(data)).resolves.toEqual(playlist);

      expect(global.fetch).toHaveBeenCalledWith(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    });

    it("creates a playlist without an optional description", async () => {
      const data = {
        name: "Focus",
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(playlist),
      });

      await createPlaylist(data);

      expect(global.fetch).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          body: JSON.stringify(data),
        }),
      );
    });

    it("throws when creating a playlist fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(
        createPlaylist({ name: "Focus" }),
      ).rejects.toThrow("Failed to create playlist");
    });
  });

  describe("updatePlaylist", () => {
    it("updates and returns a playlist", async () => {
      const data = {
        name: "Updated Focus",
        description: "Updated description",
      };
      const updatedPlaylist = {
        ...playlist,
        ...data,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(updatedPlaylist),
      });

      await expect(
        updatePlaylist("playlist123", data),
      ).resolves.toEqual(updatedPlaylist);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/playlist123`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
    });

    it("throws when updating a playlist fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(
        updatePlaylist("playlist123", { name: "Updated Focus" }),
      ).rejects.toThrow("Failed to update playlist");
    });
  });

  describe("deletePlaylist", () => {
    it("deletes a playlist", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await expect(
        deletePlaylist("playlist123"),
      ).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/playlist123`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
    });

    it("throws when deleting a playlist fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(deletePlaylist("playlist123")).rejects.toThrow(
        "Failed to delete playlist",
      );
    });
  });

  describe("removeSoundtrackFromPlaylist", () => {
    it("removes a soundtrack and returns the updated playlist", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(playlist),
      });

      await expect(
        removeSoundtrackFromPlaylist("playlist123", "track123"),
      ).resolves.toEqual(playlist);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/playlist123/soundtracks/track123`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
    });

    it("throws when removing a soundtrack fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(
        removeSoundtrackFromPlaylist("playlist123", "track123"),
      ).rejects.toThrow("Failed to remove soundtrack from playlist");
    });
  });

  describe("addSoundtrackToPlaylist", () => {
    it("adds a soundtrack and returns the updated playlist", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(playlist),
      });

      await expect(
        addSoundtrackToPlaylist("playlist123", "track123"),
      ).resolves.toEqual(playlist);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/playlist123/soundtracks`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            soundtrackId: "track123",
          }),
        },
      );
    });

    it("throws a specific error for a duplicate soundtrack", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
      });

      await expect(
        addSoundtrackToPlaylist("playlist123", "track123"),
      ).rejects.toThrow("Soundtrack is already in this playlist.");
    });

    it("throws when adding a soundtrack otherwise fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(
        addSoundtrackToPlaylist("playlist123", "track123"),
      ).rejects.toThrow("Failed to add soundtrack to playlist.");
    });
  });
});
