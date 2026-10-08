import { Feather } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { styles } from '@/styles/actionButton.styles';
import { palette } from '@/styles/colors';

interface Props {
  count: number;
  onPress: () => void;
  size?: number;
}

/** Bouton partage : icône neutre (un partage est un événement, pas un toggle) + compteur. */
export default function ShareButton({ count, onPress, size = 20 }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress} hitSlop={8}>
      <Feather name="share-2" size={size} color={palette.black} />
      {count > 0 && <Text style={styles.count}>{count}</Text>}
    </Pressable>
  );
}
