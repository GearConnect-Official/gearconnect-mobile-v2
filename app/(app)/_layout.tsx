import { useAuth, useUser } from '@clerk/expo';
import { Redirect, Stack, usePathname } from 'expo-router';
import { getDeletionDate } from '@/components/profile';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();

  // attend le tokenCache
  if (!isLoaded) return null;

  // pas connecté -> login
  if (!isSignedIn) return <Redirect href="/(auth)/login" />;

  // compte en cours de suppression -> écran de réactivation
  const pendingDeletion = getDeletionDate(user?.publicMetadata) !== null;
  if (pendingDeletion && pathname !== '/accountReactivation') {
    return <Redirect href="/accountReactivation" />;
  }

  // sinon, l'app (les tabs)
  return <Stack screenOptions={{ headerShown: false }} />;
}
