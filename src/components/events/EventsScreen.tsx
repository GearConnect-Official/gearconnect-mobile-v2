import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import MapScreen from '@/components/map/MapScreen';
import EventListScreen from './EventListScreen';
import { styles } from '@/styles/eventsScreen.styles';

type ActiveView = 'map' | 'list';

/** Écran principal des événements avec toggle carte / liste. */
export default function EventsScreen(){
    const [view, setView] = useState<ActiveView>('map')
    const router = useRouter();

    return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
          onPress={() => setView('map')}
        >
          <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>
            Carte
          </Text>
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

      {view === 'map' ? <MapScreen /> : <EventListScreen />}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/createEvent')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}