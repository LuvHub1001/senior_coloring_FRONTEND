interface ColoringHeaderProps {
  onBack: () => void;
}

function ColoringHeader({ onBack }: ColoringHeaderProps) {
  return (
    <header className="flex flex-col">
      <div className="flex h-[64px] items-center px-2">
        <div className="flex flex-1 items-center gap-[10px]">
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
          <span className="flex-1 text-[17px] font-bold text-[#191F28] tracking-[-0.085px] leading-[25.5px]">
            작품 만들기
          </span>
        </div>
      </div>
    </header>
  );
}

export { ColoringHeader };
