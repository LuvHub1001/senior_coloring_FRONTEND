import { Confetti } from "@/components/completion/Confetti";

interface CompletionScreenProps {
  artworkImageUrl: string;
  frameImageUrl: string;
  onDismiss: () => void;
  onSaveToMuseum: () => void;
  onShare: () => void;
}

function CompletionScreen({
  artworkImageUrl,
  frameImageUrl,
  onDismiss,
  onSaveToMuseum,
  onShare,
}: CompletionScreenProps) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      {/* 꽃가루 효과 */}
      <Confetti />

      {/* 상단 네비 - 그만하기 */}
      <div className="relative z-10 flex h-11 items-center justify-end px-5">
        <button
          type="button"
          onClick={onDismiss}
          className="text-[17px] font-medium text-[#666] tracking-[-0.085px] leading-[25.5px] cursor-pointer"
        >
          그만하기
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        {/* 축하 텍스트 */}
        <div className="flex flex-col items-center gap-[10px] text-center">
          <div className="text-[30px] font-bold text-black tracking-[-0.15px] leading-[40px]">
            <p>멋진 작품이</p>
            <p>완성되었어요!</p>
          </div>
          <p className="text-[16px] text-[rgba(0,0,0,0.7)] tracking-[-0.3125px] leading-[24px]">
            미술관에 전시할 준비가 되었어요
          </p>
        </div>

        {/* 액자 속 작품 */}
        <div className="relative mt-4 w-[320px] h-[384px]">
          {/* 액자 프레임 */}
          <img
            src={frameImageUrl}
            alt="액자"
            className="absolute inset-0 w-[320px] h-[384px] pointer-events-none"
          />
          {/* 작품 이미지 — 액자 내부 중앙 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden rounded-[4px]" style={{ width: "179px", height: "232px" }}>
            <img
              src={artworkImageUrl}
              alt="완성된 작품"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 하단 CTA 버튼 */}
      <div className="relative z-10 flex flex-col gap-3 bg-white px-5 pb-[34px]">
        <button
          type="button"
          onClick={onSaveToMuseum}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#252525] cursor-pointer"
        >
          <span className="text-[19px] font-bold text-white tracking-[-0.095px] leading-[28px]">
            미술관에 저장하기
          </span>
        </button>

        <button
          type="button"
          onClick={onShare}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#F3F4F6] cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="14" cy="3.5" r="2.5" stroke="#787777" strokeWidth="1.5" />
            <circle cx="14" cy="14.5" r="2.5" stroke="#787777" strokeWidth="1.5" />
            <circle cx="4" cy="9" r="2.5" stroke="#787777" strokeWidth="1.5" />
            <path d="M6.5 7.5L11.5 5" stroke="#787777" strokeWidth="1.5" />
            <path d="M6.5 10.5L11.5 13" stroke="#787777" strokeWidth="1.5" />
          </svg>
          <span className="text-[17px] font-bold text-[#787777] tracking-[-0.085px] leading-[25.5px]">
            공유하기
          </span>
        </button>
      </div>
    </div>
  );
}

export { CompletionScreen };
