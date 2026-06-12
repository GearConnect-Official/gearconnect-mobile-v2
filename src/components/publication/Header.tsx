import { FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { styles } from '@/styles/header.styles';

interface Props {
  leftIcon: 'close' | 'back';
  onLeft: () => void;
  rightLabel: string;
  onRight: () => void;
  rightDisabled?: boolean;
  rightLoading?: boolean;
}

/** Barre supérieure contextuelle de l'écran de création. */
export default function Header({
  leftIcon,
  onLeft,
  rightLabel,
  onRight,
  rightDisabled,
  rightLoading,
}: Props) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onLeft} hitSlop={10}>
        <FontAwesome
          name={leftIcon === 'close' ? 'times' : 'angle-left'}
          size={leftIcon === 'close' ? 24 : 30}
          color="#111"
        />
      </Pressable>

      <Pressable onPress={onRight} disabled={rightDisabled || rightLoading} hitSlop={10}>
        {rightLoading ? (
          <ActivityIndicator color="#2f95dc" />
        ) : (
          <Text style={[styles.right, rightDisabled && styles.rightDisabled]}>{rightLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}
