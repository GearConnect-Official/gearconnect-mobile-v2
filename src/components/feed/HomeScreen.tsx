import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { Text, View } from '@/components/Themed';
import { styles } from '@/styles/home.styles';

/** Écran d'accueil : point d'entrée vers la création d'un post. */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Pressable style={styles.createButton} onPress={() => router.push('/publication')}>
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.createButtonText} lightColor="#fff" darkColor="#fff">
          Créer un post
        </Text>
      </Pressable>
    </View>
  );
}
