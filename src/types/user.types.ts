/** Utilisateur connecté tel qu'on en a besoin côté app (issu de /auth/me, source DB). */
export interface CurrentUser {
  id: number;
  username: string;
  profilePicture: string | null;
}
