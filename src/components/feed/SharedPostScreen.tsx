import { useLocalSearchParams } from 'expo-router';
import HomeScreen from './HomeScreen';

/** Lien partagé d'un post : ouvre le feed avec ce post épinglé en tête. */
export default function SharedPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  return <HomeScreen initialPostId={Number.isFinite(postId) ? postId : undefined} />;
}
