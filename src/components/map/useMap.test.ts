import { act, renderHook } from '@testing-library/react-native';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { getEventsNearby } from '@/services/api/eventService';
import { useMap } from './useMap';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('@/services/api/eventService', () => ({
  getEventsNearby: jest.fn(),
}));

test('permission accordée', async () => {
  (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  (getCurrentPositionAsync as jest.Mock).mockResolvedValue({
    coords: { latitude: 48.0, longitude: 2.0 },
  });
  (getEventsNearby as jest.Mock).mockResolvedValue([
    {
      id: 1,
      name: 'Course Monaco',
      description: '',
      location: { name: 'Circuit de Monaco', latitude: 43.7, longitude: 7.4 },
      latitude: 43.7,
      longitude: 7.4,
      date: '2026-07-15T10:00:00Z',
      organizerId: 'user1',
      participantIds: [],
    },
  ]);

  const { result } = await renderHook(() => useMap());
  await act(async () => {});

  expect(result.current.cameraPosition.coordinates).toEqual({ latitude: 48.0, longitude: 2.0 });
  expect(result.current.isLoading).toBe(false);
  expect(result.current.markers).toEqual([
    {
      id: '1',
      latitude: 43.7,
      longitude: 7.4,
      title: 'Course Monaco',
      distanceKm: expect.any(Number),
    },
  ]);
});

test('permission refusé', async () => {
  (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

  const { result } = await renderHook(() => useMap());
  await act(async () => {});

  expect(result.current.cameraPosition.coordinates).toEqual({
    latitude: 48.8566,
    longitude: 2.3522,
  });
  expect(result.current.isLoading).toBe(false);
  expect(result.current.markers).toEqual([]);
});

test('permission accordée — aucun event nearby', async () => {
  (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  (getCurrentPositionAsync as jest.Mock).mockResolvedValue({
    coords: { latitude: 48.0, longitude: 2.0 },
  });
  (getEventsNearby as jest.Mock).mockResolvedValue([]);

  const { result } = await renderHook(() => useMap());
  await act(async () => {});

  expect(result.current.markers).toEqual([]);
  expect(result.current.isLoading).toBe(false);
});

test('selectedmarkerId est null patdéfaut', async () => {
  (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

  const { result } = await renderHook(() => useMap());
  await act(async () => {});

  expect(result.current.selectedMarkerId).toBe(null);
});

test('setSlectedMarkerId met à jour selectedMarkerId', async () => {
  (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

  const { result } = await renderHook(() => useMap());
  await act(async () => {});

  await act(() => {
    result.current.setSelectedMarkerId('42');
  });
  expect(result.current.selectedMarkerId).toBe('42');

  await act(() => {
    result.current.setSelectedMarkerId(null);
  });
  expect(result.current.selectedMarkerId).toBe(null);
});
