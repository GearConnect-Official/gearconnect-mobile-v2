export type MediaType = 'IMAGE' | 'VIDEO';

/** Média choisi localement (galerie/caméra), pas encore uploadé. */
export interface SelectedMedia {
  uri: string;
  type: MediaType;
  width?: number;
  height?: number;
}

/** Média après upload Cloudinary, prêt à être envoyé au backend. */
export interface UploadedMedia {
  url: string;
  publicId: string;
  type: MediaType;
  width?: number;
  height?: number;
}

/** Corps attendu par POST /posts. */
export interface CreatePostInput {
  body: string;
  userId: number;
  media: UploadedMedia[];
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
}
