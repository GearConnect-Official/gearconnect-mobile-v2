/** Auteur d'un commentaire tel que renvoyé par l'API. */
export interface ApiCommentUser {
  id: number;
  name?: string;
  username: string;
  profilePicture?: string | null;
  profilePicturePublicId?: string | null;
  isVerify?: boolean;
}

/** Like d'un commentaire (table CommentLike) renvoyé par l'API. */
export interface ApiCommentLike {
  commentId: number;
  userId: number;
  createdAt?: string;
}

/** Commentaire brut renvoyé par l'API (GET /comments/post/:postId). */
export interface ApiComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  user: ApiCommentUser;
  likes: ApiCommentLike[];
  replies?: ApiComment[];
  _count: { replies: number; likes: number };
}

/** Pagination renvoyée par l'API pour les commentaires. */
export interface ApiCommentsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/** Réponse brute de GET /comments/post/:postId. */
export interface ApiCommentsResponse {
  comments: ApiComment[];
  pagination: ApiCommentsPagination;
}

/** Auteur tel qu'affiché dans une ligne de commentaire. */
export interface CommentAuthor {
  id: number;
  username: string;
  avatarUrl?: string | null;
  isVerify?: boolean;
}

/** Commentaire prêt à afficher : compteurs dérivés + état du like courant + réponses imbriquées. */
export interface FeedComment {
  id: number;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  likeCount: number;
  likedByMe: boolean;
  replyCount: number;
  replies?: FeedComment[];
}

/** Page de commentaires normalisée renvoyée par getComments (`nextPage: null` = fin). */
export interface CommentsPage {
  comments: FeedComment[];
  nextPage: number | null;
}
