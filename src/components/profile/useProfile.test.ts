/// <reference types="jest" />
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { FeedPost } from '@/types/post.types';
import { useProfile } from './useProfile';

jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: async () => 'tok' }),
}));

const mockGetUserPosts = jest.fn();
const mockGetLikedPosts = jest.fn();
jest.mock('@/services/api/postService', () => ({
  getCurrentUser: async () => ({ id: 7, username: 'me', profilePicture: null }),
  getUserPosts: (...args: unknown[]) => mockGetUserPosts(...args),
  getLikedPosts: (...args: unknown[]) => mockGetLikedPosts(...args),
}));

const mockGetUserProfile = jest.fn();
jest.mock('@/services/api/userService', () => ({
  getUserProfile: (...args: unknown[]) => mockGetUserProfile(...args),
}));

function post(id: number): FeedPost {
  return {
    id,
    body: '',
    createdAt: '',
    media: [],
    author: { id: 7, username: 'me' },
    likeCount: 0,
    commentCount: 0,
    likedByMe: false,
  };
}

beforeEach(() => {
  mockGetUserPosts.mockReset();
  mockGetLikedPosts.mockReset();
  mockGetUserProfile.mockReset().mockResolvedValue({
    id: 7,
    username: 'me',
    name: 'Me',
    description: 'bio',
    profilePicture: null,
    isVerify: false,
  });
});

test('charge le profil et la première page de publications au montage', async () => {
  mockGetUserPosts.mockResolvedValue({ posts: [post(1), post(2)], nextPage: 2 });

  const { result } = await renderHook(() => useProfile());

  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.posts).toHaveLength(2));
  expect(result.current.profile?.username).toBe('me');
  expect(mockGetUserProfile).toHaveBeenCalledWith(7, 'tok');
  expect(mockGetUserPosts).toHaveBeenCalledWith(7, 7, 1, 'tok');
});

test('selectTab(liked) charge les posts likés une seule fois', async () => {
  mockGetUserPosts.mockResolvedValue({ posts: [post(1)], nextPage: null });
  mockGetLikedPosts.mockResolvedValue({ posts: [post(5)], nextPage: null });

  const { result } = await renderHook(() => useProfile());
  await waitFor(() => expect(result.current.posts).toHaveLength(1));

  await act(async () => {
    result.current.selectTab('liked');
  });
  await waitFor(() => expect(result.current.posts).toEqual([expect.objectContaining({ id: 5 })]));
  expect(result.current.tab).toBe('liked');
  expect(mockGetLikedPosts).toHaveBeenCalledTimes(1);

  // Revenir sur "liked" après "posts" ne déclenche pas un second appel (déjà chargé).
  await act(async () => {
    result.current.selectTab('posts');
  });
  await act(async () => {
    result.current.selectTab('liked');
  });
  expect(mockGetLikedPosts).toHaveBeenCalledTimes(1);
});

test('loadMore ajoute la page suivante en dédupliquant par id', async () => {
  mockGetUserPosts
    .mockResolvedValueOnce({ posts: [post(1), post(2)], nextPage: 2 })
    .mockResolvedValueOnce({ posts: [post(2), post(3)], nextPage: null });

  const { result } = await renderHook(() => useProfile());
  await waitFor(() => expect(result.current.posts).toHaveLength(2));

  await act(async () => {
    result.current.loadMore();
  });

  await waitFor(() => expect(result.current.posts).toHaveLength(3));
  expect(result.current.posts.map((p) => p.id)).toEqual([1, 2, 3]);
});
