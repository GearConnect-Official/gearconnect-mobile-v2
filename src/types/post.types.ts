export type MediaType = 'IMAGE' | 'VIDEO';

/** Média choisi localement (galerie/caméra), pas encore uploadé. */
export interface SelectedMedia {
  uri: string;
  type: MediaType;
  width?: number;
  height?: number;
}

/** Paramètres d'envoi à POST /posts (multipart : le back gère l'upload Cloudinary). */
export interface CreatePostInput {
  body: string;
  userId: number;
  media: SelectedMedia[];
}

/** Média tel que renvoyé par l'API. */
export interface PostMedia {
  id: number;
  url: string;
  publicId: string;
  type: MediaType;
  order: number;
  width?: number | null;
  height?: number | null;
}

/** Post renvoyé par l'API (forme simplifiée, suffisante pour le feed). */
export interface Post {
  id: number;
  body: string;
  createdAt: string;
  media: PostMedia[];
  user: {
    id: number;
    username: string;
    name?: string;
    profilePicture?: string | null;
    isVerify?: boolean;
  };
  interactions?: PostInteraction[];
  isFavorited?: boolean;
  favoritesCount?: number;
}

/** Interaction (like/share/comment) accompagnant un post renvoyé par l'API. */
export interface PostInteraction {
  userId: number;
  like: boolean;
  share: boolean;
  comment?: string | null;
}

/** Auteur tel qu'affiché dans une carte du feed. */
export interface FeedAuthor {
  id: number;
  username: string;
  avatarUrl?: string | null;
  isVerify?: boolean;
}

/** Post prêt à afficher dans le feed : compteurs dérivés + état du like courant. */
export interface FeedPost {
  id: number;
  body: string;
  createdAt: string;
  author: FeedAuthor;
  media: PostMedia[];
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

/** Page de feed normalisée renvoyée par getPosts (`nextPage: null` = fin du feed). */
export interface PostsPage {
  posts: FeedPost[];
  nextPage: number | null;
}
