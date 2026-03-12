import { GalleryActivityListItem } from "@/components/gallery/GalleryActivityListItem";
import { GalleryActivityGridItem } from "@/components/gallery/GalleryActivityGridItem";

interface ActivityArtwork {
  id: string;
  imageUrl: string;
  title: string;
  authorName: string;
  timeAgo: string;
  likeCount: number;
  isLiked: boolean;
}

interface GalleryActivitySectionProps {
  artworks: ActivityArtwork[];
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  onArtworkClick: (artworkId: string) => void;
  onLikeToggle: (artworkId: string) => void;
  onSeeAll: () => void;
}

function GalleryActivitySection({
  artworks,
  viewMode,
  onViewModeChange,
  onArtworkClick,
  onLikeToggle,
  onSeeAll,
}: GalleryActivitySectionProps) {
  return (
    <div className="flex flex-1 flex-col gap-[24px] px-[20px] py-[20px]">
      {/* 섹션 헤더 */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onSeeAll}
          className="flex items-center gap-[4px] cursor-pointer"
        >
          <span className="text-[19px] font-[700] leading-[28px] tracking-[-0.095px] text-[#0A0A0A]">
            활동 모아보기
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="#0A0A0A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 뷰 모드 토글 */}
        <div className="flex flex-1 items-center justify-end gap-[8px]">
          {/* 리스트 뷰 버튼 */}
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`flex items-center rounded-full p-[6px] cursor-pointer ${
              viewMode === "list" ? "bg-[rgba(2,32,71,0.05)]" : ""
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
                d="M3 5h14M3 10h14M3 15h14"
                stroke={viewMode === "list" ? "#191F28" : "#B0B8C1"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* 구분선 */}
          <div className="h-[12px] w-px bg-[rgba(0,27,55,0.1)]" />

          {/* 그리드 뷰 버튼 */}
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`flex items-center rounded-full p-[6px] cursor-pointer ${
              viewMode === "grid" ? "bg-[rgba(2,32,71,0.05)]" : ""
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="6"
                height="6"
                rx="1.5"
                stroke={viewMode === "grid" ? "#191F28" : "#B0B8C1"}
                strokeWidth="1.5"
              />
              <rect
                x="11"
                y="3"
                width="6"
                height="6"
                rx="1.5"
                stroke={viewMode === "grid" ? "#191F28" : "#B0B8C1"}
                strokeWidth="1.5"
              />
              <rect
                x="3"
                y="11"
                width="6"
                height="6"
                rx="1.5"
                stroke={viewMode === "grid" ? "#191F28" : "#B0B8C1"}
                strokeWidth="1.5"
              />
              <rect
                x="11"
                y="11"
                width="6"
                height="6"
                rx="1.5"
                stroke={viewMode === "grid" ? "#191F28" : "#B0B8C1"}
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      {viewMode === "list" ? (
        <div className="flex flex-col gap-[16px]">
          {artworks.map((artwork) => (
            <GalleryActivityListItem
              key={artwork.id}
              imageUrl={artwork.imageUrl}
              title={artwork.title}
              authorName={artwork.authorName}
              timeAgo={artwork.timeAgo}
              likeCount={artwork.likeCount}
              isLiked={artwork.isLiked}
              onLikeToggle={() => onLikeToggle(artwork.id)}
              onClick={() => onArtworkClick(artwork.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-[16px]">
          {/* 왼쪽 컬럼 */}
          <div className="flex flex-1 flex-col gap-[16px]">
            {artworks
              .filter((_, i) => i % 2 === 0)
              .map((artwork) => (
                <GalleryActivityGridItem
                  key={artwork.id}
                  imageUrl={artwork.imageUrl}
                  title={artwork.title}
                  onClick={() => onArtworkClick(artwork.id)}
                />
              ))}
          </div>
          {/* 오른쪽 컬럼 */}
          <div className="flex flex-1 flex-col gap-[16px]">
            {artworks
              .filter((_, i) => i % 2 === 1)
              .map((artwork) => (
                <GalleryActivityGridItem
                  key={artwork.id}
                  imageUrl={artwork.imageUrl}
                  title={artwork.title}
                  onClick={() => onArtworkClick(artwork.id)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { GalleryActivitySection };
