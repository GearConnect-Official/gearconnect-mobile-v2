import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from '@/styles/map.styles';
import MapBottomSheet from './MapBottomSheet';
import { type MapMarker, useMap } from './useMap';

interface Props {
  onSelectionChange?: (isSelected: boolean) => void;
}

function toAppleMarkers(markers: MapMarker[]): AppleMaps.Marker[] {
  return markers.map((marker) => ({
    id: marker.id,
    coordinates: {
      latitude: marker.latitude,
      longitude: marker.longitude,
    },
    title: marker.title,
  }));
}

function toGoogleMarkers(markers: MapMarker[]): GoogleMaps.Marker[] {
  return markers.map((marker) => ({
    id: marker.id,
    coordinates: {
      latitude: marker.latitude,
      longitude: marker.longitude,
    },
    title: marker.title,
  }));
}

/** Carte interactive affichant les événements proches sous forme de markers. */
export default function MapScreen({ onSelectionChange }: Props) {
  const { cameraPosition, isLoading, markers, selectedMarkerId, setSelectedMarkerId } = useMap();

  useEffect(() => {
    onSelectionChange?.(selectedMarkerId !== null);
  }, [selectedMarkerId, onSelectionChange]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          markers={toAppleMarkers(markers)}
          onMarkerClick={(marker) => {
            if (marker.id) setSelectedMarkerId(marker.id);
          }}
        />
      ) : (
        <GoogleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          markers={toGoogleMarkers(markers)}
          onMarkerClick={(marker) => {
            if (marker.id) setSelectedMarkerId(marker.id);
          }}
        />
      )}
      {selectedMarkerId !== null && (
        <TouchableWithoutFeedback onPress={() => setSelectedMarkerId(null)}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}
      <MapBottomSheet
        markers={markers}
        selectedMarkerId={selectedMarkerId}
        onClose={() => setSelectedMarkerId(null)}
      />
    </View>
  );
}
