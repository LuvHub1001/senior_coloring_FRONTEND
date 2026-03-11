import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/apis";

// 로그인한 사용자 프로필 조회 훅
export const useUserProfile = () => {
  const token = localStorage.getItem("token");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: !!token,
  });

  return {
    userProfile: data?.data ?? null,
    isLoading,
    isError,
  };
};
