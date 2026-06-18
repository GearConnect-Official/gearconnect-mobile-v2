import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/editProfileModal.styles';
import type { UserProfile } from '@/types/user.types';
import { withCloudinaryAuto } from '@/utils/mediaUtils';
import { useEditProfile } from './useEditProfile';

interface Props {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSaved: () => void;
}

/** Popup d'édition du profil : changer la photo et la description en une seule fois. */
export default function EditProfileModal({ visible, profile, onClose, onSaved }: Props) {
  const { description, setDescription, pickedImage, setPickedImage, saving, dirty, save } =
    useEditProfile({
      profile,
      onSaved: () => {
        onSaved();
        onClose();
      },
    });

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Accès refusé', 'Autorise l’accès à la galerie pour changer ta photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setPickedImage({ uri: asset.uri, type: 'IMAGE', width: asset.width, height: asset.height });
  };

  const previewUri = pickedImage
    ? pickedImage.uri
    : profile.profilePicture
      ? withCloudinaryAuto(profile.profilePicture)
      : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Modifier le profil</Text>

          <Pressable style={styles.avatarPicker} onPress={pickImage} hitSlop={8}>
            {previewUri ? (
              <Image source={previewUri} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <FontAwesome name="user" size={32} color={palette.white} />
              </View>
            )}
            <Text style={styles.changePhoto}>Changer la photo</Text>
          </Pressable>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Parle un peu de toi…"
            placeholderTextColor={palette.gray500}
            multiline
            maxLength={150}
          />

          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onClose} disabled={saving} hitSlop={6}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.save, (!dirty || saving) && styles.saveDisabled]}
              onPress={save}
              disabled={!dirty || saving}
              hitSlop={6}
            >
              {saving ? (
                <ActivityIndicator color={palette.white} />
              ) : (
                <Text style={styles.saveText}>Enregistrer</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
