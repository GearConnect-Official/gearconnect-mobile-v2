import { Platform, View } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { styles } from "@/styles/map.styles";



type MapMarker = {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
};

interface Props {
    markers: MapMarker[];
}


function toAppleMarkers(markers: MapMarker[]): AppleMaps.Marker[] {
    return markers.map((marker) => ({
        id: marker.id,
        coordinates: {
            latitude: marker.latitude,
            longitude: marker.longitude,
        },
        title: marker.title
    }));
}

function toGoogleMarkers(markers: MapMarker[]): GoogleMaps.Marker[] {
    return markers.map((marker) => ({
        id: marker.id,
        coordinates: {
            latitude: marker.latitude,
            longitude: marker.longitude,
        },
        title: marker.title
    }));
}

/** Carte interactive affichant des markers géocalisés */
export default function MapScreen({ markers }: Props) {

return (
    <View style={styles.container}>
  {Platform.OS === 'ios'
    ? <AppleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude: 48.8566, longitude: 2.3522 }, zoom: 10 }} markers={toAppleMarkers(markers)} />
    : <GoogleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude: 48.8566, longitude: 2.3522 }, zoom: 10 }} markers={toGoogleMarkers(markers)} />
  }
</View>
)
}