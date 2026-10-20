import { useAuth } from '@clerk/expo';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIVACY_URL, TERMS_URL } from '@/config/constants';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/settingsScreen.styles';
import ReverificationModal from './ReverificationModal';
import { useDeleteAccount } from './useDeleteAccount';

/** Ouvre une page du site vitrine dans le navigateur intégré. */
async function openWebPage(url: string) {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch {
    Alert.alert('Erreur', "Impossible d'ouvrir la page.");
  }
}

/** Écran des paramètres du compte : CGU, confidentialité, déconnexion et suppression du compte. */
export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const {
    deleting,
    confirmDeletion,
    needsVerification,
    verifying,
    verificationError,
    verifyPassword,
    cancelVerification,
  } = useDeleteAccount();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <FontAwesome name="chevron-left" size={18} color={palette.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>
      <View>
        <Pressable style={styles.row} onPress={() => openWebPage(TERMS_URL)}>
          <Text style={styles.rowText}>CGU</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => openWebPage(PRIVACY_URL)}>
          <Text style={styles.rowText}>Politique de confidentialité</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => signOut()}>
          <Text style={styles.rowText}>Déconnexion</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={confirmDeletion} disabled={deleting}>
          <Text style={styles.rowTextDanger}>Supprimer mon compte</Text>
        </Pressable>
      </View>

      <ReverificationModal
        visible={needsVerification}
        verifying={verifying}
        error={verificationError}
        onSubmit={verifyPassword}
        onCancel={cancelVerification}
      />
    </SafeAreaView>
  );
}
