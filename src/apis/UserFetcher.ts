import instance from "@/apis";
import type { UserProfileResponse } from "@/types";

// 로그인한 사용자 프로필 조회
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await instance.get<UserProfileResponse>("/api/users/me");
  return data;
};
