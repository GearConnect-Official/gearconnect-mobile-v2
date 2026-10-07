import { useAuth } from '@clerk/expo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentUser, getLikedPosts, getUserPosts } from '@/services/api/postService';
import { getUserProfile } from '@/services/api/userService';
import type { FeedPost } from '@/types/post.types';
import type { UserProfile } from '@/types/user.types';

export type ProfileTab = 'posts' | 'liked';
type LoadMode = 'initial' | 'refresh' | 'more';

const fetchByTab = {
  posts: getUserPosts,
  liked: getLikedPosts,
};

const emptyByTab = <T>(value: T): Record<ProfileTab, T> => ({ posts: value, liked: value });

/**
 * Charge le profil de l'utilisateur connecté puis, par onglet (publications / likés),
 * la liste de posts associée avec pagination, refresh et dédup par id.
 */
export function useProfile() {
  const { getToken } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<ProfileTab>('posts');
  const [postsByTab, setPostsByTab] = useState<Record<ProfileTab, FeedPost[]>>(emptyByTab([]));
  const [listLoading, setListLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const userIdRef = useRef<number | null>(null);
  const nextPageRef = useRef<Record<ProfileTab, number | null>>(emptyByTab(1));
  const loadedRef = useRef<Record<ProfileTab, boolean>>(emptyByTab(false));
  const loadingRef = useRef(false);

  const loadList = useCallback(
    async (target: ProfileTab, mode: LoadMode) => {
      const userId = userIdRef.current;
      if (userId == null || loadingRef.current) return;
      const page = mode === 'more' ? nextPageRef.current[target] : 1;
      if (page == null) return;

      loadingRef.current = true;
      if (mode === 'more') setLoadingMore(true);
      else if (mode === 'refresh') setRefreshing(true);
      else setListLoading(true);

      try {
        const token = await getToken();
        if (!token) throw new Error('Session expirée, reconnecte-toi.');
        const result = await fetchByTab[target](userId, userId, page, token);
        nextPageRef.current[target] = result.nextPage;
        loadedRef.current[target] = true;
        setPostsByTab((prev) => {
          if (mode !== 'more') return { ...prev, [target]: result.posts };
          const seen = new Set(prev[target].map((p) => p.id));
          return {
            ...prev,
            [target]: [...prev[target], ...result.posts.filter((p) => !seen.has(p.id))],
          };
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement.');
      } finally {
        loadingRef.current = false;
        setListLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [getToken],
  );

  const reloadProfile = useCallback(async () => {
    const userId = userIdRef.current;
    if (userId == null) return;
    try {
      const token = await getToken();
      if (!token) return;
      setProfile(await getUserProfile(userId, token));
    } catch {
      // on conserve le profil déjà affiché en cas d'échec
    }
  }, [getToken]);

  // Chargement initial : id connecté -> profil -> première page des publications.
  // biome-ignore lint/correctness/useExhaustiveDependencies: chargement unique au montage.
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('Session expirée, reconnecte-toi.');
        const me = await getCurrentUser(token);
        userIdRef.current = me.id;
        setProfile(await getUserProfile(me.id, token));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement.');
      } finally {
        setLoading(false);
      }
      loadList('posts', 'initial');
    })();
  }, []);

  const selectTab = useCallback(
    (next: ProfileTab) => {
      setTab(next);
      if (!loadedRef.current[next]) loadList(next, 'initial');
    },
    [loadList],
  );

  const loadMore = useCallback(() => {
    if (nextPageRef.current[tab] != null) loadList(tab, 'more');
  }, [tab, loadList]);

  const refresh = useCallback(() => {
    nextPageRef.current[tab] = 1;
    reloadProfile();
    loadList(tab, 'refresh');
  }, [tab, reloadProfile, loadList]);

  return {
    profile,
    loading,
    error,
    tab,
    selectTab,
    posts: postsByTab[tab],
    listLoading,
    refreshing,
    loadingMore,
    loadMore,
    refresh,
    reloadProfile,
  };
}
