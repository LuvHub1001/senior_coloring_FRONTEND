import { useNavigate } from "react-router-dom";
import { postLogout } from "@/apis";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 토큰을 먼저 제거하여 logout API 실패 시 401 → refresh 순환 방지
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    try {
      await postLogout();
    } catch {
      // 로그아웃 API 실패해도 무시 (토큰은 이미 제거됨)
    }

    navigate("/", { replace: true });
  };

  return { handleLogout };
};

export { useLogout };
