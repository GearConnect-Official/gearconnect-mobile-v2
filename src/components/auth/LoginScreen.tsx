import { Link } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Input, ShiftLights, Text } from '@/components/ui';
import { authStyles } from '@/styles/auth.styles';
import { useLoginForm } from './useLoginForm';

function formProgress(email: string, password: string) {
  let level = 0;
  if (email.trim().length > 0) level += 2;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) level += 3;
  return level + Math.min(password.length, 5);
}

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
        <View style={authStyles.brandRow}>
          <Image
            source={require('../../../assets/images/Logo GearConnect.png')}
            style={authStyles.brandLogo}
            resizeMode="contain"
          />
          <Text variant="title">
            Gear
            <Text variant="title" color="accent">
              Connect
            </Text>
          </Text>
        </View>
        <ShiftLights level={formProgress(email, password)} />
        <View style={authStyles.heading}>
          <Text style={authStyles.title}>Connexion</Text>
          <Text color="textSecondary">Retrouve ton paddock, tes circuits et tes pilotes.</Text>
        </View>
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
      <View style={authStyles.stripe} />
    </KeyboardAvoidingView>
  );
}
