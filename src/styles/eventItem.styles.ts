import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    borderRadius: 8,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  title: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.gray900,
    marginBottom: spacing.xs,
  },
  circuit: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: palette.gray500,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: palette.primary,
  },
});