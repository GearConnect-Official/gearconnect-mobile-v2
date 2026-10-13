import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { getEventsNearby } from '@/services/api/eventService';
import type { Event } from '@/types/event.types';

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  distanceKm: number;
};

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toMapMarkers(events: Event[], userLat: number, userLng: number): MapMarker[] {
  return events
    .filter(
      (e): e is Event & { latitude: number; longitude: number } =>
        e.latitude !== null && e.longitude !== null,
    )
    .map((event) => ({
      id: String(event.id),
      latitude: event.latitude,
      longitude: event.longitude,
      title: event.name,
      distanceKm: getDistanceKm(userLat, userLng, event.latitude, event.longitude),
    }));
}

export function useMap() {
  const [cameraPosition, setCameraPosition] = useState({
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    zoom: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  useEffect(() => {
    async function locateUser() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCameraPosition({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 14,
      });
      const events = await getEventsNearby(
        location.coords.latitude,
        location.coords.longitude,
        1000,
      );
      setMarkers(toMapMarkers(events, location.coords.latitude, location.coords.longitude));
      setIsLoading(false);
    }
    locateUser();
  }, []);

  return { cameraPosition, isLoading, markers, selectedMarkerId, setSelectedMarkerId };
}
