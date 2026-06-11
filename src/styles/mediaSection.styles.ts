import { StyleSheet } from 'react-native';

const THUMB = 96;

export const styles = StyleSheet.create({
  container: { flex: 1 },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f0f6fb',
  },
  actionDisabled: { opacity: 0.4 },
  actionText: { color: '#2f95dc', fontWeight: '600', fontSize: 15 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: { color: '#999', fontSize: 15 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
  },
  thumbWrapper: {
    width: THUMB,
    height: THUMB,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumb: { width: '100%', height: '100%', backgroundColor: '#eee' },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 4,
  },
  remove: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
  },
});
