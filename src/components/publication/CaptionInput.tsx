import { TextInput } from 'react-native';

import { styles } from '@/styles/captionInput.styles';

interface Props {
  value: string;
  onChange: (text: string) => void;
}

/** Étape 2 : saisie de la description du post. */
export default function CaptionInput({ value, onChange }: Props) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder="Décris ton post..."
      placeholderTextColor="#999"
      multiline
      maxLength={2200}
      autoFocus
    />
  );
}
