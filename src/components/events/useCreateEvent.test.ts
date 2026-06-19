import { act, renderHook } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { createEvent } from '@/services/api/eventService';
import { getCurrentUser } from '@/services/api/postService';
import { useCreateEvent } from './useCreateEvent';

jest.mock('@/services/api/eventService', () => ({
  createEvent: jest.fn(),
}));

jest.mock('@/services/api/postService', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('expo-location', () => ({
  geocodeAsync: jest.fn(),
}));

const mockGetToken = jest.fn();
jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: mockGetToken }),
}));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

// --- geocodeAddress ---

test('geocodeAddress met à jour latitude et longitude', async () => {
  (Location.geocodeAsync as jest.Mock).mockResolvedValue([{ latitude: 43.25, longitude: 5.36 }]);

  const { result } = await renderHook(() => useCreateEvent());

  await act(async () => {
    result.current.setAddress('Marseille');
  });
  await act(async () => {
    await result.current.geocodeAddress();
  });

  expect(result.current.latitude).toBe(43.25);
  expect(result.current.longitude).toBe(5.36);
  expect(result.current.error).toBeUndefined();
});

test('geocodeAddress — adresse introuvable affiche une erreur', async () => {
  (Location.geocodeAsync as jest.Mock).mockResolvedValue([]);

  const { result } = await renderHook(() => useCreateEvent());

  await act(async () => {
    result.current.setAddress('xyzabc123');
  });
  await act(async () => {
    await result.current.geocodeAddress();
  });

  expect(result.current.latitude).toBeNull();
  expect(result.current.error).toMatch(/introuvable/i);
});

test('geocodeAddress — erreur réseau affiche une erreur', async () => {
  (Location.geocodeAsync as jest.Mock).mockRejectedValue(new Error('network'));

  const { result } = await renderHook(() => useCreateEvent());

  await act(async () => {
    result.current.setAddress('Paris');
  });
  await act(async () => {
    await result.current.geocodeAddress();
  });

  expect(result.current.latitude).toBeNull();
  expect(result.current.error).toMatch(/géocoder/i);
});

// --- submit ---

test('submit — champs vides affiche une erreur de validation', async () => {
  const { result } = await renderHook(() => useCreateEvent());

  await act(async () => {
    await result.current.submit();
  });

  expect(result.current.error).toMatch(/requis/i);
  expect(createEvent).not.toHaveBeenCalled();
});

test('submit — token null affiche session expirée', async () => {
  mockGetToken.mockResolvedValue(null);

  const { result } = await renderHook(() => useCreateEvent());

  await act(async () => {
    result.current.setName('Rallye');
    result.current.setDate('2026-08-01');
    result.current.setAddress('Circuit Paul Ricard');
  });
  await act(async () => {
    await result.current.submit();
  });

  expect(result.current.error).toMatch(/session/i);
  expect(createEvent).not.toHaveBeenCalled();
});

test('submit — succès appelle createEvent et router.back()', async () => {
  mockGetToken.mockResolvedValue('token-abc');
  (getCurrentUser as jest.Mock).mockResolvedValue({
    id: 7,
    username: 'pilote',
    profilePicture: null,
  });
  (createEvent as jest.Mock).mockResolvedValue({ id: 99 });

  const { result } = await renderHook(() => useCreateEvent());

  await act(async () => {
    result.current.setName('Rallye');
    result.current.setDate('2026-08-01');
    result.current.setAddress('Circuit Paul Ricard');
  });
  await act(async () => {
    await result.current.submit();
  });

  expect(createEvent).toHaveBeenCalledWith(
    {
      name: 'Rallye',
      date: '2026-08-01',
      location: 'Circuit Paul Ricard',
      latitude: null,
      longitude: null,
      creatorId: 7,
    },
    'token-abc',
  );
  expect(mockBack).toHaveBeenCalled();
  expect(result.current.error).toBeUndefined();
});

test("submit — erreur API affiche le message d'erreur", async () => {
  mockGetToken.mockResolvedValue('token-abc');
  (getCurrentUser as jest.Mock).mockResolvedValue({
    id: 7,
    username: 'pilote',
    profilePicture: null,
  });
  (createEvent as jest.Mock).mockRejectedValue(new Error("Impossible de créer l'événement."));

  const { result } = await renderHook(() => useCreateEvent());

  await act(async () => {
    result.current.setName('Rallye');
    result.current.setDate('2026-08-01');
    result.current.setAddress('Circuit Paul Ricard');
  });
  await act(async () => {
    await result.current.submit();
  });

  expect(result.current.error).toBe("Impossible de créer l'événement.");
  expect(mockBack).not.toHaveBeenCalled();
});
