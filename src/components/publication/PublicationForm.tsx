import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';

import { PostItem } from '@/components/feed';
import { SelectedMedia } from '@/types/post.types';
import { CurrentUser } from '@/types/user.types';
import { createPost, getCurrentUser } from '@/services/api/postService';

import { styles } from '@/styles/publicationForm.styles';
import Header from './Header';
import MediaSection from './MediaSection';
import CaptionInput from './CaptionInput';

type Step = 1 | 2;

/** Écran de création de post en 2 étapes : sélection des médias → aperçu + description. */
export default function PublicationForm() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [me, setMe] = useState<CurrentUser | null>(null);

  // Profil DB de l'auteur, pour l'aperçu et l'id à la publication.
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) setMe(await getCurrentUser(token));
      } catch {
        // profil indisponible : l'aperçu affichera un placeholder
      }
    })();
  }, []);

  const author = {
    username: me?.username ?? '',
    avatarUrl: me?.profilePicture,
  };

  const cancel = () => router.back();

  const publish = async () => {
    setPublishing(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');

      const userId = me?.id ?? (await getCurrentUser(token)).id;
      await createPost({ body: description.trim(), userId, media }, token);

      router.replace('/(app)/(tabs)/home');
    } catch (e) {
      Alert.alert('Échec', e instanceof Error ? e.message : 'Impossible de publier.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {step === 1 ? (
        <>
          <Header
            leftIcon="close"
            onLeft={cancel}
            rightLabel="Suivant"
            onRight={() => setStep(2)}
            rightDisabled={media.length === 0}
          />
          <MediaSection media={media} onChange={setMedia} />
        </>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Header
            leftIcon="back"
            onLeft={() => setStep(1)}
            rightLabel="Partager"
            onRight={publish}
            rightDisabled={description.trim().length === 0}
            rightLoading={publishing}
          />
          <ScrollView keyboardShouldPersistTaps="handled">
            {/* Aperçu live : la vraie carte du feed, alimentée par le brouillon. */}
            <PostItem
              author={author}
              media={media.map((m) => ({ uri: m.uri, type: m.type }))}
              body=""
            />
            <View style={styles.divider} />
            <CaptionInput value={description} onChange={setDescription} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
