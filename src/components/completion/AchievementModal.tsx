interface AchievementModalProps {
  isOpen: boolean;
  imageUrl: string;
  badge: string;
  title: string;
  description: string;
  onClose: () => void;
}

function AchievementModal({
  isOpen,
  imageUrl,
  badge,
  title,
  description,
  onClose,
}: AchievementModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 모달 카드 */}
      <div
        className="relative z-10 flex w-[295px] flex-col items-center rounded-3xl bg-white py-8 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 업적 이미지 */}
        <div className="size-[120px] overflow-hidden rounded-2xl">
          <img
            src={imageUrl}
            alt={title}
            className="size-full object-cover"
          />
        </div>

        {/* 정보 */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            {/* 배지 */}
            <div className="rounded-full bg-[#F2F4F6] px-2 py-1">
              <span className="text-[17px] font-medium text-[#191F28] tracking-[-0.085px] leading-[25.5px]">
                {badge}
              </span>
            </div>

            {/* 제목 */}
            <h3 className="text-[24px] font-bold text-[#1E2939] tracking-[-0.12px] leading-[33px]">
              {title}
            </h3>
          </div>

          {/* 설명 */}
          <div className="text-center text-[17px] text-[#191F28] tracking-[-0.085px] leading-[25.5px]">
            {description.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { AchievementModal };
