import { Playlist } from "@/src/types/playlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPlaylists(): Promise<Playlist[]> {
  const response = await fetch(`${API_URL}/playlists`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return response.json();
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const response = await fetch(`${API_URL}/playlists/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlist");
  }

  return response.json();
}

export async function createPlaylist(data: {
  name: string;
  description?: string;
}): Promise<Playlist> {
  const response = await fetch(`${API_URL}/playlists`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create playlist");
  }

  return response.json();
}

export async function updatePlaylist(
  id: string,
  data: {
    name: string;
    description?: string;
  },
): Promise<Playlist> {
  const response = await fetch(`${API_URL}/playlists/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update playlist");
  }

  return response.json();
}

export async function deletePlaylist(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/playlists/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete playlist");
  }
}

export async function removeSoundtrackFromPlaylist(
  playlistId: string,
  soundtrackId: string,
): Promise<Playlist> {
  const response = await fetch(
    `${API_URL}/playlists/${playlistId}/soundtracks/${soundtrackId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to remove soundtrack from playlist");
  }

  return response.json();
}
