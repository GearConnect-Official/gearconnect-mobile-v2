import { act, renderHook } from '@testing-library/react-native';
import { useEventDetail } from './useEventDetail';
import { getEventById, joinEvent } from '@/services/api/eventService';
import { getCurrentUser } from '@/services/api/postService';


jest.mock('@/services/api/eventService', () => ({
  getEventById: jest.fn(),
  joinEvent: jest.fn(),
}));

const mockGetToken = jest.fn();
jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: mockGetToken }),
}));

jest.mock('@/services/api/postService', () => ({
  getCurrentUser: jest.fn(),
}));

const mockEvent = {
  id: '1',
  title: 'Course Monaco',
  location: { name: 'Circuit de Monaco', latitude: 43.7, longitude: 7.4 },
  date: '2026-07-15T10:00:00Z',
  organizerId: 'user1',
  participantIds: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('fetch réussi', async () => {
  (getEventById as jest.Mock).mockResolvedValue(mockEvent);
  (getCurrentUser as jest.Mock).mockResolvedValue({ id: 42, username: 'pilote1', profilePicture: null });


  const { result } = await renderHook(() => useEventDetail('1'));
  await act(async () => {});

  expect(result.current.event).toEqual(mockEvent);
  expect(result.current.isLoading).toBe(false);
});

test('join appelle joinEvent et met à jour participantIds', async () => {
  (getEventById as jest.Mock).mockResolvedValue(mockEvent);
  (joinEvent as jest.Mock).mockResolvedValue(undefined);
  (getCurrentUser as jest.Mock).mockResolvedValue({ id: 42, username: 'pilote1', profilePicture: null });
  mockGetToken.mockResolvedValue('token-123');

  const { result } = await renderHook(() => useEventDetail('1'));
  await act(async () => {});

  await act(async () => {
    await result.current.join();
  });

  expect(joinEvent).toHaveBeenCalledWith('1', 'token-123');
  expect(result.current.isJoining).toBe(false);
  expect(result.current.event?.participantIds).toContain(42);
});

test('join sans token ne appelle pas joinEvent', async () => {
  (getEventById as jest.Mock).mockResolvedValue(mockEvent);
  (getCurrentUser as jest.Mock).mockResolvedValue({ id: 42, username: 'pilote1', profilePicture: null });
  mockGetToken.mockResolvedValue(null);

  const { result } = await renderHook(() => useEventDetail('1'));
  await act(async () => {});

  await act(async () => {
    await result.current.join();
  });

  expect(joinEvent).not.toHaveBeenCalled();
});

test('isAlreadyJoined est true si userId déjà dans participantIds', async () => {
  (getEventById as jest.Mock).mockResolvedValue({
    ...mockEvent,
    participantIds: [42],
  });
  (getCurrentUser as jest.Mock).mockResolvedValue({ id: 42, username: 'pilote1', profilePicture: null });
  mockGetToken.mockResolvedValue('token-123');

  const { result } = await renderHook(() => useEventDetail('1'));
  await act(async () => {});

  expect(result.current.isAlreadyJoined).toBe(true);
});
