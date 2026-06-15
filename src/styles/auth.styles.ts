import { StyleSheet } from 'react-native';
import { palette } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { typography } from '@/styles/typography';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: palette.gray100,
  },
  // Variante scrollable : carte centrée quand le contenu tient, défilable
  // quand le clavier réduit la place (sinon le bas du formulaire est masqué).
  flex: {
    flex: 1,
    backgroundColor: palette.gray100,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: palette.white,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: palette.gray900,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.gray200,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: palette.gray900,
    backgroundColor: palette.gray100,
  },
  button: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.label,
    color: palette.white,
  },
  errorText: {
    ...typography.body,
    color: palette.error,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  linkText: {
    ...typography.label,
    color: palette.primary,
  },
});
