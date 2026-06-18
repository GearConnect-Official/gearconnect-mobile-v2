import { useAuth } from '@clerk/expo';
import { useState } from 'react';
import { Alert } from 'react-native';
import { updateProfile, uploadProfilePicture } from '@/services/api/userService';
import type { SelectedMedia } from '@/types/post.types';
import type { UserProfile } from '@/types/user.types';

interface Params {
  profile: UserProfile;
  onSaved: () => void;
}

/** Gère l'édition du profil (photo + description) : état du formulaire et sauvegarde. */
export function useEditProfile({ profile, onSaved }: Params) {
  const { getToken } = useAuth();
  const initialDescription = profile.description ?? '';

  const [description, setDescription] = useState(initialDescription);
  const [pickedImage, setPickedImage] = useState<SelectedMedia | null>(null);
  const [saving, setSaving] = useState(false);

  const descriptionChanged = description.trim() !== initialDescription.trim();
  const dirty = pickedImage != null || descriptionChanged;

  const save = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');
      if (pickedImage) {
        await uploadProfilePicture(profile.id, pickedImage, token);
      }
      if (descriptionChanged) {
        await updateProfile(profile.id, { description: description.trim() }, token);
      }
      onSaved();
    } catch (e) {
      Alert.alert(
        'Échec',
        e instanceof Error ? e.message : 'Impossible de mettre à jour le profil.',
      );
    } finally {
      setSaving(false);
    }
  };

  return { description, setDescription, pickedImage, setPickedImage, saving, dirty, save };
}
