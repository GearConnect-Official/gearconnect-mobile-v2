import { ENV } from '@/config/env';

const BASE = ENV.apiUrl;

/** Réponse de l'API quand Clerk exige une vérification d'identité récente. */
export interface ReverificationHint {
  clerk_error: { type: 'forbidden'; reason: 'reverification-error' };
}

/**
 * Programme la suppression du compte connecté (DELETE /auth/account) : le compte est
 * masqué tout de suite puis supprimé définitivement à l'issue du délai.
 * Renvoie la demande de vérification d'identité telle quelle pour que `useReverification`
 * l'intercepte (elle ne doit pas être levée en erreur).
 */
export async function deleteAccount(token: string): Promise<ReverificationHint | undefined> {
  const res = await fetch(`${BASE}/auth/account`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 403) {
    const body = await res.json().catch(() => null);
    if (body?.clerk_error?.reason === 'reverification-error') return body;
  }
  if (!res.ok) {
    throw new Error('Impossible de supprimer le compte.');
  }
  return undefined;
}

/** Annule la suppression programmée du compte connecté (POST /auth/reactivate). */
export async function reactivateAccount(token: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/reactivate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de réactiver le compte.');
  }
}
