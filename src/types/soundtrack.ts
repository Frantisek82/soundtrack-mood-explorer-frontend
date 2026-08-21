export interface Soundtrack {
  _id: string;
  title: string;
  movie: string;
  composer: string;
  moods: string[];
  spotifyTrackId?: string;
}
