import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@/styles/eventDetail.styles';
import { useEventDetail } from './useEventDetail';

/** Détail d'un événement de course avec bouton pour rejoindre. */
export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { event, isLoading, join, isJoining, isAlreadyJoined } = useEventDetail(id);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!event) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.circuit}>{event.location}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.participants}>{(event.participantIds ?? []).length} participant(s)</Text>
      <TouchableOpacity
        style={[styles.joinBtn, (isJoining || isAlreadyJoined) && styles.joinBtnDisabled]}
        onPress={join}
        disabled={isJoining || isAlreadyJoined}
      >
        <Text style={styles.joinBtnText}>
          {isAlreadyJoined ? 'Déjà inscrit' : isJoining ? 'Inscription...' : 'Rejoindre'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
