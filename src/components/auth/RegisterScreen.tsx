import { Link } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, CarbonBackground, Input, Text } from '@/components/ui';
import { authStyles } from '@/styles/auth.styles';
import { useRegisterForm } from './useRegisterForm';

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
      <KeyboardAvoidingView
        style={authStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <CarbonBackground />
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.card}>
            <View style={authStyles.heading}>
              <Text style={authStyles.title}>Vérification</Text>
              <Text color="textSecondary">Saisis le code reçu par email</Text>
            </View>
            <Input
              label="Code"
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              keyboardType="number-pad"
            />
            {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}
            {apiError ? <Text style={authStyles.errorText}>{apiError}</Text> : null}
            <Button label="Vérifier" onPress={onVerifyPress} loading={isBusy} />
          </View>
        </ScrollView>
        <View style={authStyles.stripe} />
      </KeyboardAvoidingView>
    );
  }

  // Phase 1 : pseudo + email + mot de passe.
  return (
    <KeyboardAvoidingView
      style={authStyles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CarbonBackground />
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
          <View style={authStyles.heading}>
            <Text style={authStyles.title}>Inscription</Text>
            <Text color="textSecondary">Rejoins la communauté du sport auto.</Text>
          </View>
          <Input
            label="Pseudo"
            value={username}
            onChangeText={setUsername}
            placeholder="Pseudo"
            autoCapitalize="none"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="pilote@gearconnect.fr"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="*********"
            secureTextEntry
          />
          {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}
          <Button label={"S'inscrire"} onPress={onSignUpPress} loading={isBusy} />
          <View style={authStyles.linkRow}>
            <Text style={authStyles.hintText}>Déjà un compte ?</Text>
            <Link href="/(auth)/login">
              <Text style={authStyles.linkText}> Se connecter</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
      <View style={authStyles.stripe} />
    </KeyboardAvoidingView>
  );
}
