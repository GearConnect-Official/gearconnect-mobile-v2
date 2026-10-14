import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { radius } from './sizes';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
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
  button: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: palette.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.white,
  },
  link: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: typography.body.fontSize,
    color: palette.black,
  },
});
