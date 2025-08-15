export interface BlogUser {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface BlogPost {
  id: string;
  user: BlogUser;
  content?: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface BlogComment {
  id: string;
  postId: string;
  user: BlogUser;
  content: string;
  timestamp: string;
  likes: number;
}

export interface CreatePostData {
  content?: string;
  image?: string;
}

export interface BlogState {
  posts: BlogPost[];
  comments: BlogComment[];
  loading: boolean;
  error: string | null;
  createPostLoading: boolean;
  createCommentLoading: boolean;
}
