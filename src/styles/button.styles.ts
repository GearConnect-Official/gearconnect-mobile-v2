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
  primary: { backgroundColor: colors.accent, justifyContent: 'space-between' },
  primaryPressed: { backgroundColor: colors.accentPressed },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderStrong },
  secondaryPressed: { backgroundColor: colors.surface1 },
  ghost: { backgroundColor: 'transparent' },
  ghostPressed: { backgroundColor: colors.surface1 },
  disabled: { opacity: 0.5 },
  chevron: { letterSpacing: -2 },
  loading: { justifyContent: 'center' },
  cutCorner: { position: 'absolute', right: 0, bottom: 0, width: 0, height: 0, borderLeftWidth: 12, borderBottomWidth: 12, borderLeftColor: 'transparent', borderBottomColor: colors.background,
  },
});
