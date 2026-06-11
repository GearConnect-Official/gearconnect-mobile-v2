import { useState } from 'react';
import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { isValidEmail, isValidPassword } from './auth.validation';

export function useLoginForm() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();

  async function onSignInPress() {
    if (!isValidEmail(email)) {
      setValidationError('Email invalide');
      return;
    } else if (!isValidPassword(password)) {
      setValidationError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    } else {
      setValidationError(undefined);
      // create() ne throw pas : il renvoie { error } et met à jour le signal signIn.
      await signIn.create({ identifier: email, password });

      // Connexion terminée -> finalize() active la session (remplace setActive).
      if (signIn.status === 'complete') {
        await signIn.finalize();
        router.replace('/(app)/(tabs)/home');
      }
    }
  }

  // errors est réactif : on prend le premier message dispo (champ ou global).
  const errorMessage =
    validationError ??
    errors.fields.identifier?.message ??
    errors.fields.password?.message ??
    errors.global?.[0]?.message;

  const isBusy = fetchStatus === 'fetching';

  return {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    isBusy,
    onSignInPress,
  };
}
