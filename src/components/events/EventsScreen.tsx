import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapScreen from '@/components/map/MapScreen';
import { styles } from '@/styles/eventsScreen.styles';
import EventListScreen from './EventListScreen';

type ActiveView = 'map' | 'list';

/** Écran principal des événements avec toggle carte / liste. */
export default function EventsScreen() {
  const [hasMapSelection, setHasMapSelection] = useState(false);
  const [view, setView] = useState<ActiveView>('map');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
          onPress={() => setView('map')}
        >
          <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>Carte</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
          onPress={() => setView('list')}
        >
          <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>
            Tous les événements
          </Text>
        </TouchableOpacity>
      </View>

      {view === 'map' ? <MapScreen onSelectionChange={setHasMapSelection} /> : <EventListScreen />}

      {!hasMapSelection && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/createEvent')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
