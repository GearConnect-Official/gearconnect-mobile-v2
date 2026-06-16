import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { FeedComment } from '@/types/comment.types';
import { useComments } from './useComments';

jest.mock('@clerk/expo', () => ({
  useAuth: () => ({ getToken: async () => 'tok' }),
}));

const mockGetComments = jest.fn();
const mockCreateComment = jest.fn();
const mockToggleCommentLike = jest.fn();
const mockDeleteComment = jest.fn();
jest.mock('@/services/api/commentService', () => ({
  getComments: (...args: unknown[]) => mockGetComments(...args),
  createComment: (...args: unknown[]) => mockCreateComment(...args),
  toggleCommentLike: (...args: unknown[]) => mockToggleCommentLike(...args),
  deleteComment: (...args: unknown[]) => mockDeleteComment(...args),
  updateComment: jest.fn(),
}));
jest.mock('@/services/api/postService', () => ({
  getCurrentUser: async () => ({ id: 1, username: 'me', profilePicture: null }),
}));

function comment(id: number): FeedComment {
  return {
    id,
    content: '',
    createdAt: '',
    author: { id: 9, username: 'auteur' },
    likeCount: 0,
    likedByMe: false,
    replyCount: 0,
  };
}

beforeEach(() => {
  mockGetComments.mockReset();
  mockCreateComment.mockReset();
  mockToggleCommentLike.mockReset();
  mockDeleteComment.mockReset();
});

test('charge la première page au montage', async () => {
  mockGetComments.mockResolvedValue({ comments: [comment(1), comment(2)], nextPage: 2 });

  const { result } = await renderHook(() => useComments(7));

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.comments).toHaveLength(2);
  expect(mockGetComments).toHaveBeenCalledWith(7, 1, 1, 'tok');
});

test('loadMore ajoute la page suivante en dédupliquant par id', async () => {
  mockGetComments
    .mockResolvedValueOnce({ comments: [comment(1), comment(2)], nextPage: 2 })
    .mockResolvedValueOnce({ comments: [comment(2), comment(3)], nextPage: null });

  const { result } = await renderHook(() => useComments(7));
  await waitFor(() => expect(result.current.comments).toHaveLength(2));

  await act(async () => {
    result.current.loadMore();
  });

  await waitFor(() => expect(result.current.comments).toHaveLength(3));
  expect(result.current.comments.map((c) => c.id)).toEqual([1, 2, 3]);
});

test('addComment crée le commentaire et l’ajoute en tête de liste', async () => {
  mockGetComments.mockResolvedValue({ comments: [comment(1)], nextPage: null });
  mockCreateComment.mockResolvedValue(comment(99));

  const { result } = await renderHook(() => useComments(7));
  await waitFor(() => expect(result.current.comments).toHaveLength(1));

  await act(async () => {
    await result.current.addComment('coucou');
  });

  expect(result.current.comments.map((c) => c.id)).toEqual([99, 1]);
  expect(mockCreateComment).toHaveBeenCalledWith(7, 1, 'coucou', 'tok');
});

test('toggleCommentLike: optimiste puis rollback si l’API échoue', async () => {
  mockGetComments.mockResolvedValue({
    comments: [{ ...comment(1), likeCount: 3, likedByMe: false }],
    nextPage: null,
  });
  mockToggleCommentLike.mockRejectedValue(new Error('boom'));

  const { result } = await renderHook(() => useComments(7));
  await waitFor(() => expect(result.current.comments).toHaveLength(1));

  await act(async () => {
    await result.current.toggleCommentLike(1);
  });

  expect(result.current.comments[0].likeCount).toBe(3);
  expect(result.current.comments[0].likedByMe).toBe(false);
});

test('addReply ajoute la réponse au parent et incrémente replyCount', async () => {
  mockGetComments.mockResolvedValue({ comments: [comment(1)], nextPage: null });
  mockCreateComment.mockResolvedValue(comment(50));

  const { result } = await renderHook(() => useComments(7));
  await waitFor(() => expect(result.current.comments).toHaveLength(1));

  await act(async () => {
    await result.current.addReply(1, 'ma réponse');
  });

  expect(result.current.comments[0].replies?.map((r) => r.id)).toEqual([50]);
  expect(result.current.comments[0].replyCount).toBe(1);
  expect(mockCreateComment).toHaveBeenCalledWith(7, 1, 'ma réponse', 'tok', 1);
});

test('removeComment retire le commentaire de la liste', async () => {
  mockGetComments.mockResolvedValue({ comments: [comment(1), comment(2)], nextPage: null });
  mockDeleteComment.mockResolvedValue(undefined);

  const { result } = await renderHook(() => useComments(7));
  await waitFor(() => expect(result.current.comments).toHaveLength(2));

  await act(async () => {
    await result.current.removeComment(1);
  });

  expect(result.current.comments.map((c) => c.id)).toEqual([2]);
});
