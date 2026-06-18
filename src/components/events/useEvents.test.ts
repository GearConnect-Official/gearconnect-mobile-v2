import { getAllEvents } from "@/services/api/eventService";
import { act, renderHook } from '@testing-library/react-native';
import { useEvents } from './useEvents';

jest.mock('@/services/api/eventService', () => ({
  getAllEvents: jest.fn(),
}));

test('Events retournés', async () => {
    (getAllEvents as jest.Mock).mockResolvedValue([
    {
      id: '1',
      title: 'Course Monaco',
      location: { name: 'Circuit de Monaco', latitude: 43.7, longitude: 7.4 },
      date: '2026-07-15T10:00:00Z',
      organizerId: 'user1',
      participantIds: [],
    },
    ]);

    const { result } = await renderHook(() => useEvents());
    await act(async () => {});
        
    expect(result.current.events).toEqual([
    {
      id: '1',
      title: 'Course Monaco',
      location: { name: 'Circuit de Monaco', latitude: 43.7, longitude: 7.4 },
      date: '2026-07-15T10:00:00Z',
      organizerId: 'user1',
      participantIds: [],
    },
    ]);     
    expect(result.current.isLoading).toBe(false);
});

test('List vide', async () => {
    (getAllEvents as jest.Mock).mockResolvedValue([]);

    const { result } = await renderHook(() => useEvents());
    await act(async () => {});
    
    
   expect(result.current.events).toEqual([]);
   expect(result.current.isLoading).toBe(false);
});