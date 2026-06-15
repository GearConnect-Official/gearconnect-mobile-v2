import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '@/styles/mediaSection.styles';
import type { MediaType, SelectedMedia } from '@/types/post.types';

const MAX_MEDIA = 10;

interface Props {
  media: SelectedMedia[];
  onChange: (media: SelectedMedia[]) => void;
}

/** Mappe le type renvoyé par le picker vers notre enum. */
function toMediaType(assetType?: string | null): MediaType {
  return assetType === 'video' ? 'VIDEO' : 'IMAGE';
}

function assetsToMedia(assets: ImagePicker.ImagePickerAsset[]): SelectedMedia[] {
  return assets.map((a) => ({
    uri: a.uri,
    type: toMediaType(a.type),
    width: a.width,
    height: a.height,
  }));
}

/** Étape 1 : sélection des médias (caméra + galerie multi, images & vidéos mélangées). */
export default function MediaSection({ media, onChange }: Props) {
  const remaining = MAX_MEDIA - media.length;

  const addMedia = (incoming: SelectedMedia[]) => {
    // On ajoute aux médias déjà choisis sans dépasser le plafond.
    onChange([...media, ...incoming].slice(0, MAX_MEDIA));
  };

  const removeAt = (index: number) => {
    onChange(media.filter((_, i) => i !== index));
  };

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Accès refusé', 'Autorise l’accès à la galerie pour publier.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
    });
    if (result.canceled) return;
    addMedia(assetsToMedia(result.assets));
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Accès refusé', 'Autorise l’appareil photo pour publier.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
    });
    if (result.canceled) return;
    addMedia(assetsToMedia(result.assets));
  };

  const full = remaining <= 0;

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Pressable
          style={[styles.action, full && styles.actionDisabled]}
          onPress={takePhoto}
          disabled={full}
        >
          <FontAwesome name="camera" size={20} color="#2f95dc" />
          <Text style={styles.actionText}>Photo</Text>
        </Pressable>
        <Pressable
          style={[styles.action, full && styles.actionDisabled]}
          onPress={pickFromGallery}
          disabled={full}
        >
          <FontAwesome name="image" size={20} color="#2f95dc" />
          <Text style={styles.actionText}>Galerie</Text>
        </Pressable>
      </View>

      {media.length === 0 ? (
        <View style={styles.empty}>
          <FontAwesome name="plus-circle" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Ajoute photos et vidéos</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {media.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: uri alone isn't unique if the same file is added twice
            <View key={`${item.uri}-${i}`} style={styles.thumbWrapper}>
              <Image source={item.uri} style={styles.thumb} contentFit="cover" />
              {item.type === 'VIDEO' && (
                <View style={styles.videoBadge}>
                  <FontAwesome name="play" size={10} color="#fff" />
                </View>
              )}
              <Pressable style={styles.remove} onPress={() => removeAt(i)} hitSlop={8}>
                <FontAwesome name="times-circle" size={20} color="#fff" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
