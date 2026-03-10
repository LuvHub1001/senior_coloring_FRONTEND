import type { Design } from "@/types";

interface DesignDetailModalProps {
  design: Design;
  isLoading: boolean;
  onClose: () => void;
  onStartColoring: () => void;
}

function DesignDetailModal({
  design,
  isLoading,
  onClose,
  onStartColoring,
}: DesignDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      {/* 딤 배경 */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* 모달 카드 */}
      <div className="relative z-10 w-full max-w-[335px] rounded-[20px] bg-white p-5">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[#191F28] border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* 도안 이미지 */}
            <div className="relative h-[170px] w-full overflow-hidden rounded-[16px] bg-[#F8F8F8]">
              <img
                src={design.originalImageUrl ?? design.imageUrl}
                alt={design.title}
                className="size-full object-contain"
              />
              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* 텍스트 영역 */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[22px] font-bold leading-[31px] text-[#0F172A]">
                {design.title}
              </h3>
              {design.description && (
                <p className="text-[17px] font-normal leading-[25.5px] text-[#374151]">
                  {design.description}
                </p>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex h-12 flex-1 items-center justify-center rounded-[12px] bg-[#F2F4F6]"
              >
                <span className="text-[17px] font-semibold leading-[25.5px] text-[#4E5968]">
                  닫기
                </span>
              </button>
              <button
                type="button"
                onClick={onStartColoring}
                className="flex h-12 flex-1 items-center justify-center rounded-[12px] bg-[#191F28]"
              >
                <span className="text-[17px] font-semibold leading-[25.5px] text-white">
                  시작하기
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { DesignDetailModal };
