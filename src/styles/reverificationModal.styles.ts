import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { radius } from './sizes';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: palette.overlay,
  },
  card: {
    backgroundColor: palette.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: palette.black,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.body.fontSize,
    color: palette.gray500,
    textAlign: 'center',
  },
  input: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.gray200,
    borderRadius: radius.sm,
    fontSize: typography.body.fontSize,
    color: palette.black,
  },
  errorText: {
    fontSize: typography.body.fontSize,
    color: palette.error,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.gray200,
  },
  cancelText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.black,
  },
  confirm: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: palette.error,
  },
  confirmDisabled: {
    backgroundColor: palette.gray500,
  },
  confirmText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.white,
  },
});
