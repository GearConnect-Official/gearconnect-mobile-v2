/** Utilisateur connecté tel qu'on en a besoin côté app (issu de /auth/me, source DB). */
export interface CurrentUser {
  id: number;
  username: string;
  profilePicture: string | null;
}

/** Profil public d'un utilisateur (issu de GET /users/:id), affiché sur l'écran profil. */
export interface UserProfile {
  id: number;
  username: string;
  name: string;
  description: string | null;
  profilePicture: string | null;
  isVerify: boolean;
}

/** Champs modifiables du profil envoyés à PUT /users/:id. */
export interface UpdateProfileInput {
  description: string;
}
