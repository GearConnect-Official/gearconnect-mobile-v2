/**
 * Config dynamique Expo. La config statique vit dans app.json (reçue ici via `config`) :
 * ce fichier n'ajoute QUE ce qui dépend de l'environnement (.env), à ne pas commiter en dur.
 */
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
});
