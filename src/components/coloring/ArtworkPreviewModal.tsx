import type { Artwork } from "@/types";

interface ArtworkPreviewModalProps {
  artwork: Artwork;
  isMoreMenuOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onExhibit: () => void;
  onToggleMoreMenu: () => void;
  onShare: () => void;
  onDelete: () => void;
}

function ArtworkPreviewModal({
  artwork,
  isMoreMenuOpen,
  onClose,
  onContinue,
  onExhibit,
  onToggleMoreMenu,
  onShare,
  onDelete,
}: ArtworkPreviewModalProps) {
  const imageUrl = artwork.imageUrl ?? artwork.design.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 딤 배경 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 카드 */}
      <div className="relative z-10 w-[335px] overflow-hidden rounded-3xl border border-[#EEE] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
        {/* 작품 이미지 */}
        <div className="relative aspect-square w-full">
          <img
            src={imageUrl}
            alt={artwork.design.title}
            className="size-full rounded-sm object-cover"
          />

          {/* 상단 버튼 영역 */}
          <div className="absolute right-[3px] top-[3px] flex items-start justify-end">
            {/* 더보기 */}
            <div className="relative">
              <button
                type="button"
                onClick={onToggleMoreMenu}
                className="flex size-12 items-center justify-center rounded-full bg-white/60"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5" r="1.5" fill="#191F28" />
                  <circle cx="12" cy="12" r="1.5" fill="#191F28" />
                  <circle cx="12" cy="19" r="1.5" fill="#191F28" />
                </svg>
              </button>

              {/* 더보기 드롭다운 */}
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-[52px] w-[140px] overflow-hidden rounded-xl bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.16)]">
                  <button
                    type="button"
                    onClick={onShare}
                    className="flex h-12 w-full items-center gap-2 px-4"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="3"
                        r="2"
                        stroke="#191F28"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="4"
                        cy="8"
                        r="2"
                        stroke="#191F28"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="12"
                        cy="13"
                        r="2"
                        stroke="#191F28"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M5.8 7L10.2 4M5.8 9L10.2 12"
                        stroke="#191F28"
                        strokeWidth="1.2"
                      />
                    </svg>
                    <span className="text-[15px] font-medium leading-[22.5px] tracking-[-0.075px] text-[#191F28]">
                      공유하기
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="flex h-12 w-full items-center gap-2 px-4"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M2 4H14M5.33 4V2.67C5.33 2.3 5.63 2 6 2H10C10.37 2 10.67 2.3 10.67 2.67V4M3.33 4L4 13.33C4 13.7 4.3 14 4.67 14H11.33C11.7 14 12 13.7 12 13.33L12.67 4M6.67 7.33V11.33M9.33 7.33V11.33"
                        stroke="#191F28"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[15px] font-medium leading-[22.5px] tracking-[-0.075px] text-[#191F28]">
                      삭제하기
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onExhibit}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[rgba(2,32,71,0.05)]"
          >
            <span className="text-[17px] font-semibold leading-[25.5px] tracking-[-0.085px] text-[#4E5968]">
              전시하기
            </span>
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#191F28]"
          >
            <span className="text-[17px] font-semibold leading-[25.5px] tracking-[-0.085px] text-white">
              이어 그리기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { ArtworkPreviewModal };
