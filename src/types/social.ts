// Types cho Social Media Profiles

export interface InstagramProfile {
  username: string;
  fullName: string;
  bio: string;
  profilePicUrl: string;
  profilePicUrlHD?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  externalUrl?: string;
  category?: string;
  posts: InstagramPost[];
}

export interface InstagramPost {
  id: string;
  shortcode: string;
  imageUrl: string;
  thumbnailUrl?: string;
  likes: number;
  comments: number;
  isVideo: boolean;
  videoUrl?: string;
  caption?: string;
  timestamp?: number;
}

export interface TikTokProfile {
  username: string;
  nickname: string;
  bio: string;
  profilePicUrl: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  videoCount: number;
  isVerified: boolean;
  videos: TikTokVideo[];
  stories: TikTokStory[];
  reposts: TikTokVideo[];
}

export interface TikTokVideo {
  id: string;
  description: string;
  coverUrl: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp?: number;
}

export interface TikTokStory {
  id: string;
  coverUrl: string;
  videoUrl?: string;
  images?: string[];
  duration: number;
  timestamp: number;
  isPhoto: boolean;
  musicUrl?: string;
  musicTitle?: string;
}

export interface FacebookProfile {
  username: string;
  name: string;
  bio?: string;
  profilePicUrl: string;
  coverPhotoUrl?: string;
  followersCount?: number;
  friendsCount?: number;
  isVerified: boolean;
  category?: string;
  location?: string;
  posts: FacebookPost[];
}

export interface FacebookPost {
  id: string;
  content?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp?: number;
}

export interface ThreadsProfile {
  username: string;
  fullName: string;
  bio: string;
  profilePicUrl: string;
  followersCount: number;
  isVerified: boolean;
  threads: ThreadsPost[];
}

export interface ThreadsPost {
  id: string;
  content: string;
  imageUrl?: string;
  likes: number;
  replies: number;
  reposts: number;
  timestamp?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
