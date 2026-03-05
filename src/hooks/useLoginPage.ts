const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useLoginPage = () => {
  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/naver`;
  };

  return { handleKakaoLogin, handleNaverLogin };
};

export { useLoginPage };
