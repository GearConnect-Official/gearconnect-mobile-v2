import { Link } from 'expo-router';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { authStyles } from '@/styles/auth.styles';
import { palette } from '@/styles/colors';
import { useLoginForm } from './useLoginForm';

/** Écran de connexion. */
export default function LoginScreen() {
  const { email, setEmail, password, setPassword, errorMessage, isBusy, onSignInPress } =
    useLoginForm();

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={authStyles.card}>
        <Image
          source={require('../../../assets/images/Logo GearConnect.png')}
          style={authStyles.logo}
          resizeMode="contain"
        />
        <Text style={authStyles.title}>Connexion</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={palette.gray500}
          autoCapitalize="none"
          keyboardType="email-address"
          style={authStyles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe"
          placeholderTextColor={palette.gray500}
          secureTextEntry
          style={authStyles.input}
        />
        {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}
        <Pressable
          onPress={onSignInPress}
          disabled={isBusy}
          style={[authStyles.button, isBusy && authStyles.buttonDisabled]}
        >
          <Text style={authStyles.buttonText}>{isBusy ? 'Connexion…' : 'Se connecter'}</Text>
        </Pressable>
        <View style={authStyles.linkRow}>
          <Text>Pas de compte ?</Text>
          <Link href="/(auth)/register">
            <Text style={authStyles.linkText}> S&apos;inscrire</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
