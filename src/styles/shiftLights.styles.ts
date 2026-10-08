import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';
import { radius } from '@/styles/radius';

export const shiftLightsStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  light: { flex: 1, height: 4, borderRadius: radius.sm, backgroundColor: colors.surface2 },
});
