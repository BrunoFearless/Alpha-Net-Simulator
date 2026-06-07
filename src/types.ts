export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  badges: string[];
}

export interface PostComment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  media?: string;
  timestamp: string;
  likes: number;
  comments: number;
  commentsList?: PostComment[];
  shares: number;
  isLiked?: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  themeColor: string;
  icon: string;
}
