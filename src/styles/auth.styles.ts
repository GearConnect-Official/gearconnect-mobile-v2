import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { textStyles, typography } from '@/styles/typography';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  // Variante scrollable : carte centrée quand le contenu tient, défilable
  // quand le clavier réduit la place (sinon le bas du formulaire est masqué).
  flex: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: 'transparent',
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...textStyles.display,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    backgroundColor: colors.surface1,
  },
  button: {
    backgroundColor: colors.accent,
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
    color: colors.onAccent,
  },
  errorText: {
    ...textStyles.body,
    color: colors.danger,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  linkText: {
    ...textStyles.label,
    color: colors.textPrimary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.accent,
  },
  hintText: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  brandLogo: {
    width: 40,
    height: 40,
  },
  heading: {
    gap: spacing.xs,
  },
  stripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: colors.accent,
  },
});
