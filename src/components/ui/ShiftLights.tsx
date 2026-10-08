import { View } from 'react-native';
import { colors } from '@/styles/colors';
import { shiftLightsStyles } from '@/styles/shiftLights.styles';

interface Props {
  level: number;
}

const LIGHTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function colorFor(index: number) {
  if (index < 4) return colors.success;
  if (index < 7) return colors.warning;
  return colors.accent;
}

/** Rangée de voyants façon volant de course, allumés selon un niveau de 0 à 10 */
export default function ShiftLights({ level }: Props) {
  return (
    <View style={shiftLightsStyles.row}>
      {LIGHTS.map((index) => (
        <View
          key={index}
          style={[shiftLightsStyles.light, index < level && { backgroundColor: colorFor(index) }]}
        />
      ))}
    </View>
  );
}
