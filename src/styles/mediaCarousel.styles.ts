import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  slide: {
    aspectRatio: 1,
    backgroundColor: '#000',
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  dotActive: {
    backgroundColor: '#2f95dc',
  },
});
