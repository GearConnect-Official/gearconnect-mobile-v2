import { useAuth } from '@clerk/expo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  createComment,
  deleteComment as deleteCommentApi,
  getComments,
  toggleCommentLike as toggleCommentLikeApi,
  updateComment as updateCommentApi,
} from '@/services/api/commentService';
import { getCurrentUser } from '@/services/api/postService';
import type { FeedComment } from '@/types/comment.types';
import { nextLikeState } from '../likes';

type LoadMode = 'initial' | 'refresh' | 'more';

/** Applique `update` au commentaire `id`, en cherchant aussi dans les réponses (récursif). */
function patchComment(
  comments: FeedComment[],
  id: number,
  update: (c: FeedComment) => FeedComment,
): FeedComment[] {
  return comments.map((c) => {
    if (c.id === id) return update(c);
    if (c.replies?.length) return { ...c, replies: patchComment(c.replies, id, update) };
    return c;
  });
}

/** Retire le commentaire `id` de l'arbre (racine ou réponse). */
function removeCommentFrom(comments: FeedComment[], id: number): FeedComment[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) => (c.replies?.length ? { ...c, replies: removeCommentFrom(c.replies, id) } : c));
}

/** Trouve un commentaire par id dans l'arbre (racine ou réponse). */
function findComment(comments: FeedComment[], id: number): FeedComment | undefined {
  for (const c of comments) {
    if (c.id === id) return c;
    const found = c.replies ? findComment(c.replies, id) : undefined;
    if (found) return found;
  }
  return undefined;
}

/** Charge et gère les commentaires d'un post : pagination, ajout, réponses, like et suppression. */
export function useComments(postId: number) {
  const { getToken } = useAuth();
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const nextPageRef = useRef<number | null>(1);
  const userIdRef = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const commentsRef = useRef<FeedComment[]>([]);
  commentsRef.current = comments;

  const ensureUserId = useCallback(async (token: string) => {
    if (userIdRef.current == null) {
      const id = (await getCurrentUser(token)).id;
      userIdRef.current = id;
      setCurrentUserId(id);
    }
    return userIdRef.current;
  }, []);

  const load = useCallback(
    async (mode: LoadMode) => {
      if (loadingRef.current) return;
      const page = mode === 'more' ? nextPageRef.current : 1;
      if (page == null) return;

      loadingRef.current = true;
      if (mode === 'refresh') setRefreshing(true);
      else if (mode === 'more') setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token) throw new Error('Session expirée, reconnecte-toi.');
        const userId = await ensureUserId(token);
        const result = await getComments(postId, page, userId, token);
        nextPageRef.current = result.nextPage;
        setComments((prev) => {
          if (mode !== 'more') return result.comments;
          const seen = new Set(prev.map((c) => c.id));
          return [...prev, ...result.comments.filter((c) => !seen.has(c.id))];
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement.');
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [getToken, ensureUserId, postId],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: recharge quand le post change.
  useEffect(() => {
    load('initial');
  }, [postId]);

  const refresh = useCallback(() => {
    nextPageRef.current = 1;
    load('refresh');
  }, [load]);

  const loadMore = useCallback(() => {
    if (nextPageRef.current != null) load('more');
  }, [load]);

  const addComment = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text) return;
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');
      const userId = await ensureUserId(token);
      const created = await createComment(postId, userId, text, token);
      setComments((prev) => [created, ...prev]);
    },
    [getToken, ensureUserId, postId],
  );

  const addReply = useCallback(
    async (parentId: number, content: string) => {
      const text = content.trim();
      if (!text) return;
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');
      const userId = await ensureUserId(token);
      const created = await createComment(postId, userId, text, token, parentId);
      setComments((prev) =>
        patchComment(prev, parentId, (c) => ({
          ...c,
          replyCount: c.replyCount + 1,
          replies: [...(c.replies ?? []), created],
        })),
      );
    },
    [getToken, ensureUserId, postId],
  );

  const toggleCommentLike = useCallback(
    async (commentId: number) => {
      const target = findComment(commentsRef.current, commentId);
      if (!target) return;
      const previous = { likedByMe: target.likedByMe, likeCount: target.likeCount };
      const next = nextLikeState(previous.likedByMe, previous.likeCount);
      setComments((prev) =>
        patchComment(prev, commentId, (c) => ({
          ...c,
          likedByMe: next.liked,
          likeCount: next.count,
        })),
      );
      try {
        const token = await getToken();
        if (!token) throw new Error('Session expirée, reconnecte-toi.');
        const userId = await ensureUserId(token);
        await toggleCommentLikeApi(commentId, userId, token);
      } catch {
        setComments((prev) => patchComment(prev, commentId, (c) => ({ ...c, ...previous })));
        Alert.alert('Erreur', 'Impossible de mettre à jour le like.');
      }
    },
    [getToken, ensureUserId],
  );

  const removeComment = useCallback(
    async (commentId: number) => {
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');
      const userId = await ensureUserId(token);
      await deleteCommentApi(commentId, userId, token);
      setComments((prev) => removeCommentFrom(prev, commentId));
    },
    [getToken, ensureUserId],
  );

  const editComment = useCallback(
    async (commentId: number, content: string) => {
      const text = content.trim();
      if (!text) return;
      const token = await getToken();
      if (!token) throw new Error('Session expirée, reconnecte-toi.');
      const userId = await ensureUserId(token);
      const updated = await updateCommentApi(commentId, text, userId, token);
      setComments((prev) =>
        patchComment(prev, commentId, (c) => ({ ...c, content: updated.content })),
      );
    },
    [getToken, ensureUserId],
  );

  return {
    comments,
    loading,
    refreshing,
    loadingMore,
    error,
    currentUserId,
    refresh,
    loadMore,
    addComment,
    addReply,
    toggleCommentLike,
    removeComment,
    editComment,
  };
}
