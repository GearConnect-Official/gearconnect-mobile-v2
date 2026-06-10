import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
    // Nouvelle API "Future" (signals) : pas de isLoaded/setActive ici.
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSignInPress() {
        // create() ne throw pas : il renvoie { error } et met à jour le signal signIn.
        await signIn.create({ identifier: email, password });

        // Connexion terminée -> finalize() active la session (remplace setActive).
        if (signIn.status === 'complete') {
            await signIn.finalize();
            router.replace('/(app)/(tabs)/home');
        }
    }

    // errors est réactif : on prend le premier message dispo (champ ou global).
    const errorMessage =
        errors.fields.identifier?.message ??
        errors.fields.password?.message ??
        errors.global?.[0]?.message;

    const isBusy = fetchStatus === 'fetching';

    return (
        <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24, backgroundColor: 'white' }}>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ borderWidth: 1, padding: 12 }}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                secureTextEntry
                style={{ borderWidth: 1, padding: 12 }}
            />
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
            <Button
                title={isBusy ? 'Connexion…' : 'Se connecter'}
                onPress={onSignInPress}
                disabled={isBusy}
            />
            <Link href="/(auth)/register">
                <Text>Pas de compte ? S&apos;inscrire</Text>
            </Link>
        </View>
    );
}
