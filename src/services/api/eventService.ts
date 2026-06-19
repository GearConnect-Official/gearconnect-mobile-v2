import { ENV } from '@/config/env';
import type { Event } from '@/types/event.types';

const BASE = ENV.apiUrl;

export async function getEventsNearby(
  latitude: number,
  longitude: number,
  radiusKm: number,
): Promise<Event[]> {
  const res = await fetch(
    `${BASE}/events/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`,
  );
  if (!res.ok) {
    throw new Error('Impossible de récupérer les événements.');
  }
  return res.json();
}

export async function getAllEvents(): Promise<Event[]> {
  const res = await fetch(`${BASE}/events`);
  if (!res.ok) {
    throw new Error('Impossible de récupérer les événements.');
  }
  return res.json();
}

export async function getEventById(id: string): Promise<Event> {
  const res = await fetch(`${BASE}/events/${id}`);
  if (!res.ok) {
    throw new Error("Impossible de récupérer l'événement.");
  }
  return res.json();
}

export async function joinEvent(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/events/${id}/join`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Impossible de rejoindre l'événement.");
  }
}

export async function createEvent(
  data: {
    name: string;
    date: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    creatorId: number;
  },
  token: string,
): Promise<Event> {
  const res = await fetch(`${BASE}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Impossible de créer l'événement.");
  }
  return res.json();
}
