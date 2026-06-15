import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // attend le tokenCache
  if (!isLoaded) return null;

  // déjà connecté -> tabs
  if (isSignedIn) return <Redirect href="/(app)/(tabs)/home" />;

  // sinon, login/signup
  return <Stack screenOptions={{ headerShown: false }} />;
}
