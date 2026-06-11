import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useSignUp, useAuth } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';

export default function RegisterScreen() {
    const { signUp, errors, fetchStatus } = useSignUp();
    const [apiError, setApiError] = useState('')
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);

    const isBusy = fetchStatus === 'fetching';

    const { getToken } = useAuth()

    // Phase 1 : créer le compte puis envoyer le code de vérification par email.
    async function onSignUpPress() {
        const { error: createError } = await signUp.create({ emailAddress: email, password });
        if (createError) return;

        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) return;

        setPendingVerification(true);
    }

    // Phase 2 : vérifier le code reçu, puis activer la session.
    async function onVerifyPress() {
        setApiError('')
        await signUp.verifications.verifyEmailCode({ code })

        if (signUp.status === 'complete') {
            await signUp.finalize()
            const token = await getToken()

            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email, username }),
                })

                if (!response.ok) {
                    const data = await response.json()
                    setApiError(data.error ?? 'Failed to create profile')
                    return // stop here: don't redirect if the DB sync failed
                }

                router.replace('/(app)/(tabs)/home')
            } catch (error) {
                setApiError('Network error, please try again')
            }
        }
    }

    const errorMessage =
        errors.fields.emailAddress?.message ??
        errors.fields.password?.message ??
        errors.fields.code?.message ??
        errors.global?.[0]?.message;

    // Phase 2 : saisie du code reçu par email.
    if (pendingVerification) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24, backgroundColor: 'white' }}>
                <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="Code reçu par email"
                    keyboardType="number-pad"
                    style={{ borderWidth: 1, padding: 12 }}
                />
                {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
                {apiError ? <Text style={{ color: 'red' }}>{apiError}</Text> : null}
                <Button
                    title={isBusy ? 'Vérification…' : 'Vérifier'}
                    onPress={onVerifyPress}
                    disabled={isBusy}
                />
            </View>
        );
    }

    // Phase 1 : email + mot de passe.
    return (
        <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 24, backgroundColor: 'white' }}>
            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Pseudo"
                autoCapitalize="none"
                style={{ borderWidth: 1, padding: 12 }}
            />
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
                title={isBusy ? 'Inscription…' : "S'inscrire"}
                onPress={onSignUpPress}
                disabled={isBusy}
            />
            <Link href="/(auth)/login">
                <Text>Déjà un compte ? Se connecter</Text>
            </Link>
        </View>
    );
}
