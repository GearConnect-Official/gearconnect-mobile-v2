import { Text as RNText, type TextProps } from 'react-native';
import { colors } from '@/styles/colors';
import { textStyles } from '@/styles/typography';

interface Props extends TextProps {
  variant?: keyof typeof textStyles;
  color?: keyof typeof colors;
}

/** Composant avec un style prédéfini */
export default function Text({ variant = 'body', color = 'textPrimary', style, ...props }: Props) {
  return <RNText style={[textStyles[variant], { color: colors[color] }, style]} {...props} />;
}
