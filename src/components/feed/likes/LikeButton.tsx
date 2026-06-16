import { FontAwesome } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/likeButton.styles';

interface Props {
  liked: boolean;
  count: number;
  onPress: () => void;
  size?: number;
}

/** Bouton like générique : cœur plein/vide + compteur. Ne sait rien de l'entité likée (post, commentaire). */
export default function LikeButton({ liked, count, onPress, size = 20 }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress} hitSlop={8}>
      <FontAwesome
        name={liked ? 'heart' : 'heart-o'}
        size={size}
        color={liked ? palette.primary : palette.black}
      />
      {count > 0 && <Text style={styles.count}>{count}</Text>}
    </Pressable>
  );
}
