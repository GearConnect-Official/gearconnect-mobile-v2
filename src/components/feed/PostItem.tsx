import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';

import { withCloudinaryAuto } from '@/utils/mediaUtils';
import { styles } from '@/styles/postItem.styles';
import MediaCarousel, { CarouselItem } from './MediaCarousel';

export interface PostAuthor {
  username: string;
  avatarUrl?: string | null;
}

interface Props {
  author: PostAuthor;
  media: CarouselItem[];
  body: string;
}

/** Carte d'un post — utilisée dans le feed ET comme aperçu live à la création. */
export default function PostItem({ author, media, body }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {author.avatarUrl ? (
          <Image source={withCloudinaryAuto(author.avatarUrl)} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <FontAwesome name="user" size={16} color="#fff" />
          </View>
        )}
        <Text style={styles.username}>{author.username}</Text>
      </View>

      <MediaCarousel items={media} />

      {body.length > 0 && <Text style={styles.body}>{body}</Text>}
    </View>
  );
}
