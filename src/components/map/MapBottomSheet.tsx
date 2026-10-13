import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { styles } from '@/styles/map.styles';
import type { MapMarker } from './useMap';

const COLLAPSED = 150;
const EXPANDED = 700;

interface Props {
  markers: MapMarker[];
  selectedMarkerId: string | null;
  onClose: () => void;
}

function EventCard({ marker }: { marker: MapMarker }) {
  const distanceLabel = `à ${marker.distanceKm.toFixed(1)} km`;
  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventTag}>Événement {distanceLabel}</Text>
      <Text style={styles.eventTitle}>{marker.title}</Text>
      <View style={styles.eventFooter}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push(`/eventDetail?id=${marker.id}`)}
        >
          <Text style={styles.ctaText}>Voir l'événement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EventRow({ marker }: { marker: MapMarker }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/eventDetail?id=${marker.id}`)}
    >
      <View style={styles.dateBlock}>
        <Text style={styles.dateNumber}>-</Text>
      </View>
      <View>
        <Text style={styles.rowTitle}>{marker.title}</Text>
        <Text style={styles.rowSub}>à {marker.distanceKm.toFixed(1)} km</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MapBottomSheet({ markers, selectedMarkerId }: Props) {
  const sheetHeight = useSharedValue(COLLAPSED);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    sheetHeight.value = withSpring(COLLAPSED);
    setIsExpanded(false);
  }, [sheetHeight]);
  const selectedMarker = markers.find((m) => m.id === selectedMarkerId);
  const otherMarkers = markers.filter((m) => m.id !== selectedMarkerId).slice(0, 3);
  const panGesture = Gesture.Pan().onEnd((e) => {
    'worklet';
    if (e.velocityY < -200 || e.translationY < -40) {
      sheetHeight.value = withSpring(EXPANDED);
      runOnJS(setIsExpanded)(true);
    } else if (e.velocityY > 200 || e.translationY > 40) {
      sheetHeight.value = withSpring(COLLAPSED);
      runOnJS(setIsExpanded)(false);
    }
  });
  const animatedStyle = useAnimatedStyle(() => ({ height: sheetHeight.value }));

  if (!selectedMarker) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.sheet, animatedStyle]}>
        <EventCard marker={selectedMarker} />
        {isExpanded && (
          <>
            <Text style={styles.sectionLabel}>À proximité</Text>
            {otherMarkers.map((m) => (
              <EventRow key={m.id} marker={m} />
            ))}
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
