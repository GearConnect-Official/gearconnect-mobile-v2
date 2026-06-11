/**
 * Insère `f_auto,q_auto` dans une URL de livraison Cloudinary :
 * Cloudinary sert alors le meilleur format (webp/jpeg au lieu de HEIC) et une
 * qualité optimisée, pour un rendu universel (Android inclus) et plus léger.
 * Les URLs non-Cloudinary (ou locales) sont renvoyées telles quelles.
 */
export function withCloudinaryAuto(url: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (url.includes('/upload/f_auto')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}
