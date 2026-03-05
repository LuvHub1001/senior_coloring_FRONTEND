import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const useAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);
};

export { useAuthCallbackPage };
