import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray100,
    padding: spacing.xl,
    paddingTop: spacing.header,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.gray200,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: palette.black,
    backgroundColor: palette.white,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.white,
  },
  buttonSubmit: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  error: {
    color: palette.error,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.md,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginVertical: spacing.md,
  },
});
