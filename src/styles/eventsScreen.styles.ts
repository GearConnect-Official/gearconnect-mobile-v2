import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray100,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: palette.gray200,
    margin: spacing.md,
    borderRadius: 8,
    padding: spacing.xs,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: palette.white,
  },
  toggleText: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.gray500,
  },
  toggleTextActive: {
    color: palette.gray900,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: palette.white,
    fontSize: 28,
    lineHeight: 32,
  },
});
