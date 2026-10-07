import { File } from 'expo-file-system';
import { ENV } from '@/config/env';
import type { SelectedMedia } from '@/types/post.types';
import type { UpdateProfileInput, UserProfile } from '@/types/user.types';

const BASE = ENV.apiUrl;

/** Normalise la forme brute renvoyée par l'API (GET /users/:id, PUT /users/:id) en UserProfile. */
function toUserProfile(raw: {
  id: number;
  username: string;
  name?: string | null;
  description?: string | null;
  profilePicture?: string | null;
  isVerify?: boolean;
}): UserProfile {
  return {
    id: raw.id,
    username: raw.username,
    name: raw.name ?? '',
    description: raw.description ?? null,
    profilePicture: raw.profilePicture ?? null,
    isVerify: Boolean(raw.isVerify),
  };
}

/** Récupère le profil public d'un utilisateur (GET /users/:id). */
export async function getUserProfile(userId: number, token: string): Promise<UserProfile> {
  const res = await fetch(`${BASE}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de charger le profil.');
  }
  return toUserProfile(await res.json());
}

/** Met à jour les champs texte du profil (PUT /users/:id) et renvoie le profil à jour. */
export async function updateProfile(
  userId: number,
  input: UpdateProfileInput,
  token: string,
): Promise<UserProfile> {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ description: input.description }),
  });
  if (!res.ok) {
    throw new Error('Impossible de mettre à jour le profil.');
  }
  const data = await res.json();
  return toUserProfile(data.user);
}

/**
 * Envoie une nouvelle photo de profil (multipart) : le back l'uploade vers
 * Cloudinary (POST /users/:id/profile-picture-cloudinary) et renvoie le profil à jour.
 */
export async function uploadProfilePicture(
  userId: number,
  media: SelectedMedia,
  token: string,
): Promise<UserProfile> {
  const form = new FormData();
  // les objets RN { uri, name, type } ne sont plus acceptés.
  form.append('profilePicture', new File(media.uri));

  const res = await fetch(`${BASE}/users/${userId}/profile-picture-cloudinary`, {
    method: 'POST',
    // Pas de Content-Type manuel : fetch ajoute le boundary multipart lui-même.
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error('Impossible de mettre à jour la photo de profil.');
  }
  const data = await res.json();
  return toUserProfile(data.user);
}
