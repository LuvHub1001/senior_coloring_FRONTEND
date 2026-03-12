import goldFrame from "@images/home/gold_frame.svg";

interface GalleryDetailOverlayProps {
  title: string;
  authorName: string;
  timeAgo: string;
  imageUrl: string;
  likeCount: number;
  isLiked: boolean;
  onClose: () => void;
  onLikeToggle: () => void;
}

function GalleryDetailOverlay({
  title,
  authorName,
  timeAgo,
  imageUrl,
  likeCount,
  isLiked,
  onClose,
  onLikeToggle,
}: GalleryDetailOverlayProps) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* 어두운 배경 + 블러 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[12px]" />

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-[16px] top-[26px] z-10 flex size-[48px] items-center justify-center rounded-full bg-white/10 cursor-pointer"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 7l14 14M21 7L7 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 중앙 콘텐츠 (클릭 이벤트 전파 방지) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
        {/* 작품 정보 */}
        <div className="flex flex-col items-center gap-[6px]">
          <h2 className="text-[26px] font-[600] leading-[35px] tracking-[-0.13px] text-white">
            {title}
          </h2>
          <div className="flex items-center gap-[4px]">
            <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-white">
              {authorName}
            </span>
            <span className="size-[2px] rounded-full bg-white" />
            <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-[#8B95A1]">
              {timeAgo}
            </span>
          </div>
        </div>

        {/* 액자 + 작품 이미지 */}
        <div className="relative w-[366px] h-[366px]">
          {/* 액자 프레임 */}
          <img
            src={goldFrame}
            alt="액자"
            className="absolute inset-0 size-full pointer-events-none"
          />
          {/* 작품 이미지 (액자 내부) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px]"
            style={{ width: "250px", height: "250px" }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="size-full object-cover"
            />
          </div>
        </div>

        {/* 좋아요 버튼 */}
        <button
          type="button"
          onClick={onLikeToggle}
          className={`flex items-center gap-[8px] rounded-full border px-[17px] py-[13px] cursor-pointer ${
            isLiked
              ? "border-[#F66571] bg-[rgba(3,24,50,0.46)]"
              : "border-[rgba(255,255,255,0.3)] bg-[rgba(3,24,50,0.46)]"
          }`}
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
              stroke={isLiked ? "#F66571" : "rgba(255,255,255,0.5)"}
              strokeWidth="1.5"
            />
          </svg>
          <span
            className={`text-[17px] font-[700] leading-[25.5px] tracking-[-0.085px] ${
              isLiked ? "text-[#F66571]" : "text-white/50"
            }`}
          >
            {likeCount}
          </span>
        </button>
      </div>
    </div>
  );
}

export { GalleryDetailOverlay };
