import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Pattern, Rect, Stop } from 'react-native-svg';
import { carbonBackgroundStyles } from '@/styles/carbonBackground.styles';
import { colors } from '@/styles/colors';

/** Effet de texture carbone discrete qui s'efface vers le bas */
export default function CarbonBackground() {
  return (
    <View style={carbonBackgroundStyles.container}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="weave" width={6} height={6} patternUnits="userSpaceOnUse">
            <Rect width={6} height={6} fill={colors.surface1} />
            <Path d="M0 6 L6 0" stroke={colors.textPrimary} strokeOpacity={0.04} strokeWidth={2} />
            <Path d="M0 0 L6 6" stroke={colors.background} strokeOpacity={0.6} strokeWidth={2} />
          </Pattern>
          <LinearGradient id="fade" x1="0%" y1="0%" x2="0%" y2="1">
            <Stop offset="0.3" stopColor={colors.background} stopOpacity={0} />
            <Stop offset="1" stopColor={colors.background} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#weave)" />
        <Rect width="100%" height="100%" fill="url(#fade)" />
      </Svg>
    </View>
  );
}
