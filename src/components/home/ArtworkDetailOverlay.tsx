interface ArtworkDetailOverlayProps {
  title: string;
  imageUrl: string;
  dateLabel: string;
  reactionCount: number;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onClose: () => void;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
}

function ArtworkDetailOverlay({
  title,
  imageUrl,
  dateLabel,
  reactionCount,
  isMenuOpen,
  onMenuToggle,
  onClose,
  onEdit,
  onShare,
  onDelete,
}: ArtworkDetailOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#191f28]">
      {/* 딤 레이어 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 콘텐츠 */}
      <div className="absolute inset-x-0 top-0 flex flex-col items-center">
        {/* 상단 버튼 */}
        <div className="flex w-full items-center justify-end gap-[8px] px-[20px] pt-[20px] pb-[16px]">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex size-[48px] items-center justify-center rounded-full bg-white/10 cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="6" r="1.5" fill="white" />
              <circle cx="12" cy="12" r="1.5" fill="white" />
              <circle cx="12" cy="18" r="1.5" fill="white" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[48px] items-center justify-center rounded-full bg-white/10 cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 작품 정보 */}
        <div className="flex w-full flex-col gap-[6px] px-[20px] pb-[16px]">
          <h2 className="text-[26px] font-[700] leading-[35px] tracking-[-0.13px] text-white">
            {title}
          </h2>
          <div className="flex items-center gap-[4px]">
            <span className="text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-white">
              {dateLabel}
            </span>
            <span className="size-[2px] rounded-full bg-white" />
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 9.625s-4.125-2.475-4.125-5.156a2.406 2.406 0 0 1 4.125-1.68 2.406 2.406 0 0 1 4.125 1.68c0 2.681-4.125 5.156-4.125 5.156z"
                fill="white"
              />
            </svg>
            <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-white">
              {reactionCount}개
            </span>
          </div>
        </div>

        {/* 작품 이미지 */}
        <div className="w-full shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <img
            src={imageUrl}
            alt={title}
            className="h-[590px] w-full object-cover"
          />
        </div>
      </div>

      {/* 더보기 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="absolute right-[76px] top-[84px] z-10 w-[140px] overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.16)]">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-[48px] w-full items-center gap-[8px] px-[16px] cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2z"
                stroke="#4E5968"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-[#191f28]">
              수정하기
            </span>
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex h-[48px] w-full items-center gap-[8px] px-[16px] cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="3" r="2" stroke="#4E5968" strokeWidth="1.33" />
              <circle cx="4" cy="8" r="2" stroke="#4E5968" strokeWidth="1.33" />
              <circle cx="12" cy="13" r="2" stroke="#4E5968" strokeWidth="1.33" />
              <path
                d="M5.7 7.1l4.6-3.2M5.7 8.9l4.6 3.2"
                stroke="#4E5968"
                strokeWidth="1.33"
              />
            </svg>
            <span className="text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-[#191f28]">
              공유하기
            </span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-[48px] w-full items-center gap-[8px] px-[16px] cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z"
                stroke="#4E5968"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-[#191f28]">
              삭제하기
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export { ArtworkDetailOverlay };
