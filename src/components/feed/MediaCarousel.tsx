import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from 'react-native';
import { styles } from '@/styles/mediaCarousel.styles';
import type { MediaType } from '@/types/post.types';
import { withCloudinaryAuto } from '@/utils/mediaUtils';

export interface CarouselItem {
  uri: string;
  type: MediaType;
}

interface Props {
  items: CarouselItem[];
}

/** Une slide vidéo : player dédié + contrôles natifs. */
function CarouselVideo({ uri, width }: { uri: string; width: number }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
  });
  return (
    <VideoView
      player={player}
      style={[styles.slide, { width }]}
      contentFit="cover"
      nativeControls
    />
  );
}

/** Carrousel horizontal "page par page" pour images (expo-image) et vidéos (expo-video). */
export default function MediaCarousel({ items }: Props) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View>
      <FlatList
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        keyExtractor={(item, i) => `${item.uri}-${i}`}
        renderItem={({ item }) =>
          item.type === 'VIDEO' ? (
            <CarouselVideo uri={item.uri} width={width} />
          ) : (
            <Image
              source={withCloudinaryAuto(item.uri)}
              style={[styles.slide, { width }]}
              contentFit="cover"
              transition={150}
            />
          )
        }
      />

      {items.length > 1 && (
        <View style={styles.dots}>
          {items.map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional indicators, no stable id available
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}
