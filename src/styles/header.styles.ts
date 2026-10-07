import { StyleSheet } from 'react-native';
import { palette } from './colors';

export const styles = StyleSheet.create({
  bar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  right: {
    color: palette.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  rightDisabled: {
    color: '#bcd',
  },
});
