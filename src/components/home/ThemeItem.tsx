interface ThemeItemProps {
  name: string;
  description: string;
  imageUrl: string;
  isSelected?: boolean;
  isLocked?: boolean;
  onSelect?: () => void;
}

function ThemeItem({
  name,
  description,
  imageUrl,
  isSelected = false,
  isLocked = false,
  onSelect,
}: ThemeItemProps) {
  if (isLocked) {
    return (
      <div className="flex w-full items-center rounded-2xl bg-[rgba(2,32,71,0.05)] px-5">
        <div className="flex flex-1 items-center gap-4 py-4">
          {/* 테마 이미지 미리보기 */}
          <img
            src={imageUrl}
            alt={name}
            className="size-16 shrink-0 rounded-[10px] opacity-40 object-cover"
          />

          {/* 테마 정보 */}
          <div className="flex flex-col gap-1">
            <span className="text-[20px] font-[700] text-[#8B95A1] tracking-[-0.1px] leading-[29px]">
              {name}
            </span>
            <span className="text-[17px] font-[500] text-[#8B95A1] tracking-[-0.085px] leading-[25.5px]">
              {description}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-5 rounded-2xl border px-5 cursor-pointer ${
        isSelected
          ? "border-[#191F28] bg-white"
          : "border-[#E5E8EB] bg-white"
      }`}
    >
      <div className="flex flex-1 items-center gap-4 py-4">
        {/* 테마 이미지 미리보기 */}
        <img
          src={imageUrl}
          alt={name}
          className="size-[72px] shrink-0 rounded-[9px] border border-[#E5E8EB] object-cover"
        />

        {/* 테마 정보 */}
        <div className="flex flex-col gap-1">
          <span className="text-[20px] font-[700] text-[#191F28] tracking-[-0.1px] leading-[29px]">
            {name}
          </span>
          <span className="text-[17px] font-[500] text-[#191F28] tracking-[-0.085px] leading-[25.5px]">
            {description}
          </span>
        </div>
      </div>

      {/* 선택 체크 */}
      {isSelected && (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#191F28]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 10l4.5 4.5L16 6"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

export { ThemeItem };
