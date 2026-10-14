import { useAuth, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { reactivateAccount } from '@/services/api/authService';

/** Date de suppression définitive lue dans les métadonnées Clerk, ou null si aucune suppression n'est prévue. */
export function getDeletionDate(publicMetadata: Record<string, unknown> | undefined): Date | null {
  const raw = publicMetadata?.deletionScheduledAt;
  if (typeof raw !== 'string') return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formate une date en toutes lettres, ex. « 23 octobre 2026 ». */
export function formatDeletionDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Gère la réactivation d'un compte en cours de suppression : annulation côté API puis retour à l'app. */
export function useAccountReactivation() {
  const { getToken, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [reactivating, setReactivating] = useState(false);

  const deletionDate = getDeletionDate(user?.publicMetadata);

  const reactivate = async () => {
    if (reactivating) return;
    setReactivating(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');
      await reactivateAccount(token);
      // Recharge les métadonnées Clerk pour que le layout ne redirige plus ici.
      await user?.reload();
      router.replace('/(app)/(tabs)/home');
    } catch (e) {
      Alert.alert('Échec', e instanceof Error ? e.message : 'Impossible de réactiver le compte.');
    } finally {
      setReactivating(false);
    }
  };

  return { deletionDate, reactivating, reactivate, signOut };
}
