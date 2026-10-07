import { useEffect, useState } from 'react';
import { getAllEvents } from '@/services/api/eventService';
import type { Event } from '@/types/event.types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const data = await getAllEvents();
      setEvents(data);
      setIsLoading(false);
    }
    fetchEvents();
  }, []);

  return { events, isLoading };
}
