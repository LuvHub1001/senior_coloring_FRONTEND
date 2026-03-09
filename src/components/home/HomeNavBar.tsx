interface HomeNavBarProps {
  activeTab: "museum" | "gallery";
  toggleType?: "LIGHT" | "DARK";
  onTabChange: (tab: "museum" | "gallery") => void;
  onThemeClick: () => void;
}

function HomeNavBar({ activeTab, toggleType = "LIGHT", onTabChange, onThemeClick }: HomeNavBarProps) {
  const isDark = toggleType === "DARK";

  // DARK 테마: 반투명 흰색 배경 + 어두운 인디케이터
  // LIGHT 테마: 반투명 어두운 배경 + 흰색 인디케이터
  const trackBg = isDark
    ? "bg-[rgba(255,255,255,0.15)]"
    : "bg-[rgba(2,32,71,0.05)]";
  const indicatorBg = isDark
    ? "bg-[rgba(255,255,255,0.25)] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]"
    : "bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]";
  const activeTextColor = isDark ? "text-white" : "text-[#191F28]";
  const inactiveTextColor = isDark ? "text-[rgba(255,255,255,0.6)]" : "text-[#4E5968]";
  const iconColor = isDark ? "#FFFFFF" : "#191F28";
  const themeBtnBg = isDark
    ? "bg-[rgba(255,255,255,0.15)]"
    : "bg-[rgba(2,32,71,0.05)]";

  return (
    <nav className="flex h-[64px] items-center justify-center px-4">
      {/* 왼쪽 여백 (팔레트 아이콘 자리 - 현재 투명 처리) */}
      <div className="size-9 shrink-0" />

      {/* 탭 토글 */}
      <div className="flex flex-1 items-center justify-center">
        <div className={`relative flex overflow-hidden rounded-full p-1 ${trackBg}`}>
          {/* 슬라이딩 인디케이터 */}
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-in-out ${indicatorBg}`}
            style={{
              transform:
                activeTab === "gallery" ? "translateX(100%)" : "translateX(0)",
            }}
          />

          {/* 버튼 레이어 */}
          <button
            type="button"
            onClick={() => onTabChange("museum")}
            className={`relative z-10 h-10 rounded-full px-5 text-[15px] tracking-[-0.075px] leading-[22.5px] cursor-pointer transition-colors duration-300 ease-in-out ${
              activeTab === "museum"
                ? `font-bold ${activeTextColor}`
                : `font-medium ${inactiveTextColor}`
            }`}
          >
            미술관
          </button>
          <button
            type="button"
            onClick={() => onTabChange("gallery")}
            className={`relative z-10 h-10 rounded-full px-5 text-[15px] tracking-[-0.075px] leading-[22.5px] cursor-pointer transition-colors duration-300 ease-in-out ${
              activeTab === "gallery"
                ? `font-bold ${activeTextColor}`
                : `font-medium ${inactiveTextColor}`
            }`}
          >
            갤러리
          </button>
        </div>
      </div>

      {/* 배경 변경 버튼 */}
      <button
        type="button"
        onClick={onThemeClick}
        className={`flex size-9 shrink-0 items-center justify-center rounded-full cursor-pointer ${themeBtnBg}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"
            stroke={iconColor}
            strokeWidth="1.2"
          />
          <path
            d="M2 10.5l3.3-3.3a1 1 0 0 1 1.4 0L10 10.5"
            stroke={iconColor}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M9 9.5l1.3-1.3a1 1 0 0 1 1.4 0L14 10.5"
            stroke={iconColor}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="10.5" cy="5.5" r="1" fill={iconColor} />
        </svg>
      </button>
    </nav>
  );
}

export { HomeNavBar };
