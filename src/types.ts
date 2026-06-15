export interface Creator {
  username: string;
  name: string;
  avatar: string;
  followers: number;
  following: boolean;
}

export interface Comment {
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface MemeItem {
  id: string;
  type: "image" | "video";
  src: string;
  caption: string;
  topText?: string;
  bottomText?: string;
  likes: number;
  likedByUser: boolean;
  savedByUser: boolean;
  commentsCount: number;
  comments: Comment[];
  creator: Creator;
  audioTrack: string;
  tags: string[];
  isAd?: boolean;
}

export interface UserProfile {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  verified: boolean;
}
