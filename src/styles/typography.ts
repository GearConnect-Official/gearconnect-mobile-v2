import { StyleSheet } from 'react-native';

export const typography = {
  title: { fontSize: 28, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
} as const;

export const fonts = {
  Barlow: {
    bodyRegular: 'Barlow_400Regular',
    bodyMedium: 'Barlow_500Medium',
    bodySemiBold: 'Barlow_600SemiBold',
  },
  BarlowCondensed: {
    displaySemiBold: 'BarlowCondensed_600SemiBold',
    displayBold: 'BarlowCondensed_700Bold',
  },
  JetBrainsMono: {
    monoRegular: 'JetBrainsMono_400Regular',
    monoMedium: 'JetBrainsMono_500Medium',
  },
} as const;

export const textStyles = StyleSheet.create({
  display: {
    fontSize: 44,
    lineHeight: 42,
    fontFamily: fonts.BarlowCondensed.displayBold,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.BarlowCondensed.displayBold,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.BarlowCondensed.displayBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.BarlowCondensed.displaySemiBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  body: { fontSize: 15, lineHeight: 22, fontFamily: fonts.Barlow.bodyRegular },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: fonts.Barlow.bodyRegular },
  stat: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.JetBrainsMono.monoMedium,
    fontVariant: ['tabular-nums'],
  },
});
