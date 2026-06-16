import { useAuth } from '@clerk/expo';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/home.styles';
import type { FeedPost } from '@/types/post.types';
import PostItem from './PostItem';
import { usePosts } from './usePosts';

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 70, minimumViewTime: 250 };

/** Écran d'accueil : feed des posts (scroll infini + pull-to-refresh). */
export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { posts, loading, refreshing, loadingMore, error, refresh, loadMore, toggleLike } =
    usePosts();

  const [activeId, setActiveId] = useState<number | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.item as FeedPost | undefined;
    setActiveId(first?.id ?? null);
  });
  const viewabilityConfig = useRef(VIEWABILITY_CONFIG);

  const onComment = useCallback(
    (postId: number) => router.push(`/comments?id=${postId}`),
    [router],
  );
  const onShare = useCallback(() => Alert.alert('Partager', 'Bientôt disponible.'), []);

  const renderItem = useCallback(
    ({ item }: { item: FeedPost }) => (
      <PostItem
        post={item}
        active={item.id === activeId}
        onToggleLike={toggleLike}
        onComment={onComment}
        onShare={onShare}
      />
    ),
    [activeId, toggleLike, onComment, onShare],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>GearConnect</Text>
        <View style={styles.topActions}>
          <Pressable onPress={() => router.push('/publication')} hitSlop={10}>
            <FontAwesome name="plus-square-o" size={24} color={palette.black} />
          </Pressable>
          <Pressable onPress={() => signOut()} hitSlop={10}>
            <FontAwesome name="sign-out" size={22} color={palette.black} />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={palette.primary} />
        </View>
      ) : error && posts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
          <Pressable style={styles.retry} onPress={refresh}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          viewabilityConfig={viewabilityConfig.current}
          onViewableItemsChanged={onViewableItemsChanged.current}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={palette.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.message}>Aucun post pour le moment.</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={styles.footer} color={palette.primary} /> : null
          }
        />
      )}
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}
