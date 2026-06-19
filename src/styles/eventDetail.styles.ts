import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray100,
    padding: spacing.md,
    paddingTop: spacing.header,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: palette.gray900,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
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
    color: palette.gray500,
    marginBottom: spacing.xs,
  },
  participants: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: palette.gray500,
    marginBottom: spacing.lg,
  },
  joinBtn: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  joinBtnDisabled: {
    backgroundColor: palette.gray200,
  },
  joinBtnText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.white,
  },
});
