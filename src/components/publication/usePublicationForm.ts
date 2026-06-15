import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createPost, getCurrentUser } from '@/services/api/postService';
import type { SelectedMedia } from '@/types/post.types';
import type { CurrentUser } from '@/types/user.types';

type Step = 1 | 2;

export function usePublicationForm() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [me, setMe] = useState<CurrentUser | null>(null);

  // Profil DB de l'auteur, pour l'aperçu et l'id à la publication.
  // Chargé une seule fois au montage : `getToken` change de référence à chaque
  // render côté Clerk, le mettre en dépendance relancerait l'effet en boucle.
  // biome-ignore lint/correctness/useExhaustiveDependencies: chargement unique au montage, getToken est volontairement exclu.
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
  const goToCaption = () => setStep(2);
  const goBackToMedia = () => setStep(1);

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

  return {
    step,
    media,
    setMedia,
    description,
    setDescription,
    publishing,
    author,
    cancel,
    goToCaption,
    goBackToMedia,
    publish,
  };
}
