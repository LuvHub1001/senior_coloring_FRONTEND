import { GalleryPopularSection } from "@/components/gallery/GalleryPopularSection";
import { GalleryActivitySection } from "@/components/gallery/GalleryActivitySection";

interface GalleryArtwork {
  id: string;
  imageUrl: string;
  title: string;
  authorName: string;
  timeAgo: string;
  likeCount: number;
  isLiked: boolean;
}

interface GalleryViewProps {
  popularArtworks: GalleryArtwork[];
  activityArtworks: GalleryArtwork[];
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  onArtworkClick: (artworkId: string) => void;
  onLikeToggle: (artworkId: string) => void;
  onSeeAllPopular: () => void;
  onSeeAllActivity: () => void;
}

function GalleryView({
  popularArtworks,
  activityArtworks,
  viewMode,
  onViewModeChange,
  onArtworkClick,
  onLikeToggle,
  onSeeAllPopular,
  onSeeAllActivity,
}: GalleryViewProps) {
  return (
    <div className="flex flex-col min-h-dvh bg-[#F3F5F7]">
      {/* NavBar 높이만큼 상단 여백 (64px + safe area) */}
      <div className="h-[64px] shrink-0" />

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        {/* 오늘의 인기 작품 */}
        <GalleryPopularSection
          artworks={popularArtworks}
          onArtworkClick={onArtworkClick}
          onSeeAll={onSeeAllPopular}
        />

        {/* 활동 모아보기 */}
        <GalleryActivitySection
          artworks={activityArtworks}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onArtworkClick={onArtworkClick}
          onLikeToggle={onLikeToggle}
          onSeeAll={onSeeAllActivity}
        />
      </div>
    </div>
  );
}

export { GalleryView };
