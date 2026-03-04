import sample1 from "@images/login/sample1.png";
import sample2 from "@images/login/sample2.png";
import sample3 from "@images/login/sample3.png";
import sample4 from "@images/login/sample4.png";
import sample5 from "@images/login/sample5.png";
import character from "@images/login/character.png";
import { useImageCarousel } from "@/hooks";

interface LoginLandingProps {
  onKakaoLogin?: () => void;
  onNaverLogin?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

const sampleImages = [sample1, sample2, sample3, sample4, sample5];

function LoginLanding({
  onKakaoLogin,
  onNaverLogin,
  onTermsClick,
  onPrivacyClick,
}: LoginLandingProps) {
  const { containerRef, repeatCount } = useImageCarousel(sampleImages.length, 0.5);

  return (
    <div className="flex flex-col min-h-dvh bg-[#F9FAFB] relative overflow-hidden">
      {/* 히어로 섹션 */}
      <div className="flex flex-col items-center pt-[70px] flex-1">
        {/* 타이틀 영역 */}
        <div className="text-center">
          <p className="text-[17px] text-[#4E5968] font-medium tracking-[-0.085px] leading-[25.5px]">
            쉽고 편안한 컬러링북
          </p>
          <h1 className="text-[30px] font-bold text-black tracking-[-0.15px] leading-[40px] mt-2">
            색으로 완성하는
            <br />
            나의 전시관
          </h1>
        </div>

        {/* 도안 이미지 캐러셀 */}
        <div className="relative w-full h-[297px] overflow-hidden">
          <div
            ref={containerRef}
            className="absolute flex gap-[30px] items-center top-[48px]"
          >
            {Array.from({ length: repeatCount }, (_, setIndex) =>
              sampleImages.map((src, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="size-[120px] rounded-[24px] shrink-0 overflow-hidden border-2 border-[#ebebeb]"
                >
                  <img
                    src={src}
                    alt={`컬러링 샘플 ${i + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              ))
            )}
          </div>

          {/* 캐릭터 일러스트 */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[42px] w-[202px] h-[303px]">
            <img
              src={character}
              alt="컬러링을 하는 캐릭터"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 하단 로그인 영역 */}
      <div className="w-full bg-white shadow-[0px_-6px_24px_rgba(0,0,0,0.08)] rounded-t-[24px] px-6 pt-6 pb-20 flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-3 w-full">
          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            onClick={onKakaoLogin}
            className="flex items-center gap-4 w-full h-[56px] bg-[#FEE500] rounded-[12px] px-5 cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 2.5C5.306 2.5 1.5 5.473 1.5 9.122c0 2.347 1.537 4.408 3.858 5.588l-.98 3.632a.3.3 0 0 0 .454.335l4.134-2.737c.34.03.685.048 1.034.048 4.694 0 8.5-2.973 8.5-6.622S14.694 2.5 10 2.5Z"
                fill="#3C1E1E"
              />
            </svg>
            <span className="flex-1 text-[17px] font-semibold text-[#191F28] tracking-[-0.085px] leading-[25.5px] text-center">
              카카오톡 시작하기
            </span>
            {/* 텍스트 중앙 정렬용 균형 요소 */}
            <div className="size-5 shrink-0 opacity-0" />
          </button>

          {/* 네이버 로그인 버튼 */}
          <button
            type="button"
            onClick={onNaverLogin}
            className="flex items-center gap-4 w-full h-[56px] bg-[#03C75A] rounded-[12px] px-5 cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M13.54 10.74L6.27 0H0v20h6.46V9.26L13.73 20H20V0h-6.46v10.74Z"
                fill="white"
                transform="scale(0.8) translate(2.5, 2.5)"
              />
            </svg>
            <span className="flex-1 text-[17px] font-semibold text-white tracking-[-0.085px] leading-[25.5px] text-center">
              네이버로 시작하기
            </span>
            {/* 텍스트 중앙 정렬용 균형 요소 */}
            <div className="size-5 shrink-0 opacity-0" />
          </button>
        </div>

        {/* 약관 링크 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onTermsClick}
            className="text-[14px] text-[#4E5968] leading-[16px] cursor-pointer"
          >
            이용약관
          </button>
          <div className="w-px h-3 bg-[#D1D6DB]" />
          <button
            type="button"
            onClick={onPrivacyClick}
            className="text-[14px] text-[#4E5968] leading-[16px] cursor-pointer"
          >
            개인정보처리방침
          </button>
        </div>
      </div>
    </div>
  );
}

export { LoginLanding };
