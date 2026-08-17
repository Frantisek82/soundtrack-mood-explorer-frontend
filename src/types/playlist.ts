import type { Soundtrack } from "@/src/types/soundtrack";

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  soundtracks: Array<string | Soundtrack>;
  createdAt: string;
  updatedAt: string;
}
