import { StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray100,
  },
  list: {
    paddingVertical: spacing.md,
    color: palette.gray900,
  },
});
