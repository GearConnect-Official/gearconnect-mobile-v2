const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export const palette = {
  primary: '#E10600',
  black: '#000000',
  white: '#FFFFFF',
  gray900: '#1A1A1A',
  gray500: '#8E8E8E',
  gray200: '#EFEFEF',
  gray100: '#FAFAFA',
  error: '#ED4956',
};

/* New style*/

export const scale = {
  carbon950: '#0B0C0E',
  carbon900: '#131519',
  carbon800: '#1B1E23',
  carbon700: '#2A2E35',
  carbon600: '#3A3F48',
  carbon500: '#6B717C',
  carbon300: '#A3A8B2',
  carbon50: '#F2F3F5',
  red600: '#B80500',
  red500: '#E10600',
  red400: '#FF4D45',
  green500: '#2BD46A',
  amber500: '#FFB020',
  white: '#FFFFFF',
} as const;

export const colors = {
  background: scale.carbon950,
  surface1: scale.carbon900,
  surface2: scale.carbon800,
  border: scale.carbon700,
  borderStrong: scale.carbon600,
  textPrimary: scale.carbon50,
  textSecondary: scale.carbon300,
  textMuted: scale.carbon500,
  accent: scale.red500,
  accentPressed: scale.red600,
  onAccent: scale.white,
  success: scale.green500,
  warning: scale.amber500,
  danger: scale.red400,
} as const;
