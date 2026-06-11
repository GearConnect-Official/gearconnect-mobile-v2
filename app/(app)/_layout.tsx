import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // attend le tokenCache
  if (!isLoaded) return null;

  // pas connecté -> login
  if (!isSignedIn) return <Redirect href="/(auth)/login" />;

  // sinon, l'app (les tabs)
  return <Stack screenOptions={{ headerShown: false }} />;
}
