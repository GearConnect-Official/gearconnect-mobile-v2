import { Feather } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/shareButton.styles';

interface Props {
  count: number;
  onPress: () => void;
  size?: number;
}

/**
 * Bouton partage : icône + compteur. Le partage est un événement (pas un toggle),
 * donc l'icône reste neutre quel que soit l'état — comme le bouton commentaire.
 */
export default function ShareButton({ count, onPress, size = 20 }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress} hitSlop={8}>
      <Feather name="share-2" size={size} color={palette.black} />
      {count > 0 && <Text style={styles.count}>{count}</Text>}
    </Pressable>
  );
}
