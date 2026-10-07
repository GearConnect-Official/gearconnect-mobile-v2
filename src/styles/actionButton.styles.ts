import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  count: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: palette.black,
  },
});
