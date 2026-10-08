import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { radius } from '@/styles/radius';
import { spacing } from '@/styles/spacing';

export const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  primary: { backgroundColor: colors.accent },
  primaryPressed: { backgroundColor: colors.accentPressed },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderStrong },
  secondaryPressed: { backgroundColor: colors.surface1 },
  ghost: { backgroundColor: 'transparent' },
  ghostPressed: { backgroundColor: colors.surface1 },
  disabled: { opacity: 0.5 },
});
