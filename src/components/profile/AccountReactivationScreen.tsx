import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/accountReactivationScreen.styles';
import { palette } from '@/styles/colors';
import { formatDeletionDate, useAccountReactivation } from './useAccountReactivation';

/** Écran affiché à la connexion d'un compte en cours de suppression : réactiver ou se déconnecter. */
export default function AccountReactivationScreen() {
  const { deletionDate, reactivating, reactivate, signOut } = useAccountReactivation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Ton compte est en cours de suppression</Text>
        <Text style={styles.message}>
          {deletionDate
            ? `Il sera supprimé définitivement le ${formatDeletionDate(deletionDate)}.`
            : 'Il sera bientôt supprimé définitivement.'}{' '}
          Réactive-le pour retrouver ton profil et tes publications.
        </Text>

        <Pressable
          style={[styles.button, reactivating && styles.buttonDisabled]}
          onPress={reactivate}
          disabled={reactivating}
        >
          {reactivating ? (
            <ActivityIndicator color={palette.white} />
          ) : (
            <Text style={styles.buttonText}>Réactiver mon compte</Text>
          )}
        </Pressable>

        <Pressable style={styles.link} onPress={() => signOut()} disabled={reactivating}>
          <Text style={styles.linkText}>Se déconnecter</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
