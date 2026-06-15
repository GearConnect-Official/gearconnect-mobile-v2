import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/publicationForm.styles';
import CaptionInput from './CaptionInput';
import Header from './Header';
import MediaSection from './MediaSection';
import PostPreview from './PostPreview';
import { usePublicationForm } from './usePublicationForm';

/** Écran de création de post en 2 étapes : sélection des médias → aperçu + description. */
export default function PublicationForm() {
  const {
    step,
    media,
    setMedia,
    description,
    setDescription,
    publishing,
    author,
    cancel,
    goToCaption,
    goBackToMedia,
    publish,
  } = usePublicationForm();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {step === 1 ? (
        <>
          <Header
            leftIcon="close"
            onLeft={cancel}
            rightLabel="Suivant"
            onRight={goToCaption}
            rightDisabled={media.length === 0}
          />
          <MediaSection media={media} onChange={setMedia} />
        </>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Header
            leftIcon="back"
            onLeft={goBackToMedia}
            rightLabel="Partager"
            onRight={publish}
            rightDisabled={description.trim().length === 0}
            rightLoading={publishing}
          />
          <ScrollView keyboardShouldPersistTaps="handled">
            <PostPreview author={author} media={media} />
            <View style={styles.divider} />
            <CaptionInput value={description} onChange={setDescription} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
