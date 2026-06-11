/** Lecture centralisée des variables d'environnement publiques (EXPO_PUBLIC_*). */
export const ENV = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  cloudinary: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
    uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '',
  },
};
