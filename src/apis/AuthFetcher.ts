import instance from "@/apis";
import type { TokenRefreshResponse, LogoutResponse } from "@/types";

// access token 만료 시 refresh token으로 새 토큰 쌍 발급
export const postRefreshToken = async (
  refreshToken: string
): Promise<TokenRefreshResponse> => {
  const { data } = await instance.post<TokenRefreshResponse>(
    "/api/auth/refresh",
    { refreshToken }
  );
  return data;
};

// 로그아웃 (해당 유저의 모든 refresh token 무효화)
export const postLogout = async (): Promise<LogoutResponse> => {
  const { data } = await instance.post<LogoutResponse>("/api/auth/logout");
  return data;
};
