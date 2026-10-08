import { useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';
import { colors } from '@/styles/colors';
import { inputStyles } from '@/styles/input.styles';
import Text from './Text';

interface Props extends TextInputProps {
  label: string;
}

/** Input avec son label au couleur du thème */
export default function Input({ label, onFocus, onBlur, style, ...props }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={[inputStyles.field, isFocused && inputStyles.fieldFocused, style]}
        {...props}
      />
    </View>
  );
}
