import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { usePublicationForm } from './usePublicationForm';

const mockGetToken = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockCreatePost = jest.fn();

jest.mock('@clerk/expo', () => ({ useAuth: () => ({ getToken: mockGetToken }) }));
jest.mock('expo-router', () => ({ useRouter: () => ({ back: mockBack, replace: mockReplace }) }));
jest.mock('@/services/api/postService', () => ({
  getCurrentUser: (...args) => mockGetCurrentUser(...args),
  createPost: (...args) => mockCreatePost(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  mockGetToken.mockResolvedValue('token123');
  mockGetCurrentUser.mockResolvedValue({ id: 1, username: 'nabou', profilePicture: null });
});

test('charge le profil courant au montage', async () => {
  const { result } = await renderHook(() => usePublicationForm());

  await waitFor(() => {
    expect(result.current.author.username).toBe('nabou');
  });
});

test('cancel() revient en arrière', async () => {
  const { result } = await renderHook(() => usePublicationForm());

  await act(async () => {
    result.current.cancel();
  });

  expect(mockBack).toHaveBeenCalled();
});

test('publish() crée le post puis redirige vers le feed', async () => {
  mockCreatePost.mockResolvedValue({});
  const { result } = await renderHook(() => usePublicationForm());

  await waitFor(async () => {
    expect(result.current.author.username).toBe('nabou');
  });

  await act(async () => {
    result.current.setDescription('Mon premier post');
  });

  await act(async () => {
    await result.current.publish();
  });

  expect(mockCreatePost).toHaveBeenCalledWith(
    expect.objectContaining({ body: 'Mon premier post', userId: 1 }),
    'token123',
  );
  expect(mockReplace).toHaveBeenCalledWith('/(app)/(tabs)/home');
});

test("publish() affiche une alerte en cas d'échec et arrête le loader", async () => {
  mockCreatePost.mockRejectedValue(new Error('Création du post échouée (500) : oops'));
  const { result } = await renderHook(() => usePublicationForm());

  await waitFor(async () => {
    expect(result.current.author.username).toBe('nabou');
  });
  await act(async () => {
    await result.current.publish();
  });

  expect(Alert.alert).toHaveBeenCalledWith('Échec', 'Création du post échouée (500) : oops');
  expect(result.current.publishing).toBe(false);
});
