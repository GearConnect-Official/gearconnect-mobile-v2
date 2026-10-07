import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.gray200,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.gray500,
  },
  username: {
    fontSize: 15,
    fontWeight: typography.label.fontWeight,
    color: palette.black,
  },
  verified: {
    marginLeft: -spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionCount: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.black,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    fontSize: typography.body.fontSize,
    lineHeight: 20,
    color: palette.black,
  },
});
