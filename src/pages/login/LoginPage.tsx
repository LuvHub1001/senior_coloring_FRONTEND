import { LoginLanding } from "@/components";
import { useLoginPage } from "@/hooks";

function LoginPage() {
  const { handleKakaoLogin, handleNaverLogin } = useLoginPage();

  return (
    <LoginLanding
      onKakaoLogin={handleKakaoLogin}
      onNaverLogin={handleNaverLogin}
    />
  );
}

export { LoginPage };
