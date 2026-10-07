import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/profile.styles';
import EditProfileModal from './EditProfileModal';
import ProfileGrid from './ProfileGrid';
import ProfileHeader from './ProfileHeader';
import { useProfile } from './useProfile';

/** Écran du profil connecté : en-tête, onglets publications / likés et grille de posts. */
export default function ProfileScreen() {
  const {
    profile,
    loading,
    error,
    tab,
    selectTab,
    posts,
    listLoading,
    refreshing,
    loadingMore,
    loadMore,
    refresh,
    reloadProfile,
  } = useProfile();
  const [editing, setEditing] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.message}>{error ?? 'Profil indisponible.'}</Text>
          <Pressable style={styles.retry} onPress={refresh}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const header = (
    <>
      <ProfileHeader profile={profile} onEdit={() => setEditing(true)} />
      <View style={styles.tabs}>
        <TabButton icon="th" active={tab === 'posts'} onPress={() => selectTab('posts')} />
        <TabButton icon="heart-o" active={tab === 'liked'} onPress={() => selectTab('liked')} />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.topUsername}>{profile.username}</Text>
      </View>

      <ProfileGrid
        posts={posts}
        loading={listLoading}
        refreshing={refreshing}
        loadingMore={loadingMore}
        emptyLabel={tab === 'posts' ? 'Aucune publication.' : 'Aucun post liké.'}
        header={header}
        onRefresh={refresh}
        onLoadMore={loadMore}
      />

      <EditProfileModal
        visible={editing}
        profile={profile}
        onClose={() => setEditing(false)}
        onSaved={reloadProfile}
      />
    </SafeAreaView>
  );
}

/** Onglet de la grille (publications ou likés) avec soulignement actif. */
function TabButton({
  icon,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress} hitSlop={6}>
      <FontAwesome name={icon} size={22} color={active ? palette.black : palette.gray500} />
    </Pressable>
  );
}
