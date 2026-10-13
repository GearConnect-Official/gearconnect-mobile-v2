import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/commentItem.styles';
import type { FeedComment } from '@/types/comment.types';
import { withCloudinaryAuto } from '@/utils/mediaUtils';
import { LikeButton } from '../likes';

interface Props {
  comment: FeedComment;
  currentUserId: number | null;
  onToggleLike: (commentId: number) => void;
  onReply: (comment: FeedComment) => void;
  onDelete: (commentId: number) => void;
}

/** Une ligne de commentaire (brut) : auteur, contenu, like, répondre, suppression et réponses imbriquées. */
export default function CommentItem({
  comment,
  currentUserId,
  onToggleLike,
  onReply,
  onDelete,
}: Props) {
  const { author } = comment;
  const isMine = currentUserId != null && author.id === currentUserId;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {author.avatarUrl ? (
          <Image
            source={withCloudinaryAuto(author.avatarUrl)}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <FontAwesome name="user" size={12} color={palette.white} />
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.authorRow}>
            <Text style={styles.username}>{author.username}</Text>
            {author.isVerify && (
              <FontAwesome name="check-circle" size={12} color={palette.primary} />
            )}
          </View>
          <Text style={styles.content}>{comment.content}</Text>

          <View style={styles.actions}>
            <LikeButton
              liked={comment.likedByMe}
              count={comment.likeCount}
              onPress={() => onToggleLike(comment.id)}
              size={16}
            />
            <Pressable onPress={() => onReply(comment)} hitSlop={8}>
              <Text style={styles.actionText}>Répondre</Text>
            </Pressable>
            {isMine && (
              <Pressable onPress={() => onDelete(comment.id)} hitSlop={8}>
                <Text style={styles.actionText}>Supprimer</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onToggleLike={onToggleLike}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
}
