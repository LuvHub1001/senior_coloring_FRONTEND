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
