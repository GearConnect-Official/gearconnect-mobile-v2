import { useAuth } from '@clerk/expo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { toggleLike as toggleLikeApi } from '@/services/api/interactionService';
import { getCurrentUser, getPosts } from '@/services/api/postService';
import type { FeedPost } from '@/types/post.types';

type LoadMode = 'initial' | 'refresh' | 'more';

/** Charge le feed : pagination par page, pull-to-refresh, dédup et like optimiste. */
export function usePosts() {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPageRef = useRef<number | null>(1);
  const userIdRef = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const postsRef = useRef<FeedPost[]>([]);
  postsRef.current = posts;

  const ensureUserId = useCallback(async (token: string) => {
    if (userIdRef.current == null) {
      userIdRef.current = (await getCurrentUser(token)).id;
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
        const result = await getPosts(page, userId, token);
        nextPageRef.current = result.nextPage;
        setPosts((prev) => {
          if (mode !== 'more') return result.posts;
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...result.posts.filter((p) => !seen.has(p.id))];
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
    [getToken, ensureUserId],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: chargement unique au montage.
  useEffect(() => {
    load('initial');
  }, []);

  const refresh = useCallback(() => {
    nextPageRef.current = 1;
    load('refresh');
  }, [load]);

  const loadMore = useCallback(() => {
    if (nextPageRef.current != null) load('more');
  }, [load]);

  const patchPost = useCallback((id: number, patch: Partial<FeedPost>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const toggleLike = useCallback(
    async (postId: number) => {
      const target = postsRef.current.find((p) => p.id === postId);
      if (!target) return;
      const previous = { likedByMe: target.likedByMe, likeCount: target.likeCount };
      patchPost(postId, {
        likedByMe: !previous.likedByMe,
        likeCount: previous.likeCount + (previous.likedByMe ? -1 : 1),
      });
      try {
        const token = await getToken();
        if (!token) throw new Error('Session expirée, reconnecte-toi.');
        const userId = await ensureUserId(token);
        await toggleLikeApi(postId, userId, token);
      } catch {
        patchPost(postId, previous);
        Alert.alert('Erreur', 'Impossible de mettre à jour le like.');
      }
    },
    [getToken, ensureUserId, patchPost],
  );

  return { posts, loading, refreshing, loadingMore, error, refresh, loadMore, toggleLike };
}
