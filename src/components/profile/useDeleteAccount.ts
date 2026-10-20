import {
  isClerkAPIResponseError,
  isClerkRuntimeError,
  useAuth,
  useReverification,
  useSession,
} from '@clerk/expo';
import { useState } from 'react';
import { Alert } from 'react-native';
import { ACCOUNT_DELETION_DELAY_DAYS } from '@/config/constants';
import { deleteAccount } from '@/services/api/authService';

/** Demande de vérification d'identité en cours, transmise par Clerk. */
interface PendingReverification {
  level: 'first_factor' | 'second_factor' | 'multi_factor' | undefined;
  complete: () => void;
  cancel: () => void;
}

/** L'utilisateur a fermé la vérification d'identité : ce n'est pas une erreur à afficher. */
function isReverificationCancelled(e: unknown): boolean {
  return isClerkRuntimeError(e) && e.code === 'reverification_cancelled';
}

/** Gère la suppression du compte : confirmation, vérification d'identité, appel API puis déconnexion. */
export function useDeleteAccount() {
  const { getToken, signOut } = useAuth();
  const { session } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [reverification, setReverification] = useState<PendingReverification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Si l'API exige une vérification récente, on ouvre la modale puis Clerk relance l'appel.
  const deleteWithReverification = useReverification(
    async () => {
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');
      return deleteAccount(token);
    },
    { onNeedsReverification: setReverification },
  );

  const runDeletion = async () => {
    setDeleting(true);
    try {
      await deleteWithReverification();
      await signOut();
    } catch (e) {
      if (isReverificationCancelled(e)) return;
      Alert.alert('Échec', e instanceof Error ? e.message : 'Impossible de supprimer le compte.');
    } finally {
      setDeleting(false);
    }
  };

  const confirmDeletion = () => {
    if (deleting) return;
    Alert.alert(
      'Supprimer le compte',
      `Ton compte sera masqué immédiatement, puis supprimé définitivement dans ${ACCOUNT_DELETION_DELAY_DAYS} jours. Tu pourras le réactiver en te reconnectant d'ici là.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: runDeletion },
      ],
    );
  };

  const verifyPassword = async (password: string) => {
    if (!session || !reverification || verifying) return;
    setVerifying(true);
    setVerificationError(null);
    try {
      await session.startVerification({ level: reverification.level ?? 'first_factor' });
      const result = await session.attemptFirstFactorVerification({
        strategy: 'password',
        password,
      });
      if (result.status !== 'complete') {
        throw new Error('Une vérification supplémentaire est requise.');
      }
      reverification.complete();
      setReverification(null);
    } catch (e) {
      // Les erreurs Clerk (mot de passe faux…) sont en anglais : message générique.
      setVerificationError(
        e instanceof Error && !isClerkAPIResponseError(e) ? e.message : 'Mot de passe incorrect.',
      );
    } finally {
      setVerifying(false);
    }
  };

  const cancelVerification = () => {
    reverification?.cancel();
    setReverification(null);
    setVerificationError(null);
  };

  return {
    deleting,
    confirmDeletion,
    needsVerification: reverification !== null,
    verifying,
    verificationError,
    verifyPassword,
    cancelVerification,
  };
}
