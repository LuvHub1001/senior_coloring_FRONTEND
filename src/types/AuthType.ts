export interface AuthUser {
  id: string;
  email: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatarUrl: string;
  email: string;
  createdAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}
