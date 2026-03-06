import instance from "@/apis";
import type { ThemeListResponse, ThemeSelectResponse } from "@/types";

// 테마 목록 조회
export const getThemes = async (): Promise<ThemeListResponse> => {
  const { data } = await instance.get<ThemeListResponse>("/api/themes");
  return data;
};

// 테마 선택
export const selectTheme = async (themeId: number): Promise<ThemeSelectResponse> => {
  const { data } = await instance.patch<ThemeSelectResponse>(
    "/api/themes/select",
    { themeId },
  );
  return data;
};
