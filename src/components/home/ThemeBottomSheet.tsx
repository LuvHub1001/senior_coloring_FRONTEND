import { ThemeItem } from "@/components/home/ThemeItem";

interface Theme {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isLocked: boolean;
}

interface ThemeBottomSheetProps {
  isOpen: boolean;
  selectedThemeId: number;
  themes: Theme[];
  onClose: () => void;
  onSelectTheme: (themeId: number) => void;
}

function ThemeBottomSheet({
  isOpen,
  selectedThemeId,
  themes,
  onClose,
  onSelectTheme,
}: ThemeBottomSheetProps) {
  if (!isOpen) return null;

  const availableThemes = themes.filter((t) => !t.isLocked);
  const lockedThemes = themes.filter((t) => t.isLocked);

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        role="presentation"
      />

      {/* 바텀시트 */}
      <div className="relative w-full h-[70vh] bg-white rounded-t-3xl overflow-y-auto">
        {/* 닫기 버튼 */}
        <div className="flex items-center justify-end px-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="size-8 flex items-center justify-center cursor-pointer"
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

        {/* 타이틀 */}
        <div className="px-5 pb-6">
          <h2 className="text-[24px] font-[700] text-[#191F28] tracking-[-0.12px] leading-[33px]">
            전시관 테마 선택
          </h2>
        </div>

        {/* 테마 목록 */}
        <div className="flex flex-col gap-10 px-5 pb-10">
          {/* 사용 가능한 테마 */}
          {availableThemes.map((theme) => (
            <ThemeItem
              key={theme.id}
              name={theme.name}
              description={theme.description}
              imageUrl={theme.imageUrl}
              isSelected={selectedThemeId === theme.id}
              onSelect={() => onSelectTheme(theme.id)}
            />
          ))}

          {/* 잠긴 테마 섹션 */}
          {lockedThemes.length > 0 && (
            <div className="flex flex-col gap-4 rounded-[20px] border border-[#E5E8EB] bg-[rgba(0,23,51,0.02)] p-4">
              {/* 잠금 안내 */}
              <div className="flex flex-col items-center gap-2 px-1 py-2">
                <div className="flex items-center gap-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="9"
                      width="12"
                      height="9"
                      rx="2"
                      stroke="#4E5968"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 9V6a3 3 0 0 1 6 0v3"
                      stroke="#4E5968"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[17px] font-[500] text-[#4E5968] tracking-[-0.085px] leading-[25.5px]">
                    잠금
                  </span>
                </div>
                <p className="text-[17px] font-normal text-[#4E5968] tracking-[-0.085px] leading-[25.5px] text-center">
                  작품을 만들면 새로운 전시관이 오픈돼요
                </p>
              </div>

              {/* 잠긴 테마 아이템들 */}
              {lockedThemes.map((theme) => (
                <ThemeItem
                  key={theme.id}
                  name={theme.name}
                  description={theme.description}
                  imageUrl={theme.imageUrl}
                  isLocked
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { ThemeBottomSheet };
