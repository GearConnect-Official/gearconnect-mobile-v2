import type { Post } from '@/types/post.types';
import { getPosts } from './postService';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

function apiPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    body: 'hello',
    createdAt: '2024-01-01',
    media: [],
    user: { id: 9, username: 'auteur', profilePicture: null },
    interactions: [],
    _count: { comments: 0 },
    ...overrides,
  };
}

function resolveWith(data: unknown, ok = true) {
  mockFetch.mockResolvedValue({ ok, json: async () => data, text: async () => '' });
}

beforeEach(() => {
  mockFetch.mockReset();
});

test('dérive likeCount/shareCount des interactions et commentCount de _count', async () => {
  resolveWith([
    apiPost({
      // un seul commentaire legacy (Interaction.comment) — ne doit PAS être compté
      interactions: [
        { userId: 1, like: true, share: true, comment: 'legacy' },
        { userId: 2, like: true, share: false, comment: null },
        { userId: 3, like: false, share: true, comment: null },
      ],
      _count: { comments: 5 },
    }),
  ]);

  const page = await getPosts(1, 1, 'tok');

  expect(page.posts[0].likeCount).toBe(2);
  expect(page.posts[0].shareCount).toBe(2);
  expect(page.posts[0].commentCount).toBe(5); // depuis _count, pas le legacy (=1)
  expect(page.posts[0].likedByMe).toBe(true);
});

test('likedByMe est false si l’utilisateur courant n’a pas liké', async () => {
  resolveWith([
    apiPost({ interactions: [{ userId: 2, like: true, share: false, comment: null }] }),
  ]);

  const page = await getPosts(1, 1, 'tok');

  expect(page.posts[0].likedByMe).toBe(false);
});

test('nextPage vaut page+1 quand la page est pleine, null quand elle est incomplète', async () => {
  resolveWith(Array.from({ length: 10 }, (_, i) => apiPost({ id: i + 1 })));
  expect((await getPosts(1, 1, 'tok')).nextPage).toBe(2);

  resolveWith([apiPost({ id: 1 })]);
  expect((await getPosts(2, 1, 'tok')).nextPage).toBeNull();
});

test('lève une erreur si la réponse n’est pas ok', async () => {
  resolveWith(null, false);

  await expect(getPosts(1, 1, 'tok')).rejects.toThrow('Impossible de charger le feed.');
});
