import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { FeedPost } from '@/types/post.types';
import { usePosts } from './usePosts';

jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: async () => 'tok' }),
}));

const mockGetPosts = jest.fn();
const mockToggleLike = jest.fn();
jest.mock('@/services/api/postService', () => ({
  getCurrentUser: async () => ({ id: 1, username: 'me', profilePicture: null }),
  getPosts: (...args: unknown[]) => mockGetPosts(...args),
}));
jest.mock('@/services/api/interactionService', () => ({
  toggleLike: (...args: unknown[]) => mockToggleLike(...args),
}));

function post(id: number, likedByMe = false, likeCount = 0): FeedPost {
  return {
    id,
    body: '',
    createdAt: '',
    media: [],
    author: { id: 9, username: 'auteur' },
    likeCount,
    commentCount: 0,
    shareCount: 0,
    likedByMe,
  };
}

beforeEach(() => {
  mockGetPosts.mockReset();
  mockToggleLike.mockReset();
});

test('charge la première page au montage', async () => {
  mockGetPosts.mockResolvedValue({ posts: [post(1), post(2)], nextPage: 2 });

  const { result } = await renderHook(() => usePosts());

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.posts).toHaveLength(2);
  expect(mockGetPosts).toHaveBeenCalledWith(1, 1, 'tok');
});

test('loadMore ajoute la page suivante en dédupliquant par id', async () => {
  mockGetPosts
    .mockResolvedValueOnce({ posts: [post(1), post(2)], nextPage: 2 })
    .mockResolvedValueOnce({ posts: [post(2), post(3)], nextPage: null });

  const { result } = await renderHook(() => usePosts());
  await waitFor(() => expect(result.current.posts).toHaveLength(2));

  await act(async () => {
    result.current.loadMore();
  });

  await waitFor(() => expect(result.current.posts).toHaveLength(3));
  expect(result.current.posts.map((p) => p.id)).toEqual([1, 2, 3]);
});

test('like optimiste puis rollback si l’API échoue', async () => {
  mockGetPosts.mockResolvedValue({ posts: [post(1, false, 3)], nextPage: null });
  mockToggleLike.mockRejectedValue(new Error('boom'));

  const { result } = await renderHook(() => usePosts());
  await waitFor(() => expect(result.current.posts).toHaveLength(1));

  await act(async () => {
    await result.current.toggleLike(1);
  });

  expect(result.current.posts[0].likeCount).toBe(3);
  expect(result.current.posts[0].likedByMe).toBe(false);
});
