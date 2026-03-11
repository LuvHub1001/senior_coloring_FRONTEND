
interface ArtworkThumbnail {
  id: string;
  imageUrl: string | null;
}

interface MuseumViewProps {
  userName: string;
  artworkCount: number;
  reactionCount: number;
  themeImageUrl: string;
  featuredImageUrl: string;
  featuredArtworkId: string;
  artworks: ArtworkThumbnail[];
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
  frameImageUrl: string;
  onCreateArtwork: () => void;
  onFeatureArtwork: (artworkId: string) => void;
  onArtworkClick: () => void;
}

function MuseumView({
  userName,
  artworkCount,
  reactionCount,
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
  onArtworkClick,
}: MuseumViewProps) {
  const frameImage = frameImageUrl;

  return (
    <div
      className="flex min-h-dvh flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${themeImageUrl})` }}
    >
      {/* 타이틀 섹션 (NavBar 높이만큼 상단 여백) */}
      <div className="flex flex-col items-center gap-[8px] px-[24px] pb-[16px] pt-[108px]">
        <h1
          className="text-center text-[26px] font-[700] tracking-[-0.13px] leading-[35px]"
          style={{ color: textColor }}
        >
          {userName}님의 미술관
        </h1>
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center gap-[4px]">
            <span
              className="text-[15px] font-[500] tracking-[-0.075px] leading-[22.5px]"
              style={{ color: textColor }}
            >
              작품수
            </span>
            <span
              className="text-[15px] font-[700] tracking-[-0.075px] leading-[22.5px]"
              style={{ color: textColor }}
            >
              {artworkCount}
            </span>
          </div>
          <div
            className="h-[12px] w-px"
            style={{ backgroundColor: `${textColor}77` }}
          />
          <div className="flex items-center gap-[4px]">
            <span
              className="text-[15px] font-[500] tracking-[-0.075px] leading-[22.5px]"
              style={{ color: textColor }}
            >
              반응
            </span>
            <span
              className="text-[15px] font-[700] tracking-[-0.075px] leading-[22.5px]"
              style={{ color: textColor }}
            >
              {reactionCount}
            </span>
          </div>
        </div>
      </div>

      {/* 액자 속 작품 */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-[320px] h-[384px]">
          {/* 액자 프레임 */}
          <img
            src={frameImage}
            alt="액자"
            className="absolute inset-0 w-[320px] h-[384px] pointer-events-none"
          />
          {/* 작품 이미지 (SVG 내부 영역에 맞춤) */}
          <button
            type="button"
            onClick={onArtworkClick}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden rounded-[4px] cursor-pointer"
            style={{ width: "179px", height: "232px" }}
          >
            <img
              src={featuredImageUrl}
              alt="전시된 작품"
              className="size-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* 작품 썸네일 목록 */}
      {artworks.length > 0 && (
        <div className="overflow-x-auto scrollbar-hide p-[20px]">
          <div className="flex gap-[16px]">
            {artworks.map((artwork) => (
              <button
                key={artwork.id}
                type="button"
                onClick={() => onFeatureArtwork(artwork.id)}
                className="shrink-0 rounded-[13.161px] cursor-pointer border-[2px] border-solid"
                style={{
                  borderColor:
                    artwork.id === featuredArtworkId
                      ? textColor
                      : "transparent",
                }}
              >
                <img
                  src={artwork.imageUrl ?? ""}
                  alt="작품 썸네일"
                  className="m-[4.25px] size-[60px] object-cover rounded-[8px]"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="w-full shrink-0">
        <div className="h-[36px]" />
        <div className="px-[20px]">
          <button
            type="button"
            onClick={onCreateArtwork}
            className="flex h-[56px] w-full items-center justify-center rounded-[16px] cursor-pointer"
            style={{ backgroundColor: buttonColor }}
          >
            <span
              className="text-[19px] font-[700] tracking-[-0.095px] leading-[28px]"
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
