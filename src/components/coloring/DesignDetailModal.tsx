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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 딤 배경 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 카드 */}
      <div className="relative z-10 w-[335px] overflow-hidden rounded-3xl border border-[#EEE] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[#191F28] border-t-transparent" />
          </div>
        ) : (
          <>
            {/* 원본 컬러 이미지 */}
            <div className="relative aspect-square w-full">
              <img
                src={design.originalImageUrl ?? design.imageUrl}
                alt={design.title}
                className="size-full object-cover"
              />

              {/* 닫기 버튼 */}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/60"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 2l12 12M14 2L2 14"
                    stroke="#191F28"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* 하단 정보 영역 */}
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[19px] font-bold leading-[28px] tracking-[-0.095px] text-[#191F28]">
                  {design.title}
                </h3>
                {design.description && (
                  <p className="text-[15px] font-normal leading-[22.5px] tracking-[-0.075px] text-[#4E5968]">
                    {design.description}
                  </p>
                )}
              </div>

              {/* 색칠하기 버튼 */}
              <button
                type="button"
                onClick={onStartColoring}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#191F28]"
              >
                <span className="text-[17px] font-semibold leading-[25.5px] tracking-[-0.085px] text-white">
                  색칠하기
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { DesignDetailModal };
