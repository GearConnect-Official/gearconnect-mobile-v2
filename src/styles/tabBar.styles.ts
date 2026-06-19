import { palette } from './colors';
import { spacing } from './spacing';

export const tabBarStyles = {
  tabBarActiveTintColor: palette.primary,
  tabBarInactiveTintColor: palette.gray500,
  tabBarStyle: {
    backgroundColor: palette.white,
    borderTopColor: palette.gray200,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
};
