import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/postItem.styles';
import type { FeedPost } from '@/types/post.types';
import { withCloudinaryAuto } from '@/utils/mediaUtils';
import MediaCarousel from './MediaCarousel';

interface Props {
  post: FeedPost;
  active?: boolean;
  onToggleLike: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onOpenProfile?: (userId: number) => void;
}

/** Carte d'un post dans le feed : auteur, carrousel média, actions et compteurs. */
function PostItem({
  post,
  active = false,
  onToggleLike,
  onComment,
  onShare,
  onOpenProfile,
}: Props) {
  const { author, media, body, likeCount, commentCount, likedByMe } = post;

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => onOpenProfile?.(author.id)} hitSlop={6}>
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
        {author.isVerify && (
          <FontAwesome
            name="check-circle"
            size={14}
            color={palette.primary}
            style={styles.verified}
          />
        )}
      </Pressable>

      <MediaCarousel items={media.map((m) => ({ uri: m.url, type: m.type }))} active={active} />

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => onToggleLike(post.id)} hitSlop={8}>
          <FontAwesome
            name={likedByMe ? 'heart' : 'heart-o'}
            size={20}
            color={likedByMe ? palette.primary : palette.black}
          />
          {likeCount > 0 && <Text style={styles.actionCount}>{likeCount}</Text>}
        </Pressable>

        <Pressable style={styles.action} onPress={() => onComment?.(post.id)} hitSlop={8}>
          <FontAwesome name="comment-o" size={20} color={palette.black} />
          {commentCount > 0 && <Text style={styles.actionCount}>{commentCount}</Text>}
        </Pressable>

        <Pressable style={styles.action} onPress={() => onShare?.(post.id)} hitSlop={8}>
          <FontAwesome name="share" size={20} color={palette.black} />
        </Pressable>
      </View>

      {body.length > 0 && <Text style={styles.body}>{body}</Text>}
    </View>
  );
}

export default memo(PostItem);
