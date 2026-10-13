/** Lecture centralisée des variables d'environnement publiques (EXPO_PUBLIC_*). */
export const ENV = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  // Base des liens partageables (App/Universal Links). Doit matcher app.json.
  webUrl: process.env.EXPO_PUBLIC_WEB_URL ?? 'https://gearconnect.app',
};
