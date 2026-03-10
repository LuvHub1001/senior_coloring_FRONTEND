interface ZoomControlsProps {
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function ZoomControls({
  zoomPercent,
  onZoomIn,
  onZoomOut,
}: ZoomControlsProps) {
  return (
    <>
      {/* 줌 퍼센트 표시 (좌측 top-5 left-5) */}
      <div className="absolute left-5 top-5 z-10 flex h-[38px] items-center justify-center rounded-full bg-white px-[16px] shadow-[0px_4px_6px_rgba(0,0,0,0.1)]">
        <p className="whitespace-nowrap text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-[#364153]">
          {zoomPercent}%
        </p>
      </div>

      {/* 줌 인/아웃 버튼 (우측 top-5 right-5) */}
      <div className="absolute right-5 top-5 z-10 flex flex-col gap-[8px]">
        <button
          type="button"
          onClick={onZoomIn}
          className="flex size-[40px] items-center justify-center rounded-full bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1)]"
          aria-label="확대"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.75 2.5C5.298 2.5 2.5 5.298 2.5 8.75C2.5 12.202 5.298 15 8.75 15C12.202 15 15 12.202 15 8.75C15 5.298 12.202 2.5 8.75 2.5Z"
              stroke="#191F28"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.5 13.5L17.5 17.5"
              stroke="#191F28"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.667 8.75H10.833"
              stroke="#191F28"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.75 6.667V10.833"
              stroke="#191F28"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="flex size-[40px] items-center justify-center rounded-full bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1)]"
          aria-label="축소"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.75 2.5C5.298 2.5 2.5 5.298 2.5 8.75C2.5 12.202 5.298 15 8.75 15C12.202 15 15 12.202 15 8.75C15 5.298 12.202 2.5 8.75 2.5Z"
              stroke="#191F28"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.5 13.5L17.5 17.5"
              stroke="#191F28"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.667 8.75H10.833"
              stroke="#191F28"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

export { ZoomControls };
