import { ENV } from '@/config/env';
import { CreatePostInput, Post, SelectedMedia } from '@/types/post.types';
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

/** Construit l'objet fichier RN ({ uri, name, type }) attendu par FormData. */
function toFormFile(media: SelectedMedia) {
  const ext = media.uri.split('.').pop()?.split('?')[0]?.toLowerCase() ?? (media.type === 'VIDEO' ? 'mp4' : 'jpg');
  const name = `upload.${ext}`;
  const type = media.type === 'VIDEO' ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  return { uri: media.uri, name, type };
}

/**
 * Crée un post. Les fichiers sont envoyés en multipart au backend, qui les
 * uploade lui-même vers Cloudinary (le front ne parle qu'à l'API).
 */
export async function createPost(input: CreatePostInput, token: string): Promise<Post> {
  const form = new FormData();
  form.append('body', input.body);
  form.append('userId', String(input.userId));
  input.media.forEach((m) => form.append('media', toFormFile(m) as any));

  const res = await fetch(`${BASE}/posts`, {
    method: 'POST',
    // Pas de Content-Type manuel : fetch ajoute le boundary multipart lui-même.
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Création du post échouée (${res.status}) : ${detail}`);
  }
  return res.json();
}
