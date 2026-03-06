export interface Theme {
  id: number;
  name: string;
  requiredArtworks: number;
  imageUrl: string;
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
  unlocked: boolean;
  selected: boolean;
}

export interface ThemeListResponse {
  success: boolean;
  data: Theme[];
}

export interface ThemeSelectRequest {
  themeId: number;
}

export interface ThemeSelectResponse {
  success: boolean;
  data: {
    selectedThemeId: number;
    theme: Theme;
  };
}
