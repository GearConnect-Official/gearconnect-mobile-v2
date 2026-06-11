import { ENV } from '@/config/env';
import { SelectedMedia, UploadedMedia } from '@/types/post.types';

/** Devine un nom de fichier + mime à partir de l'URI locale. */
function inferFile(media: SelectedMedia): { name: string; mime: string } {
  const ext = media.uri.split('.').pop()?.split('?')[0]?.toLowerCase() ?? (media.type === 'VIDEO' ? 'mp4' : 'jpg');
  const name = `upload.${ext}`;
  const mime =
    media.type === 'VIDEO'
      ? `video/${ext}`
      : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  return { name, mime };
}

/**
 * Upload "unsigned" d'un média vers Cloudinary depuis l'app.
 * N'utilise que cloud_name + upload_preset (publics) — jamais l'API secret.
 */
export async function uploadToCloudinary(media: SelectedMedia): Promise<UploadedMedia> {
  const { cloudName, uploadPreset } = ENV.cloudinary;
  if (!cloudName || !uploadPreset) {
    throw new Error('Config Cloudinary manquante (cloud_name / upload_preset).');
  }

  const resourceType = media.type === 'VIDEO' ? 'video' : 'image';
  const { name, mime } = inferFile(media);

  const form = new FormData();
  // En React Native, on passe un objet { uri, name, type } comme "fichier".
  form.append('file', { uri: media.uri, name, type: mime } as any);
  form.append('upload_preset', uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: form },
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Upload Cloudinary échoué (${res.status}) : ${detail}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    type: media.type,
    width: data.width,
    height: data.height,
  };
}

/** Upload tous les médias en parallèle, dans l'ordre fourni. */
export function uploadAll(medias: SelectedMedia[]): Promise<UploadedMedia[]> {
  return Promise.all(medias.map(uploadToCloudinary));
}
