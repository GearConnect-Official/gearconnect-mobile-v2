import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.black,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.sm,
  },
  eventCard: {
    backgroundColor: palette.white,
    borderRadius: 18,
    padding: 18,
  },
  eventTag: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    color: palette.black,
  },
  eventMeta: {
    fontSize: typography.label.fontSize,
    color: palette.gray500,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto' as unknown as number,
  },
  ctaButton: {
    marginLeft: 'auto' as unknown as number,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  ctaText: {
    color: palette.white,
    fontSize: typography.label.fontSize,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: palette.gray500,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  dateBlock: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
  },
  dateMonth: {
    fontSize: 9,
    fontWeight: '600',
    color: palette.gray500,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  rowTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: '600',
    color: palette.white,
  },
  rowSub: {
    fontSize: 12,
    color: palette.gray500,
    marginTop: 2,
  },
});
