import { Text, View } from 'react-native';
import type { Event } from '@/types/event.types';
import { styles } from '@/styles/eventItem.styles';

interface Props{
    event: Event;
}

/** Card affichant le résumé d'un événement de course. */
export default function EventItem({ event }: Props) { 
    return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.circuit}>{event.location.name}</Text>
      <Text style={styles.date}>{event.date}</Text>
    </View>
  );
 }