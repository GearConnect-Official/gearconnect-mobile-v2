import { ENV } from '@/config/env';
import { CreatePostInput, Post } from '@/types/post.types';
import { CurrentUser } from '@/types/user.types';

const BASE = ENV.apiUrl;

/** Récupère le profil de l'utilisateur connecté (id interne, pseudo, avatar DB) via GET /auth/me. */
export async function getCurrentUser(token: string): Promise<CurrentUser> {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de récupérer le profil utilisateur.');
  }
  const data = await res.json();
  return {
    id: data.user.id,
    username: data.user.username,
    profilePicture: data.user.profilePicture ?? null,
  };
}

/** Crée un post. Le backend exige body + userId ; media est optionnel. */
export async function createPost(input: CreatePostInput, token: string): Promise<Post> {
  const res = await fetch(`${BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Création du post échouée (${res.status}) : ${detail}`);
  }
  return res.json();
}
