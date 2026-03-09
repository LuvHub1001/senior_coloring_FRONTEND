import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const useAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const isNewUser = searchParams.get("isNew") === "true";

    if (token) {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      navigate("/home", { replace: true, state: { isNewUser } });
    } else {
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);
};

export { useAuthCallbackPage };
