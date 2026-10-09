import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { textStyles } from '@/styles/typography';

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
  title: {
    ...textStyles.display,
    color: colors.textPrimary,
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
