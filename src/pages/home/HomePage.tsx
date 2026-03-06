import {
  HomeNavBar,
  HomeTitle,
  EmptyArtworkFrame,
  CreateArtworkButton,
  ThemeBottomSheet,
  WelcomeOverlay,
} from "@/components";
import { useHomePage } from "@/hooks";

function HomePage() {
  const {
    userName,
    showWelcome,
    activeTab,
    isThemeSheetOpen,
    selectedThemeId,
    themes,
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
        themes={themes}
        onClose={handleThemeClose}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  );
}

export { HomePage };
