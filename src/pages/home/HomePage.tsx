import {
  HomeNavBar,
  HomeTitle,
  EmptyArtworkFrame,
  CreateArtworkButton,
  ThemeBottomSheet,
  WelcomeOverlay,
  MuseumView,
} from "@/components";
import { useHomePage } from "@/hooks";

function HomePage() {
  const {
    userName,
    showWelcome,
    activeTab,
    isThemeSheetOpen,
    selectedThemeId,
    selectedThemeImageUrl,
    buttonColor,
    buttonTextColor,
    themes,
    completedArtworks,
    featuredArtwork,
    handleTabChange,
    handleThemeClick,
    handleThemeClose,
    handleSelectTheme,
    handleCreateArtwork,
    handleWelcomeDismiss,
    handleFeatureArtwork,
  } = useHomePage();

  if (showWelcome) {
    return (
      <WelcomeOverlay
        userName={userName}
        onDismiss={handleWelcomeDismiss}
      />
    );
  }

  const hasArtworks = completedArtworks.length > 0;

  return (
    <>
      {hasArtworks ? (
        <div className="relative min-h-dvh">
          {/* 미술관 뷰 (테마 배경 + 작품) */}
          <MuseumView
            userName={userName}
            artworkCount={completedArtworks.length}
            themeImageUrl={selectedThemeImageUrl}
            featuredImageUrl={featuredArtwork?.imageUrl ?? ""}
            featuredArtworkId={featuredArtwork?.id ?? ""}
            artworks={completedArtworks}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            onCreateArtwork={handleCreateArtwork}
            onFeatureArtwork={handleFeatureArtwork}
          />

          {/* 네비게이션 (미술관 위에 오버레이) */}
          <div className="absolute top-0 left-0 w-full z-10">
            <HomeNavBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onThemeClick={handleThemeClick}
            />
          </div>
        </div>
      ) : (
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

          {/* 빈 액자 */}
          <EmptyArtworkFrame onClick={handleCreateArtwork} />

          {/* 하단 버튼 */}
          <CreateArtworkButton onClick={handleCreateArtwork} />
        </div>
      )}

      {/* 전시관 테마 선택 바텀시트 */}
      <ThemeBottomSheet
        isOpen={isThemeSheetOpen}
        selectedThemeId={selectedThemeId}
        themes={themes}
        onClose={handleThemeClose}
        onSelectTheme={handleSelectTheme}
      />
    </>
  );
}

export { HomePage };
