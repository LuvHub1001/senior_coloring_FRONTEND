import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "@/hooks/useErrorToast";

// 에러 코드별 기본 메시지
const DEFAULT_ERROR_MESSAGES: Record<string, string> = {
  provider_unavailable: "로그인 서비스에 일시적인 문제가 발생했습니다.",
  auth_failed: "로그인 인증에 실패했습니다.",
  server_error: "서버에 문제가 발생했습니다.",
};

const useAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get("error");
    const errorMessage = hashParams.get("error_message");
    const token = hashParams.get("token");
    const refreshToken = hashParams.get("refreshToken");
    const isNewUser = hashParams.get("isNew") === "true";

    // URL에서 hash 정보 제거 (브라우저 히스토리에 토큰/에러가 남지 않도록)
    window.history.replaceState({}, document.title, window.location.pathname);

    // 에러 처리
    if (error) {
      if (error !== "user_cancelled") {
        const message =
          errorMessage ||
          DEFAULT_ERROR_MESSAGES[error] ||
          "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        showErrorToast(message);
      }
      navigate("/", { replace: true });
      return;
    }

    // 정상 플로우
    if (token) {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
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
