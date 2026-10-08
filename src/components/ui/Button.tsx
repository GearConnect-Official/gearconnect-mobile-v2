import { ActivityIndicator, Pressable } from 'react-native';
import { buttonStyles } from '@/styles/button.styles';
import { colors } from '@/styles/colors';
import Text from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
}

const pressedStyles = {
  primary: buttonStyles.primaryPressed,
  secondary: buttonStyles.secondaryPressed,
  ghost: buttonStyles.ghostPressed,
};

/** Composant button deja stylisé  */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: Props) {
  const isDisabled = disabled || loading;
  const textColor = variant === 'primary' ? 'onAccent' : 'textPrimary';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        buttonStyles.base,
        buttonStyles[variant],
        pressed && pressedStyles[variant],
        isDisabled && buttonStyles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[textColor]} />
      ) : (
        <Text variant="button" color={textColor}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
