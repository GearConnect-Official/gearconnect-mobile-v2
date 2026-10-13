import { ENV } from '@/config/env';
import type {
  ApiComment,
  ApiCommentsPagination,
  ApiCommentsResponse,
  CommentsPage,
  FeedComment,
} from '@/types/comment.types';

const BASE = ENV.apiUrl;
const PAGE_SIZE = 10;

/** Transforme un commentaire brut de l'API en FeedComment : compteurs agrégés + état du like + réponses imbriquées. */
function toFeedComment(apiComment: ApiComment, currentUserId: number): FeedComment {
  return {
    id: apiComment.id,
    content: apiComment.content,
    createdAt: apiComment.createdAt,
    author: {
      id: apiComment.user.id,
      username: apiComment.user.username,
      avatarUrl: apiComment.user.profilePicture,
      isVerify: apiComment.user.isVerify,
    },
    likeCount: apiComment._count.likes,
    likedByMe: apiComment.likes.some((l) => l.userId === currentUserId),
    replyCount: apiComment._count.replies,
    replies: apiComment.replies?.map((r) => toFeedComment(r, currentUserId)),
  };
}

/** Récupère une page de commentaires racines d'un post (GET /comments/post/:postId). */
export async function getComments(
  postId: number,
  page: number,
  currentUserId: number,
  token: string,
): Promise<CommentsPage> {
  const res = await fetch(`${BASE}/comments/post/${postId}?page=${page}&limit=${PAGE_SIZE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de charger les commentaires.');
  }
  const data: ApiCommentsResponse = await res.json();
  return {
    comments: data.comments.map((c) => toFeedComment(c, currentUserId)),
    nextPage: data.pagination.currentPage < data.pagination.totalPages ? page + 1 : null,
  };
}

/** Crée un commentaire (parentId absent) ou une réponse (parentId fourni) — POST /comments. */
export async function createComment(
  postId: number,
  userId: number,
  content: string,
  token: string,
  parentId?: number,
): Promise<FeedComment> {
  const res = await fetch(`${BASE}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ postId, userId, content, parentId }),
  });
  if (!res.ok) {
    throw new Error('Impossible de publier le commentaire.');
  }
  const data: ApiComment = await res.json();
  return toFeedComment(data, userId);
}

/** Récupère une page de réponses d'un commentaire (GET /comments/:commentId/replies). */
export async function getCommentReplies(
  commentId: number,
  page: number,
  currentUserId: number,
  token: string,
): Promise<CommentsPage> {
  const res = await fetch(`${BASE}/comments/${commentId}/replies?page=${page}&limit=${PAGE_SIZE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Impossible de charger les réponses.');
  }
  const data: { replies: ApiComment[]; pagination: ApiCommentsPagination } = await res.json();
  return {
    comments: data.replies.map((c) => toFeedComment(c, currentUserId)),
    nextPage: data.pagination.currentPage < data.pagination.totalPages ? page + 1 : null,
  };
}

/** Modifie le contenu d'un commentaire (PATCH /comments/:commentId). */
export async function updateComment(
  commentId: number,
  content: string,
  userId: number,
  token: string,
): Promise<FeedComment> {
  const res = await fetch(`${BASE}/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content, userId }),
  });
  if (!res.ok) {
    throw new Error('Impossible de modifier le commentaire.');
  }
  const data: ApiComment = await res.json();
  return toFeedComment(data, userId);
}

/** Supprime un commentaire et ses réponses en cascade (DELETE /comments/:commentId). */
export async function deleteComment(
  commentId: number,
  userId: number,
  token: string,
): Promise<void> {
  const res = await fetch(`${BASE}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    throw new Error('Impossible de supprimer le commentaire.');
  }
}

/** Like / unlike un commentaire (POST /comments/:commentId/like). */
export async function toggleCommentLike(
  commentId: number,
  userId: number,
  token: string,
): Promise<{ liked: boolean }> {
  const res = await fetch(`${BASE}/comments/${commentId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    throw new Error('Impossible de mettre à jour le like du commentaire.');
  }
  return res.json();
}
