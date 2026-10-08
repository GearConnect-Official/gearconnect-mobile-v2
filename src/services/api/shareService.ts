import { ENV } from '@/config/env';

const BASE = ENV.apiUrl;

/**
 * Enregistre un partage de post (POST /shares). Événement append-only : chaque
 * appel crée une ligne côté back (pas de toggle, contrairement au like).
 */
export async function createShare(postId: number, userId: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/shares`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ postId, userId }),
  });
  if (!res.ok) {
    throw new Error('Impossible d’enregistrer le partage.');
  }
}
