interface ColoringPlayHeaderProps {
  title: string;
  onBack: () => void;
  onComplete: () => void;
  isCompleteEnabled: boolean;
}

function ColoringPlayHeader({
  title,
  onBack,
  onComplete,
  isCompleteEnabled,
}: ColoringPlayHeaderProps) {
  return (
    <header className="flex flex-col bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]">
      <div className="flex h-[64px] items-center px-2">
        <div className="flex flex-1 items-center gap-[10px]">
          {/* 뒤로가기 */}
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 items-center justify-center cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L8 12L15 19"
                stroke="#191F28"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 도안 제목 */}
          <span className="flex-1 text-[17px] font-bold text-[#191F28] tracking-[-0.085px] leading-[25.5px]">
            {title}
          </span>

          {/* 완성하기 버튼 */}
          <div className="pr-2">
            <button
              type="button"
              onClick={onComplete}
              disabled={!isCompleteEnabled}
              className={`h-10 rounded-[64px] px-3 text-[15px] font-bold tracking-[-0.075px] leading-[22.5px] cursor-pointer ${
                isCompleteEnabled
                  ? "bg-[#333D48] text-white"
                  : "bg-[rgba(2,32,71,0.05)] text-[rgba(0,25,54,0.31)]"
              }`}
            >
              완성하기
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export { ColoringPlayHeader };
