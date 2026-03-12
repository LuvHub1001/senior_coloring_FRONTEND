interface GalleryActivityListItemProps {
  imageUrl: string;
  title: string;
  authorName: string;
  timeAgo: string;
  likeCount: number;
  isLiked: boolean;
  onLikeToggle: () => void;
  onClick: () => void;
}

function GalleryActivityListItem({
  imageUrl,
  title,
  authorName,
  timeAgo,
  likeCount,
  isLiked,
  onLikeToggle,
  onClick,
}: GalleryActivityListItemProps) {
  return (
    <div className="flex items-center gap-[14px] rounded-[20px] bg-[rgba(255,255,255,0.7)] border border-[rgba(255,255,255,0.5)] p-[12px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.06)]">
      {/* 썸네일 */}
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 size-[76px] rounded-[18px] overflow-hidden border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.4)] cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={title}
          className="size-full object-cover"
          loading="lazy"
        />
      </button>

      {/* 작품 정보 */}
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 flex-col gap-[6px] min-w-0 cursor-pointer text-left"
      >
        <p className="text-[17px] font-[700] leading-[25.5px] tracking-[-0.085px] text-[#191F28] truncate">
          {title}
        </p>
        <div className="flex items-center gap-[4px]">
          <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-[#4E5968] shrink-0">
            {authorName}
          </span>
          <span className="size-[2px] rounded-full bg-[#B0B8C1] shrink-0" />
          <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-[#8B95A1]">
            {timeAgo}
          </span>
        </div>
      </button>

      {/* 좋아요 버튼 */}
      <button
        type="button"
        onClick={onLikeToggle}
        className="flex shrink-0 flex-col items-center gap-[4px] px-[8px] cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 17.5s-7.5-4.5-7.5-9.375a4.375 4.375 0 0 1 7.5-3.05 4.375 4.375 0 0 1 7.5 3.05c0 4.875-7.5 9.375-7.5 9.375z"
            fill={isLiked ? "#F66571" : "none"}
            stroke={isLiked ? "#F66571" : "#B0B8C1"}
            strokeWidth="1.5"
          />
        </svg>
        <span
          className={`text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] ${
            isLiked ? "text-[rgba(0,12,31,0.8)]" : "text-[#B0B8C1]"
          }`}
        >
          {likeCount}
        </span>
      </button>
    </div>
  );
}

export { GalleryActivityListItem };
