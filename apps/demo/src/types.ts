export type Role = "streamer" | "viewer";

export interface User {
  id: string;
  role: Role;
  room: string;
}
