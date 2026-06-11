import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useRegisterForm } from './useRegisterForm';
import { authStyles } from '@/styles/auth.styles';
import { palette } from '@/styles/colors';

/** Écran d'inscription en 2 étapes : création du compte puis vérification du code. */
export default function RegisterScreen() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    pendingVerification,
    errorMessage,
    apiError,
    isBusy,
    onSignUpPress,
    onVerifyPress,
  } = useRegisterForm();

  // Phase 2 : saisie du code reçu par email.
  if (pendingVerification) {
    return (
      <View style={authStyles.container}>
        <View style={authStyles.card}>
          <Text style={authStyles.title}>Vérification</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Code reçu par email"
            placeholderTextColor={palette.gray500}
            keyboardType="number-pad"
            style={authStyles.input}
          />
          {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}
          {apiError ? <Text style={authStyles.errorText}>{apiError}</Text> : null}
          <Pressable
            onPress={onVerifyPress}
            disabled={isBusy}
            style={[authStyles.button, isBusy && authStyles.buttonDisabled]}
          >
            <Text style={authStyles.buttonText}>{isBusy ? 'Vérification…' : 'Vérifier'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Phase 1 : pseudo + email + mot de passe.
  return (
    <View style={authStyles.container}>
      <View style={authStyles.card}>
        <Image
          source={require('../../../assets/images/Logo GearConnect.png')}
          style={authStyles.logo}
          resizeMode="contain"
        />
        <Text style={authStyles.title}>Inscription</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Pseudo"
          placeholderTextColor={palette.gray500}
          autoCapitalize="none"
          style={authStyles.input}
        />
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
          onPress={onSignUpPress}
          disabled={isBusy}
          style={[authStyles.button, isBusy && authStyles.buttonDisabled]}
        >
          <Text style={authStyles.buttonText}>{isBusy ? 'Inscription…' : "S'inscrire"}</Text>
        </Pressable>
        <View style={authStyles.linkRow}>
          <Text>Déjà un compte ?</Text>
          <Link href="/(auth)/login">
            <Text style={authStyles.linkText}> Se connecter</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
