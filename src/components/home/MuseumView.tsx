import defaultFrameImage from "@images/home/frame.png";
import { useImageCarousel } from "@/hooks/useImageCarousel";

interface ArtworkThumbnail {
  id: string;
  imageUrl: string | null;
}

interface MuseumViewProps {
  userName: string;
  artworkCount: number;
  themeImageUrl: string;
  featuredImageUrl: string;
  featuredArtworkId: string;
  artworks: ArtworkThumbnail[];
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
  frameImageUrl: string | null;
  onCreateArtwork: () => void;
  onFeatureArtwork: (artworkId: string) => void;
}

function MuseumView({
  userName,
  artworkCount,
  themeImageUrl,
  featuredImageUrl,
  featuredArtworkId,
  artworks,
  buttonColor,
  buttonTextColor,
  textColor,
  frameImageUrl,
  onCreateArtwork,
  onFeatureArtwork,
}: MuseumViewProps) {
  const frameImage = frameImageUrl ?? defaultFrameImage;
  const { containerRef, repeatCount } = useImageCarousel(artworks.length, 0.3);

  return (
    <div
      className="flex min-h-dvh flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${themeImageUrl})` }}
    >
      {/* 타이틀 섹션 (NavBar 높이만큼 상단 여백) */}
      <div className="flex flex-col items-center gap-2 px-6 pb-4 pt-25">
        <h1
          className="text-center text-[26px] font-bold tracking-[-0.13px] leading-[35px]"
          style={{ color: textColor }}
        >
          {userName}님의 미술관
        </h1>
        <div className="flex items-center gap-1">
          <span
            className="text-[15px] font-medium tracking-[-0.075px] leading-[22.5px]"
            style={{ color: textColor }}
          >
            작품수
          </span>
          <span
            className="text-[15px] font-bold tracking-[-0.075px] leading-[22.5px]"
            style={{ color: textColor }}
          >
            {artworkCount}
          </span>
        </div>
      </div>

      {/* 액자 속 작품 */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-[320px] aspect-[823/951]">
          {/* 액자 프레임 */}
          <img
            src={frameImage}
            alt="액자"
            className="absolute inset-0 z-10 size-full object-contain pointer-events-none"
          />
          {/* 작품 이미지 (프레임 내부 회색 영역 위에 배치) */}
          <div
            className="absolute z-20 overflow-hidden rounded-[4px]"
            style={{ left: "22%", top: "19.4%", width: "55.9%", height: "60.5%" }}
          >
            <img
              src={featuredImageUrl}
              alt="전시된 작품"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 작품 캐러셀 */}
      {artworks.length > 1 && (
        <div className="overflow-hidden px-5 py-3">
          <div ref={containerRef} className="flex gap-3 will-change-transform">
            {Array.from({ length: repeatCount }, (_, setIndex) =>
              artworks.map((artwork) => (
                <button
                  key={`${setIndex}-${artwork.id}`}
                  type="button"
                  onClick={() => onFeatureArtwork(artwork.id)}
                  className={`size-[68px] shrink-0 overflow-hidden rounded-[13px] border-2 cursor-pointer ${
                    artwork.id === featuredArtworkId
                      ? "border-white"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={artwork.imageUrl ?? ""}
                    alt="작품 썸네일"
                    className="size-full object-cover rounded-[11px]"
                  />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="w-full shrink-0">
        <div className="h-9" />
        <div className="px-5">
          <button
            type="button"
            onClick={onCreateArtwork}
            className="flex h-14 w-full items-center justify-center rounded-2xl cursor-pointer"
            style={{ backgroundColor: buttonColor }}
          >
            <span
              className="text-[19px] font-bold tracking-[-0.095px] leading-[28px]"
              style={{ color: buttonTextColor }}
            >
              작품 만들기
            </span>
          </button>
        </div>
        <div className="h-[34px]" />
      </div>
    </div>
  );
}

export { MuseumView };
