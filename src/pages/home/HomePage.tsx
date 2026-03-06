import {
  HomeNavBar,
  HomeTitle,
  EmptyArtworkFrame,
  CreateArtworkButton,
  ThemeBottomSheet,
  WelcomeOverlay,
} from "@/components";
import { useHomePage } from "@/hooks";

/* 테마 데이터 (추후 API 연동 시 hooks로 이동) */
const THEMES = [
  {
    id: "white",
    name: "화이트 홀",
    description: "사용 가능",
    gradient: "linear-gradient(135deg, #FFFFFF 0%, #E5E5E5 100%)",
    isLocked: false,
  },
  {
    id: "opera",
    name: "오페라 홀",
    description: "작품 1개 완성하기",
    gradient: "linear-gradient(135deg, #590A0B 0%, #8B1A1D 100%)",
    isLocked: true,
  },
  {
    id: "emerald",
    name: "에메랄드크 홀",
    description: "작품 10개 완성하기",
    gradient: "linear-gradient(135deg, #064E3B 0%, #10B981 100%)",
    isLocked: true,
  },
  {
    id: "gold",
    name: "골드 홀",
    description: "작품 20개 완성하기",
    gradient: "linear-gradient(135deg, #78350F 0%, #F59E0B 100%)",
    isLocked: true,
  },
];

function HomePage() {
  const {
    userName,
    showWelcome,
    activeTab,
    isThemeSheetOpen,
    selectedThemeId,
    handleTabChange,
    handleThemeClick,
    handleThemeClose,
    handleSelectTheme,
    handleCreateArtwork,
    handleWelcomeDismiss,
  } = useHomePage();

  if (showWelcome) {
    return (
      <WelcomeOverlay
        userName={userName}
        onDismiss={handleWelcomeDismiss}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#F9FAFB] relative">
      {/* 네비게이션 */}
      <HomeNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onThemeClick={handleThemeClick}
      />

      {/* 타이틀 */}
      <HomeTitle
        userName={userName}
        subtitle="그림을 그려서 내 미술관에 전시해요"
      />

      {/* 빈 액자 (첫 진입 유저) */}
      <EmptyArtworkFrame onClick={handleCreateArtwork} />

      {/* 하단 버튼 */}
      <CreateArtworkButton onClick={handleCreateArtwork} />

      {/* 전시관 테마 선택 바텀시트 */}
      <ThemeBottomSheet
        isOpen={isThemeSheetOpen}
        selectedThemeId={selectedThemeId}
        themes={THEMES}
        onClose={handleThemeClose}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  );
}

export { HomePage };
