import { MapScreen } from "@/components/map";

export default function Map() {
    const markers = [
        { id: '1', latitude: 48.8566, longitude: 2.3522, title: 'Marker 1' },
        { id: '2', latitude: 48.8584, longitude: 2.2945, title: 'Marker 2' },
        { id: '3', latitude: 48.8606, longitude: 2.3376, title: 'Marker 3' },
    ];
    
    return <MapScreen markers={markers} />
}