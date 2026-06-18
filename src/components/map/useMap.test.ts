import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useMap } from "./useMap";
import { act, renderHook } from '@testing-library/react-native';
import { getEventsNearby } from '@/services/api/eventService';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('@/services/api/eventService', () => ({
  getEventsNearby: jest.fn(),
}));

test('permission accordée', async () => {
    (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (getCurrentPositionAsync as jest.Mock).mockResolvedValue({ coords: { latitude: 48.0, longitude: 2.0 } });
    (getEventsNearby as jest.Mock).mockResolvedValue([
  {
    id: '1',
    title: 'Course Monaco',
    location: { name: 'Circuit de Monaco', latitude: 43.7, longitude: 7.4 },
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
  { id: '1', latitude: 43.7, longitude: 7.4, title: 'Course Monaco' },
]);
});

test('permission refusé', async () => {
    (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const { result } = await renderHook(() => useMap());
    await act(async () => {});

    expect(result.current.cameraPosition.coordinates).toEqual({ latitude: 48.8566, longitude: 2.3522 });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.markers).toEqual([]);
});

test('permission accordée — aucun event nearby', async () => {
  (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  (getCurrentPositionAsync as jest.Mock).mockResolvedValue({ coords: { latitude: 48.0, longitude: 2.0 } });
  (getEventsNearby as jest.Mock).mockResolvedValue([]);

  const { result } = await renderHook(() => useMap());
  await act(async () => {});

  expect(result.current.markers).toEqual([]);
  expect(result.current.isLoading).toBe(false);
});