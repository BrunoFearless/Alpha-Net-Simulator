export interface AvatarConfig {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  clothingStyle: string;
  clothingColor: string;
  accessory: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  avatarConfig?: AvatarConfig;
  bio?: string;
  followers?: number;
  following?: number;
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
  boostedTokens?: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  themeColor: string;
  icon: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'message' | 'comment' | 'like' | 'follow' | 'system';
  senderId?: string;
  senderName?: string;
  content: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}

export interface Module {
  id: string;
  title: string;
  color: string;
  iconName: string;
  desc: string;
}
