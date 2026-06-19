import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { getEventsNearby } from "@/services/api/eventService";
import { Event } from "@/types/event.types";

export type MapMarker = {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
}

function toMapMarkers(events: Event[]): MapMarker[] {
    return events
    .filter(e => e.latitude !== null && e.longitude !== null)
    .map((event) =>({
        id: String(event.id),
        latitude: event.latitude!,
        longitude: event.longitude!,
        title: event.name,
    }))
}


export function useMap(){
    const [cameraPosition, setCameraPosition] = useState({
        coordinates: { latitude: 48.8566, longitude: 2.3522 },
        zoom: 10,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [markers, setMarkers] = useState<MapMarker[]>([]);

    useEffect(() => {
        async function locateUser(){
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted'){
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
            })
            const events = await getEventsNearby(
                  location.coords.latitude,
                  location.coords.longitude,
                  1000,
            );
            setMarkers(toMapMarkers(events));
            setIsLoading(false);
        }
        locateUser();
    }, []);

    return { cameraPosition, isLoading, markers };
}
