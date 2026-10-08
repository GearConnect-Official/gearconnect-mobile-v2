import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/reverificationModal.styles';

interface Props {
  visible: boolean;
  verifying: boolean;
  error: string | null;
  onSubmit: (password: string) => void;
  onCancel: () => void;
}

/** Popup : redemande le mot de passe avant une action sensible (suppression du compte). */
export default function ReverificationModal({
  visible,
  verifying,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [password, setPassword] = useState('');
  const canSubmit = password.length > 0 && !verifying;

  const close = () => {
    setPassword('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Confirme ton identité</Text>
            <Text style={styles.message}>Saisis ton mot de passe pour supprimer ton compte.</Text>

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor={palette.gray500}
              secureTextEntry
              autoFocus
              editable={!verifying}
              onSubmitEditing={() => canSubmit && onSubmit(password)}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.actions}>
              <Pressable style={styles.cancel} onPress={close} disabled={verifying}>
                <Text style={styles.cancelText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.confirm, !canSubmit && styles.confirmDisabled]}
                onPress={() => onSubmit(password)}
                disabled={!canSubmit}
              >
                {verifying ? (
                  <ActivityIndicator color={palette.white} />
                ) : (
                  <Text style={styles.confirmText}>Confirmer</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
