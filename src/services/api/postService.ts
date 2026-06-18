import { ENV } from '@/config/env';
import type { CreatePostInput, FeedPost, Post, PostsPage, SelectedMedia } from '@/types/post.types';
import type { CurrentUser } from '@/types/user.types';

const BASE = ENV.apiUrl;
const PAGE_SIZE = 10;

/** Transforme un post brut de l'API en FeedPost : compteurs dérivés des interactions. */
function toFeedPost(post: Post, currentUserId: number): FeedPost {
  const interactions = post.interactions ?? [];
  return {
    id: post.id,
    body: post.body,
    createdAt: post.createdAt,
    author: {
      id: post.user.id,
      username: post.user.username,
      avatarUrl: post.user.profilePicture,
      isVerify: post.user.isVerify,
    },
    media: post.media,
    likeCount: interactions.filter((i) => i.like).length,
    commentCount: post._count?.comments ?? 0,
    // Le partage est un événement append-only (modèle Share dédié) : compté via _count.
    shareCount: post._count?.shares ?? 0,
    likedByMe: interactions.some((i) => i.userId === currentUserId && i.like),
  };
}

/** Récupère une page du feed (GET /posts) et la normalise en PostsPage. */
export async function getPosts(
  page: number,
  currentUserId: number,
  token: string,
): Promise<PostsPage> {
  const res = await fetch(`${BASE}/posts?page=${page}&limit=${PAGE_SIZE}&userId=${currentUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de charger le feed.');
  }
  const data: Post[] = await res.json();
  return {
    posts: data.map((p) => toFeedPost(p, currentUserId)),
    nextPage: data.length === PAGE_SIZE ? page + 1 : null,
  };
}

/** Récupère un post seul (GET /posts/:id) et le normalise en FeedPost. */
export async function getPostById(
  id: number,
  currentUserId: number,
  token: string,
): Promise<FeedPost> {
  const res = await fetch(`${BASE}/posts/${id}?userId=${currentUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de charger le post partagé.');
  }
  const data: Post = await res.json();
  return toFeedPost(data, currentUserId);
}

/** Récupère le profil de l'utilisateur connecté (id interne, pseudo, avatar DB) via GET /auth/me. */
export async function getCurrentUser(token: string): Promise<CurrentUser> {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de récupérer le profil utilisateur.');
  }
  const data = await res.json();
  return {
    id: data.user.id,
    username: data.user.username,
    profilePicture: data.user.profilePicture ?? null,
  };
}

/** Construit l'objet fichier RN ({ uri, name, type }) attendu par FormData. */
function toFormFile(media: SelectedMedia) {
  const ext =
    media.uri.split('.').pop()?.split('?')[0]?.toLowerCase() ??
    (media.type === 'VIDEO' ? 'mp4' : 'jpg');
  const name = `upload.${ext}`;
  const type = media.type === 'VIDEO' ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  return { uri: media.uri, name, type };
}

/**
 * Crée un post. Les fichiers sont envoyés en multipart au backend, qui les
 * uploade lui-même vers Cloudinary (le front ne parle qu'à l'API).
 */
export async function createPost(input: CreatePostInput, token: string): Promise<Post> {
  const form = new FormData();
  form.append('body', input.body);
  form.append('userId', String(input.userId));
  for (const m of input.media) {
    // RN's FormData accepts { uri, name, type } objects, not actual Blobs.
    form.append('media', toFormFile(m) as unknown as Blob);
  }

  const res = await fetch(`${BASE}/posts`, {
    method: 'POST',
    // Pas de Content-Type manuel : fetch ajoute le boundary multipart lui-même.
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Création du post échouée (${res.status}) : ${detail}`);
  }
  return res.json();
}
