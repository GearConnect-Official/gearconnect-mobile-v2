import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { radius } from '@/styles/radius';
import { spacing } from '@/styles/spacing';
import { textStyles } from '@/styles/typography';

export const inputStyles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...textStyles.label,
    color: colors.textSecondary,
  },
  field: {
    fontFamily: textStyles.body.fontFamily,
    fontSize: textStyles.body.fontSize,
    color: colors.textPrimary,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  fieldFocused: {
    borderColor: colors.borderStrong,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
});
