import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useCreateEvent } from './useCreateEvent';
import { styles } from '@/styles/createEventForm.styles';


/** Formulaire de création d'un événement avec géocodage d'adresse. */
export default function CreateEventForm() {
  const {
    name, setName,
    date, setDate,
    address, setAddress,
    latitude, longitude,
    isGeocoding, isSubmitting, error,
    geocodeAddress, submit,
  } = useCreateEvent();

  return (
    <ScrollView style={styles.container}>
      <TextInput placeholder="Nom de l'événement" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Date (ex: 2026-08-15)" value={date} onChangeText={setDate} style={styles.input} />

      <TextInput
        placeholder="Adresse (ex: Circuit Paul Ricard, Le Castellet)"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TouchableOpacity onPress={geocodeAddress} style={styles.button} disabled={isGeocoding}>
        {isGeocoding
          ? <ActivityIndicator />
          : <Text style={styles.buttonText}>Valider l'adresse</Text>}
      </TouchableOpacity>

      {latitude !== null && longitude !== null && (
        Platform.OS === 'ios'
          ? <AppleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude, longitude }, zoom: 14 }} markers={[{ id: '1', coordinates: { latitude, longitude }, title: address }]} />
          : <GoogleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude, longitude }, zoom: 14 }} markers={[{ id: '1', coordinates: { latitude, longitude }, title: address }]} />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity onPress={submit} style={styles.buttonSubmit} disabled={isSubmitting}>
        {isSubmitting
          ? <ActivityIndicator />
          : <Text style={styles.buttonText}>Créer l'événement</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
