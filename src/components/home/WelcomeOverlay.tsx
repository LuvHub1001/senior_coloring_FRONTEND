import { Confetti } from "@/components/completion";

interface WelcomeOverlayProps {
  userName: string;
  onDismiss: () => void;
}

function WelcomeOverlay({ userName, onDismiss }: WelcomeOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white welcome-fade-in">
      {/* 꽃가루 효과 (도안 완료 시와 동일) */}
      <Confetti />

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        {/* 환영 텍스트 */}
        <div className="flex flex-col items-center gap-3 text-center welcome-text-up">
          <p className="text-[16px] font-[500] text-[#4ECDC4] tracking-[-0.08px] leading-[24px]">
            가입을 축하해요!
          </p>
          <div className="text-[30px] font-[700] text-black tracking-[-0.15px] leading-[40px]">
            <p>{userName}님,</p>
            <p>환영합니다!</p>
          </div>
          <p className="text-[16px] text-[rgba(0,0,0,0.5)] tracking-[-0.3125px] leading-[24px] mt-1">
            나만의 컬러링 전시관을 만들어보세요
          </p>
        </div>
      </div>

      {/* 하단 시작 버튼 */}
      <div className="relative z-10 px-5 pb-[34px]">
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#252525] cursor-pointer"
        >
          <span className="text-[19px] font-[700] text-white tracking-[-0.095px] leading-[28px]">
            시작하기
          </span>
        </button>
      </div>
    </div>
  );
}

export { WelcomeOverlay };
