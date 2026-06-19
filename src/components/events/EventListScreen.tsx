import { ActivityIndicator, FlatList, View } from 'react-native';
import { useEvents } from './useEvents';
import EventItem from './EventItem';
import { styles } from '@/styles/eventList.styles';

/** Liste de tous les événements de l'application. */
export default function EventListScreen() {
  const { events, isLoading } = useEvents();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <EventItem event={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
