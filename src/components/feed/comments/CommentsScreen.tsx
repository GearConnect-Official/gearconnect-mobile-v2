import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/commentsScreen.styles';
import CommentItem from './CommentItem';
import { useComments } from './useComments';

/** Écran des commentaires d'un post : le fil + le champ de saisie (commentaire ou réponse). */
export default function CommentsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  const {
    comments,
    loading,
    error,
    refreshing,
    currentUserId,
    draft,
    setDraft,
    replyingTo,
    setReplyingTo,
    submit,
    refresh,
    loadMore,
    toggleCommentLike,
    removeComment,
  } = useComments(postId);

  const onDelete = (commentId: number) => {
    Alert.alert('Supprimer', 'Supprimer ce commentaire ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeComment(commentId);
          } catch (e) {
            Alert.alert('Échec', e instanceof Error ? e.message : 'Impossible de supprimer.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <FontAwesome name="chevron-left" size={18} color={palette.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Commentaires</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {loading ? (
          <View style={styles.center}>
            <Text style={styles.message}>Chargement…</Text>
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <CommentItem
                comment={item}
                currentUserId={currentUserId}
                onToggleLike={toggleCommentLike}
                onReply={setReplyingTo}
                onDelete={onDelete}
              />
            )}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={refresh}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.message}>{error ?? 'Aucun commentaire.'}</Text>
              </View>
            }
          />
        )}

        {replyingTo && (
          <View style={styles.replyBanner}>
            <Text style={styles.replyBannerText}>Réponse à @{replyingTo.author.username}</Text>
            <Pressable onPress={() => setReplyingTo(null)} hitSlop={8}>
              <Text style={styles.replyBannerCancel}>Annuler</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={replyingTo ? 'Votre réponse…' : 'Ajouter un commentaire…'}
            placeholderTextColor={palette.gray500}
          />
          <Pressable style={styles.send} onPress={submit} hitSlop={8}>
            <Text style={styles.sendText}>Envoyer</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}
