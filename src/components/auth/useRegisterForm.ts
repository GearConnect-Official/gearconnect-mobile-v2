import { useState } from 'react';
import { useSignUp, useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidVerificationCode,
} from './auth.validation';

export function useRegisterForm() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const [apiError, setApiError] = useState('');
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  const isBusy = fetchStatus === 'fetching';

  const { getToken } = useAuth();

  // Phase 1 : créer le compte puis envoyer le code de vérification par email.
  async function onSignUpPress() {
    if (!isValidUsername(username)) {
      setValidationError('Le pseudo doit contenir au moins 3 caractères');
      return;
    }
    if (!isValidEmail(email)) {
      setValidationError('Email invalide');
      return;
    }
    if (!isValidPassword(password)) {
      setValidationError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setValidationError(undefined);

    const { error: createError } = await signUp.create({ emailAddress: email, password });
    if (createError) return;

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) return;

    setPendingVerification(true);
  }

  // Phase 2 : vérifier le code reçu, puis activer la session.
  async function onVerifyPress() {
    if (!isValidVerificationCode(code)) {
      setValidationError('Le code doit contenir 6 chiffres');
      return;
    }
    setValidationError(undefined);
    setApiError('');
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === 'complete') {
      await signUp.finalize();
      const token = await getToken();

      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, username }),
        });

        if (!response.ok) {
          const data = await response.json();
          setApiError(data.error ?? 'Failed to create profile');
          return; // stop here: don't redirect if the DB sync failed
        }

        router.replace('/(app)/(tabs)/home');
      } catch {
        setApiError('Network error, please try again');
      }
    }
  }

  const errorMessage =
    validationError ??
    errors.fields.emailAddress?.message ??
    errors.fields.password?.message ??
    errors.fields.code?.message ??
    errors.global?.[0]?.message;

  return {
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
  };
}
