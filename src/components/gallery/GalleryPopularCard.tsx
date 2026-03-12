interface GalleryPopularCardProps {
  imageUrl: string;
  title: string;
  authorName: string;
  timeAgo: string;
  likeCount: number;
  isLiked: boolean;
  onClick: () => void;
}

function GalleryPopularCard({
  imageUrl,
  title,
  authorName,
  timeAgo,
  likeCount,
  isLiked,
  onClick,
}: GalleryPopularCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 w-[218px] rounded-[20px] bg-[rgba(253,253,255,0.75)] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer text-left"
    >
      {/* 썸네일 이미지 */}
      <div className="h-[160px] w-full overflow-hidden bg-gradient-to-b from-white/20 to-white/40">
        <img
          src={imageUrl}
          alt={title}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col gap-[4px] p-[16px]">
        <p className="text-[17px] font-[700] leading-[25.5px] tracking-[-0.085px] text-[#191F28] truncate">
          {title}
        </p>
        <div className="flex items-center gap-[4px]">
          <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-[#4E5968] shrink-0">
            {authorName}
          </span>
          <span className="size-[2px] rounded-full bg-[#B0B8C1] shrink-0" />
          <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-[#8B95A1] flex-1 truncate">
            {timeAgo}
          </span>
          {/* 좋아요 */}
          <div className="flex items-center gap-[4px] shrink-0">
            <svg
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 10.125S1.5 7.425 1.5 4.469A2.656 2.656 0 0 1 6 2.614a2.656 2.656 0 0 1 4.5 1.855c0 2.956-4.5 5.656-4.5 5.656z"
                fill={isLiked ? "#F66571" : "#B0B8C1"}
              />
            </svg>
            <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-[#6B7280]">
              {likeCount}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export { GalleryPopularCard };
