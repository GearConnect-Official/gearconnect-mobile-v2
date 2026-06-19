import { useState } from 'react';
import * as Location from 'expo-location';
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { createEvent } from '@/services/api/eventService';
import { getCurrentUser } from '@/services/api/postService';

export function useCreateEvent() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function geocodeAddress() {
    if (!address.trim()) return;
    setIsGeocoding(true);
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length === 0) {
        setError('Adresse introuvable. Essaie une adresse plus précise.');
        return;
      }
      setLatitude(results[0].latitude);
      setLongitude(results[0].longitude);
      setError(undefined);
    } catch {
      setError("Impossible de géocoder l'adresse. Essaie une adresse plus précise.");
    } finally {
      setIsGeocoding(false);
    }
  }

  async function submit() {
    if (!name.trim() || !date.trim() || !address.trim()) {
      setError('Nom, date et adresse sont requis.');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        setError('Session expirée. Reconnecte-toi.');
        return;
      }
      const me = await getCurrentUser(token);
      await createEvent(
        { name, date, location: address, latitude, longitude, creatorId: me.id },
        token,
      );
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    name, setName,
    date, setDate,
    address, setAddress,
    latitude, longitude,
    isGeocoding, isSubmitting, error,
    geocodeAddress, submit,
  };
}
