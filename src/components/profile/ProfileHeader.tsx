import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/styles/colors';
import { styles } from '@/styles/profile.styles';
import type { UserProfile } from '@/types/user.types';
import { withCloudinaryAuto } from '@/utils/mediaUtils';

interface Props {
  profile: UserProfile;
  onEdit: () => void;
}

/** En-tête du profil : photo, pseudo, nom, description et bouton de modification. */
export default function ProfileHeader({ profile, onEdit }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.identity}>
        {profile.profilePicture ? (
          <Image
            source={withCloudinaryAuto(profile.profilePicture)}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <FontAwesome name="user" size={32} color={palette.white} />
          </View>
        )}
        <View style={styles.identityText}>
          <View style={styles.usernameRow}>
            <Text style={styles.username}>{profile.username}</Text>
            {profile.isVerify && (
              <FontAwesome name="check-circle" size={16} color={palette.primary} />
            )}
          </View>
          {profile.name.length > 0 && <Text style={styles.name}>{profile.name}</Text>}
        </View>
      </View>

      {profile.description && profile.description.length > 0 && (
        <Text style={styles.description}>{profile.description}</Text>
      )}

      <Pressable style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Modifier le profil</Text>
      </Pressable>
    </View>
  );
}
