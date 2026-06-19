import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { Event } from '@/types/event.types';
import { styles } from '@/styles/eventItem.styles';

interface Props{
    event: Event;
}

/** Card affichant le résumé d'un événement de course. */
export default function EventItem({ event }: Props) {
    const router = useRouter();

    return (
    <TouchableOpacity style={styles.container} onPress={() => router.push(`/eventDetail?id=${event.id}`)}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.circuit}>{event.location}</Text>
      <Text style={styles.date}>{event.date}</Text>
    </TouchableOpacity>
  );
}