interface HomeNavBarProps {
  activeTab: "museum" | "gallery";
  toggleType?: "LIGHT" | "DARK";
  onTabChange: (tab: "museum" | "gallery") => void;
  onThemeClick: () => void;
}

function HomeNavBar({ activeTab, toggleType = "LIGHT", onTabChange, onThemeClick }: HomeNavBarProps) {
  const isDark = toggleType === "DARK";

  // DARK/LIGHT 공통: 흰색 인디케이터 + 다크 텍스트
  // 트랙/버튼 배경만 테마에 따라 변경
  const trackBg = isDark
    ? "bg-[rgba(0,25,54,0.31)]"
    : "bg-[rgba(2,32,71,0.05)]";
  const indicatorBg =
    "bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]";
  const activeTextColor = "text-[#191F28]";
  const inactiveTextColor = isDark ? "text-white" : "text-[#4E5968]";
  const iconColor = isDark ? "#FFFFFF" : "#191F28";
  const themeBtnBg = isDark
    ? "bg-[rgba(0,25,54,0.31)]"
    : "bg-[rgba(2,32,71,0.05)]";

  return (
    <nav className="flex h-[64px] items-center justify-center px-[16px]">
      {/* 왼쪽 여백 (팔레트 아이콘 자리 - 현재 투명 처리) */}
      <div className="size-[36px] shrink-0" />

      {/* 탭 토글 */}
      <div className="flex flex-1 items-center justify-center">
        <div className={`relative flex overflow-hidden rounded-full p-[4px] ${trackBg}`}>
          {/* 슬라이딩 인디케이터 */}
          <div
            className={`absolute top-[4px] bottom-[4px] left-[4px] w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-in-out ${indicatorBg}`}
            style={{
              transform:
                activeTab === "gallery" ? "translateX(100%)" : "translateX(0)",
            }}
          />

          {/* 버튼 레이어 */}
          <button
            type="button"
            onClick={() => onTabChange("museum")}
            className={`relative z-10 h-[40px] rounded-full px-[20px] text-[15px] tracking-[-0.075px] leading-[22.5px] cursor-pointer transition-colors duration-300 ease-in-out ${
              activeTab === "museum"
                ? `font-[700] ${activeTextColor}`
                : `font-[500] ${inactiveTextColor}`
            }`}
          >
            미술관
          </button>
          <button
            type="button"
            onClick={() => onTabChange("gallery")}
            className={`relative z-10 h-[40px] rounded-full px-[20px] text-[15px] tracking-[-0.075px] leading-[22.5px] cursor-pointer transition-colors duration-300 ease-in-out ${
              activeTab === "gallery"
                ? `font-[700] ${activeTextColor}`
                : `font-[500] ${inactiveTextColor}`
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
        className={`flex size-[36px] shrink-0 items-center justify-center rounded-full cursor-pointer ${themeBtnBg}`}
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
