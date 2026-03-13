import closeIcon from "@images/coloring/close.svg";
import menuMoreIcon from "@images/coloring/menu-more.svg";
import type { Artwork } from "@/types";

interface ArtworkPreviewModalProps {
  artwork: Artwork;
  isMoreMenuOpen: boolean;
  isDeleteConfirmOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onExhibit: () => void;
  onToggleMoreMenu: () => void;
  onShare: () => void;
  onDelete: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

function ArtworkPreviewModal({
  artwork,
  isMoreMenuOpen,
  isDeleteConfirmOpen,
  onClose,
  onContinue,
  onExhibit,
  onToggleMoreMenu,
  onShare,
  onDelete,
  onDeleteConfirm,
  onDeleteCancel,
}: ArtworkPreviewModalProps) {
  const imageUrl = artwork.imageUrl ?? artwork.design.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isDeleteConfirmOpen ? onDeleteCancel : onClose}
      />

      {/* 모달 카드 */}
      <div className="relative z-10 w-[335px] rounded-[24px] border border-[#EEE] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
        {/* 작품 이미지 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-sm">
          <img
            src={imageUrl}
            alt={artwork.design.title}
            className="size-full object-cover"
          />
        </div>

        {/* 닫기 + 더보기 버튼 — 이미지 위 오버레이 */}
        <div className="absolute left-[23px] top-[23px] flex w-[287px] items-start justify-between">
          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-[2px]"
          >
            <img src={closeIcon} alt="닫기" className="h-6 w-6" />
          </button>

          {/* 더보기 버튼 + 드롭다운 */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMoreMenu}
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-[2px]"
            >
              <img src={menuMoreIcon} alt="더보기" className="h-6 w-6" />
            </button>

            {/* 더보기 드롭다운 */}
            {isMoreMenuOpen && !isDeleteConfirmOpen && (
              <div className="absolute right-0 top-[52px] w-[140px] overflow-hidden rounded-xl bg-white/90 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.16)] backdrop-blur-md">
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

            {/* 삭제 확인 드롭다운 */}
            {isDeleteConfirmOpen && (
              <div className="absolute right-0 top-[52px] w-[193px] overflow-hidden rounded-[12px] bg-white/90 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.16)] backdrop-blur-md">
                <div className="flex h-12 items-center px-4">
                  <p className="flex-1 text-[15px] font-medium leading-[22.5px] tracking-[-0.075px] text-[#191F28]">
                    영구 삭제하시겠습니까?
                  </p>
                </div>
                <div className="h-px bg-[#E5E8EB]" />
                <div className="flex">
                  <button
                    type="button"
                    onClick={onDeleteCancel}
                    className="flex h-12 flex-1 items-center justify-center"
                  >
                    <span className="text-[15px] font-medium leading-[22.5px] tracking-[-0.075px] text-[#6B7684]">
                      취소
                    </span>
                  </button>
                  <div className="w-px self-stretch bg-[#E5E8EB]" />
                  <button
                    type="button"
                    onClick={onDeleteConfirm}
                    className="flex h-12 flex-1 items-center justify-center"
                  >
                    <span className="text-[15px] font-medium leading-[22.5px] tracking-[-0.075px] text-[#191F28]">
                      삭제
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onExhibit}
            className="flex h-12 min-w-[80px] flex-1 items-center justify-center rounded-xl bg-[rgba(2,32,71,0.05)] px-[25px]"
          >
            <span className="text-[17px] font-semibold leading-[25.5px] tracking-[-0.085px] text-[#4E5968]">
              전시하기
            </span>
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex h-12 min-w-[80px] flex-1 items-center justify-center rounded-xl bg-[#191F28] px-[25px]"
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
