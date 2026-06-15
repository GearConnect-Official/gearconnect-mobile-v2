import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { MediaCarousel } from '@/components/feed';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/postPreview.styles';
import type { SelectedMedia } from '@/types/post.types';
import { withCloudinaryAuto } from '@/utils/mediaUtils';

interface Props {
  author: { username: string; avatarUrl?: string | null };
  media: SelectedMedia[];
  body?: string;
}

/** Aperçu live de la carte de post pendant la création (sans actions du feed). */
export default function PostPreview({ author, media, body = '' }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {author.avatarUrl ? (
          <Image
            source={withCloudinaryAuto(author.avatarUrl)}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <FontAwesome name="user" size={16} color={palette.white} />
          </View>
        )}
        <Text style={styles.username}>{author.username}</Text>
      </View>

      <MediaCarousel items={media.map((m) => ({ uri: m.uri, type: m.type }))} />

      {body.length > 0 && <Text style={styles.body}>{body}</Text>}
    </View>
  );
}
