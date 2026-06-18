import { useAuth } from '@clerk/expo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Share } from 'react-native';
import { ENV } from '@/config/env';
import { toggleLike as toggleLikeApi } from '@/services/api/interactionService';
import { getCurrentUser, getPostById, getPosts } from '@/services/api/postService';
import { createShare } from '@/services/api/shareService';
import type { FeedPost } from '@/types/post.types';
import { nextLikeState } from './likes';

type LoadMode = 'initial' | 'refresh' | 'more';

/**
 * Charge le feed : pagination, pull-to-refresh, dédup et like optimiste.
 * Si `initialPostId` est fourni (lien partagé), ce post est épinglé en tête
 * de feed et la suite défile normalement en dessous.
 */
export function usePosts(initialPostId?: number) {
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

        // Sur le premier chargement d'un lien partagé : épingler le post en tête.
        let pagePosts = result.posts;
        if (mode !== 'more' && initialPostId != null) {
          try {
            const pinned = await getPostById(initialPostId, userId, token);
            pagePosts = [pinned, ...pagePosts.filter((p) => p.id !== pinned.id)];
          } catch {
            // Post partagé introuvable/supprimé : on affiche simplement le feed normal.
          }
        }

        setPosts((prev) => {
          if (mode !== 'more') return pagePosts;
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
    [getToken, ensureUserId, initialPostId],
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
      const next = nextLikeState(previous.likedByMe, previous.likeCount);
      patchPost(postId, { likedByMe: next.liked, likeCount: next.count });
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

  const share = useCallback(
    async (postId: number) => {
      const target = postsRef.current.find((p) => p.id === postId);
      if (!target) return;

      // 1) Ouvrir la popup native de partage EN PREMIER — rien ne doit l'empêcher.
      // Lien public (App/Universal Link) : ouvre l'app sur le post si installée.
      const postLink = `${ENV.webUrl}/post/${postId}`;
      const author = target.author.username;
      const snippet = target.body?.trim();
      // Message lisible et signé GearConnect (la prévisualisation riche viendra
      // de la page web /post/:id avec ses balises Open Graph).
      const message = snippet
        ? `« ${snippet} »\n\n— ${author} sur GearConnect 🏁\n${postLink}`
        : `Découvre ce post de ${author} sur GearConnect 🏁\n${postLink}`;
      let result: Awaited<ReturnType<typeof Share.share>>;
      try {
        result = await Share.share({ message, title: 'GearConnect' });
      } catch {
        Alert.alert('Erreur', 'Impossible d’ouvrir le partage.');
        return;
      }
      if (result.action !== Share.sharedAction) return;

      // 2) L'utilisateur a bien partagé : enregistrer l'événement + incrémenter (optimiste).
      patchPost(postId, { shareCount: target.shareCount + 1 });
      try {
        const token = await getToken();
        if (!token) throw new Error('Session expirée, reconnecte-toi.');
        const userId = await ensureUserId(token);
        await createShare(postId, userId, token);
      } catch {
        patchPost(postId, { shareCount: target.shareCount });
        Alert.alert('Erreur', 'Impossible d’enregistrer le partage.');
      }
    },
    [getToken, ensureUserId, patchPost],
  );

  return {
    posts,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
    toggleLike,
    share,
  };
}
