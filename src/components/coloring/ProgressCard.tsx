interface ProgressCardProps {
  thumbnail: string;
  title: string;
  progress: number;
  onClick: () => void;
}

function ProgressCard({ thumbnail, title, progress, onClick }: ProgressCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[73px] min-w-[200px] items-center gap-3 rounded-2xl bg-[rgba(253,253,254,0.89)] px-3 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] cursor-pointer"
    >
      {/* 썸네일 */}
      <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-[#E9E9E9] bg-[#F9FAFB]">
        <img
          src={thumbnail}
          alt={title}
          className="size-full object-cover"
        />
      </div>

      {/* 정보 */}
      <div className="flex flex-1 flex-col items-start">
        <span className="text-[17px] font-bold text-[#101828] tracking-[-0.085px] leading-[25.5px]">
          {title}
        </span>
        <span className="text-[13px] font-medium text-[#6A7282] tracking-[-0.065px] leading-[19.5px]">
          진행중 {progress}%
        </span>
      </div>

      {/* 화살표 아이콘 */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M7.5 4L13.5 10L7.5 16"
          stroke="#D1D5DB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export { ProgressCard };
