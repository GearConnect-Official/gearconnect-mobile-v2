import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Platform, View } from 'react-native';
import { styles } from '@/styles/map.styles';
import { type MapMarker, useMap } from './useMap';

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
export default function MapScreen() {
  const { cameraPosition, isLoading, markers } = useMap();
  const router = useRouter();

  function handleMarkerClick(marker: { id?: string }) {
    if (marker.id) {
      router.push(`/eventDetail?id=${marker.id}`);
    }
  }
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
          onMarkerClick={handleMarkerClick}
        />
      ) : (
        <GoogleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          markers={toGoogleMarkers(markers)}
          onMarkerClick={handleMarkerClick}
        />
      )}
    </View>
  );
}
