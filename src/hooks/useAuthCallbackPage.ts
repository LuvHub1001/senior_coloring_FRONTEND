import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // hash fragment에서 토큰 파싱 (#token=...&refreshToken=...&isNew=...)
    // hash fragment는 서버 로그나 Referer 헤더에 포함되지 않아 토큰 노출 방지
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("token");
    const refreshToken = hashParams.get("refreshToken");
    const isNewUser = hashParams.get("isNew") === "true";

    if (token) {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // URL에서 토큰 정보 제거 (브라우저 히스토리에 토큰이 남지 않도록)
      window.history.replaceState({}, document.title, window.location.pathname);

      navigate("/home", { replace: true, state: { isNewUser } });
    } else if (localStorage.getItem("token")) {
      // StrictMode 재실행 시 hash가 이미 제거됐지만 토큰은 저장된 상태
      navigate("/home", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);
};

export { useAuthCallbackPage };
