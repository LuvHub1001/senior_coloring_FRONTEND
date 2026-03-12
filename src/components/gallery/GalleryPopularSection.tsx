import { GalleryPopularCard } from "@/components/gallery/GalleryPopularCard";

interface PopularArtwork {
  id: string;
  imageUrl: string;
  title: string;
  authorName: string;
  timeAgo: string;
  likeCount: number;
  isLiked: boolean;
}

interface GalleryPopularSectionProps {
  artworks: PopularArtwork[];
  onArtworkClick: (artworkId: string) => void;
  onSeeAll: () => void;
}

function GalleryPopularSection({
  artworks,
  onArtworkClick,
  onSeeAll,
}: GalleryPopularSectionProps) {
  return (
    <div className="flex flex-col gap-[16px] pb-[32px] pl-[20px] pt-[20px]">
      {/* 섹션 제목 */}
      <button
        type="button"
        onClick={onSeeAll}
        className="flex items-center gap-[4px] cursor-pointer w-fit"
      >
        <span className="text-[19px] font-[700] leading-[28px] tracking-[-0.095px] text-[#0A0A0A]">
          오늘의 인기 작품
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

      {/* 가로 스크롤 카드 리스트 */}
      <div className="flex gap-[16px] overflow-x-auto scrollbar-hide pr-[20px]">
        {artworks.map((artwork) => (
          <GalleryPopularCard
            key={artwork.id}
            imageUrl={artwork.imageUrl}
            title={artwork.title}
            authorName={artwork.authorName}
            timeAgo={artwork.timeAgo}
            likeCount={artwork.likeCount}
            isLiked={artwork.isLiked}
            onClick={() => onArtworkClick(artwork.id)}
          />
        ))}
      </div>
    </div>
  );
}

export { GalleryPopularSection };
