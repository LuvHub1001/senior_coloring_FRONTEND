import { useNavigate } from "react-router-dom";
import { postLogout } from "@/apis";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await postLogout();
    } finally {
      // API 성공/실패 관계없이 로컬 토큰 제거 후 로그인 페이지로 이동
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/", { replace: true });
    }
  };

  return { handleLogout };
};

export { useLogout };
