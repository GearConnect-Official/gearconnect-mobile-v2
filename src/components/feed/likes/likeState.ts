/** Calcule l'état suivant d'un like : toggle du flag + ±1 du compteur. Pur, réutilisable (post, commentaire). */
export function nextLikeState(liked: boolean, count: number): { liked: boolean; count: number } {
  return {
    liked: !liked,
    count: count + (liked ? -1 : 1),
  };
}
