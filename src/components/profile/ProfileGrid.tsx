import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { ReactElement } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/profileGrid.styles';
import type { FeedPost } from '@/types/post.types';
import { withCloudinaryAuto } from '@/utils/mediaUtils';

interface Props {
  posts: FeedPost[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  emptyLabel: string;
  header: ReactElement;
  onRefresh: () => void;
  onLoadMore: () => void;
}

/** Grille de vignettes (3 colonnes) des posts d'un onglet du profil, non cliquables. */
export default function ProfileGrid({
  posts,
  loading,
  refreshing,
  loadingMore,
  emptyLabel,
  header,
  onRefresh,
  onLoadMore,
}: Props) {
  return (
    <FlatList
      data={posts}
      numColumns={3}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <Thumb post={item} />}
      ListHeaderComponent={header}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.primary} />
      }
      ListEmptyComponent={
        loading ? (
          <View style={styles.empty}>
            <ActivityIndicator color={palette.primary} />
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{emptyLabel}</Text>
          </View>
        )
      }
      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={styles.footer} color={palette.primary} /> : null
      }
    />
  );
}

/** Vignette unique : première image du post, ou placeholder si post sans média. */
function Thumb({ post }: { post: FeedPost }) {
  const cover = post.media.find((m) => m.type === 'IMAGE') ?? post.media[0];

  return (
    <View style={styles.tile}>
      {cover ? (
        <Image source={withCloudinaryAuto(cover.url)} style={styles.tileImage} contentFit="cover" />
      ) : (
        <View style={[styles.tileImage, styles.tileFallback]}>
          <FontAwesome name="file-text-o" size={20} color={palette.gray500} />
        </View>
      )}
      {post.media.length > 1 && (
        <FontAwesome name="clone" size={14} color={palette.white} style={styles.multiBadge} />
      )}
    </View>
  );
}
