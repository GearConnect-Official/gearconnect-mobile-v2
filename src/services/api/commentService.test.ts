import type { ApiComment } from '@/types/comment.types';
import {
  createComment,
  deleteComment,
  getCommentReplies,
  getComments,
  toggleCommentLike,
} from './commentService';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

function apiComment(overrides: Partial<ApiComment> = {}): ApiComment {
  return {
    id: 1,
    content: 'salut',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    parentId: null,
    user: { id: 9, username: 'auteur' },
    likes: [],
    _count: { replies: 0, likes: 0 },
    ...overrides,
  };
}

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

function resolveWith(
  comments: ApiComment[],
  pagination: Pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: comments.length,
    itemsPerPage: 10,
  },
) {
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ comments, pagination }) });
}

beforeEach(() => {
  mockFetch.mockReset();
});

test('dérive likeCount/replyCount depuis _count et likedByMe depuis likes', async () => {
  resolveWith([
    apiComment({
      likes: [
        { commentId: 1, userId: 1 },
        { commentId: 1, userId: 2 },
      ],
      _count: { replies: 3, likes: 2 },
    }),
  ]);

  const page = await getComments(7, 1, 1, 'tok');

  expect(page.comments[0].likeCount).toBe(2);
  expect(page.comments[0].replyCount).toBe(3);
  expect(page.comments[0].likedByMe).toBe(true);
});

test('likedByMe est false si l’utilisateur courant n’a pas liké', async () => {
  resolveWith([
    apiComment({ likes: [{ commentId: 1, userId: 2 }], _count: { replies: 0, likes: 1 } }),
  ]);

  const page = await getComments(7, 1, 1, 'tok');

  expect(page.comments[0].likedByMe).toBe(false);
});

test('mappe les réponses imbriquées récursivement', async () => {
  resolveWith([
    apiComment({
      _count: { replies: 1, likes: 0 },
      replies: [
        apiComment({ id: 2, content: 'réponse', parentId: 1, _count: { replies: 0, likes: 5 } }),
      ],
    }),
  ]);

  const page = await getComments(7, 1, 1, 'tok');

  expect(page.comments[0].replies?.[0].id).toBe(2);
  expect(page.comments[0].replies?.[0].likeCount).toBe(5);
});

test('nextPage vaut page+1 s’il reste des pages, null sinon', async () => {
  resolveWith([apiComment()], { currentPage: 1, totalPages: 3, totalItems: 25, itemsPerPage: 10 });
  expect((await getComments(7, 1, 1, 'tok')).nextPage).toBe(2);

  resolveWith([apiComment()], { currentPage: 3, totalPages: 3, totalItems: 25, itemsPerPage: 10 });
  expect((await getComments(7, 3, 1, 'tok')).nextPage).toBeNull();
});

test('lève une erreur si la réponse n’est pas ok', async () => {
  mockFetch.mockResolvedValue({ ok: false, json: async () => null });

  await expect(getComments(7, 1, 1, 'tok')).rejects.toThrow(
    'Impossible de charger les commentaires.',
  );
});

test('createComment poste le commentaire et le mappe en FeedComment', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => apiComment({ id: 42, content: 'hello', _count: { replies: 0, likes: 0 } }),
  });

  const created = await createComment(7, 1, 'hello', 'tok');

  expect(created.id).toBe(42);
  expect(created.content).toBe('hello');
  expect(created.likedByMe).toBe(false);
});

test('createComment lève une erreur si la réponse n’est pas ok', async () => {
  mockFetch.mockResolvedValue({ ok: false, json: async () => null });

  await expect(createComment(7, 1, 'hello', 'tok')).rejects.toThrow(
    'Impossible de publier le commentaire.',
  );
});

test('toggleCommentLike renvoie { liked } et lève si !ok', async () => {
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ liked: true }) });
  expect(await toggleCommentLike(1, 1, 'tok')).toEqual({ liked: true });

  mockFetch.mockResolvedValue({ ok: false, json: async () => null });
  await expect(toggleCommentLike(1, 1, 'tok')).rejects.toThrow();
});

test('deleteComment résout si ok, lève sinon', async () => {
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ message: 'ok' }) });
  await expect(deleteComment(1, 1, 'tok')).resolves.toBeUndefined();

  mockFetch.mockResolvedValue({ ok: false, json: async () => null });
  await expect(deleteComment(1, 1, 'tok')).rejects.toThrow();
});

test('getCommentReplies mappe les réponses', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      replies: [apiComment({ id: 2, parentId: 1, _count: { replies: 0, likes: 4 } })],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 1, itemsPerPage: 10 },
    }),
  });

  const page = await getCommentReplies(1, 1, 1, 'tok');

  expect(page.comments[0].id).toBe(2);
  expect(page.comments[0].likeCount).toBe(4);
});
