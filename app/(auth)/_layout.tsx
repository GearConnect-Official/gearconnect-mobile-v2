import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';

export default function AuthLayout() {
    const { isLoaded, isSignedIn } = useAuth()
    
    // attend le tokenCache
    if (!isLoaded) return null
    
    // déjà connecté -> tabs
    if (isSignedIn) return <Redirect href="/(app)/(tabs)/home" />

    // sinon, login/signup
    return <Stack screenOptions={{ headerShown: false }} />
}