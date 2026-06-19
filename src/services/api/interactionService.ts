import { ENV } from '@/config/env';

const BASE = ENV.apiUrl;

/** Toggle le like d'un post pour l'utilisateur courant (POST /interactions/toggle-like). */
export async function toggleLike(postId: number, userId: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/interactions/toggle-like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ postId, userId }),
  });
  if (!res.ok) {
    throw new Error('Impossible de mettre à jour le like.');
  }
}
