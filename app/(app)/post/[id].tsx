import { useLocalSearchParams } from 'expo-router';
import { HomeScreen } from '@/components/feed';

/** Lien partagé d'un post : ouvre le feed avec ce post épinglé en tête. */
export default function SharedPost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  return <HomeScreen initialPostId={Number.isFinite(postId) ? postId : undefined} />;
}
