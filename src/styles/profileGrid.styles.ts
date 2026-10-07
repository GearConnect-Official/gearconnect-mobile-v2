import { Dimensions, StyleSheet } from 'react-native';
import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

const COLUMNS = 3;
const GAP = 1;
// Chaque vignette porte un marginRight de GAP, d'où GAP * COLUMNS à retrancher.
const TILE_SIZE = (Dimensions.get('window').width - GAP * COLUMNS) / COLUMNS;

export const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    marginBottom: GAP,
    marginRight: GAP,
  },
  tileImage: {
    flex: 1,
    backgroundColor: palette.gray200,
  },
  tileFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.gray100,
  },
  multiBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: palette.gray500,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});
