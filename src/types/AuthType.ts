export interface AuthUser {
  id: string;
  email: string;
}

export interface SelectedTheme {
  id: number;
  name: string;
  imageUrl: string;
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatarUrl: string;
  email: string;
  selectedThemeId: number;
  selectedTheme: SelectedTheme;
  featuredArtworkId: string | null;
  createdAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  data: null;
}
