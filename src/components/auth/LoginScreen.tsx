import { Link } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, Input } from '@/components/ui';
import { authStyles } from '@/styles/auth.styles';
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
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="pilote@gearconnect.app"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          secureTextEntry
        />
        {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}
        <Button label="Se connecter" onPress={onSignInPress} loading={isBusy} />
        <View style={authStyles.linkRow}>
          <Text style={authStyles.hintText}>Pas de compte ?</Text>
          <Link href="/(auth)/register">
            <Text style={authStyles.linkText}> S&apos;inscrire</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
