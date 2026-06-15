// Dispatcher d'entrée — décide où envoyer l'utilisateur au lancement.
// (ARCHITECTURE.md : "index.tsx -> Redirect vers (auth) ou (app)")

import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  return <Redirect href={isSignedIn ? '/(app)/(tabs)/home' : '/(auth)/login'} />;
}
