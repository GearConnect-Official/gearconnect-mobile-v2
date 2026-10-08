export const typography = {
  title: { fontSize: 28, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
} as const;

export const textStyles = {
  display: { fontSize: 44, lineHeight: 42, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 24, lineHeight: 28, fontWeight: '700', textTransform: 'uppercase' },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  stat: { fontSize: 24, lineHeight: 28, fontWeight: '500', fontVariant: ['tabular-nums'] },
} as const;
