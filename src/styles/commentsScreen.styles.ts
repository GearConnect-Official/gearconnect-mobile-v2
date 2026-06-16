import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray200,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: typography.label.fontWeight,
    color: palette.black,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: spacing.sm,
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: palette.gray200,
    marginLeft: spacing.md,
  },
  message: {
    color: palette.gray500,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: palette.gray100,
  },
  replyBannerText: {
    fontSize: typography.label.fontSize,
    color: palette.gray900,
  },
  replyBannerCancel: {
    fontSize: typography.label.fontSize,
    color: palette.primary,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.gray200,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: palette.gray100,
    borderRadius: 20,
    fontSize: typography.body.fontSize,
    color: palette.black,
  },
  send: {
    paddingHorizontal: spacing.sm,
  },
  sendText: {
    color: palette.primary,
    fontWeight: typography.label.fontWeight,
    fontSize: typography.label.fontSize,
  },
});
