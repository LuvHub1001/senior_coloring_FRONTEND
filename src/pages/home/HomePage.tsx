import {
  HomeNavBar,
  HomeTitle,
  EmptyArtworkFrame,
  CreateArtworkButton,
  ThemeBottomSheet,
  WelcomeOverlay,
  MuseumView,
  ArtworkDetailOverlay,
  DeleteConfirmModal,
  ShareToast,
  GalleryView,
  GalleryDetailOverlay,
} from "@/components";
import { useHomePage, useArtworkDetail, useGallery } from "@/hooks";

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
    textColor,
    toggleType,
    frameImageUrl,
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

  const {
    isDetailOpen,
    isMenuOpen,
    isDeleteConfirmOpen,
    selectedArtwork,
    dateLabel,
    handleOpenDetail,
    handleCloseDetail,
    handleMenuToggle,
    handleEdit,
    handleShare,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    isShareToastVisible,
    shareToastMessage,
  } = useArtworkDetail(frameImageUrl);

  const {
    viewMode,
    selectedArtworkId: gallerySelectedId,
    popularArtworks,
    activityArtworks,
    selectedDetail: galleryDetail,
    handleViewModeChange,
    handleArtworkClick,
    handleLikeToggle,
    handleDetailLikeToggle,
    handleCloseDetail: handleGalleryDetailClose,
    handleLoadMore,
  } = useGallery(activeTab === "gallery");

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
      <div className="relative min-h-dvh">
        {/* 네비게이션 (항상 동일 인스턴스 유지 — 토글 트랜지션 보장) */}
        <div className="absolute top-0 left-0 w-full z-10">
          <HomeNavBar
            activeTab={activeTab}
            toggleType={activeTab === "gallery" ? "LIGHT" : toggleType}
            onTabChange={handleTabChange}
            onThemeClick={handleThemeClick}
          />
        </div>

        {/* 콘텐츠 영역 */}
        {activeTab === "gallery" ? (
          <GalleryView
            popularArtworks={popularArtworks}
            activityArtworks={activityArtworks}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onArtworkClick={handleArtworkClick}
            onLikeToggle={handleLikeToggle}
            onSeeAllPopular={() => {}}
            onSeeAllActivity={() => {}}
            onLoadMore={handleLoadMore}
          />
        ) : hasArtworks ? (
          <MuseumView
            userName={userName}
            artworkCount={completedArtworks.length}
            reactionCount={0}
            themeImageUrl={selectedThemeImageUrl}
            featuredImageUrl={featuredArtwork?.imageUrl ?? ""}
            featuredArtworkId={featuredArtwork?.id ?? ""}
            artworks={completedArtworks}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            textColor={textColor}
            frameImageUrl={frameImageUrl}
            onCreateArtwork={handleCreateArtwork}
            onFeatureArtwork={handleFeatureArtwork}
            onArtworkClick={() => {
              if (featuredArtwork) handleOpenDetail(featuredArtwork);
            }}
          />
        ) : (
          <div
            className="flex flex-col min-h-dvh bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${selectedThemeImageUrl})` }}
          >
            {/* NavBar 높이만큼 여백 */}
            <div className="h-[64px] shrink-0" />

            <HomeTitle
              userName={userName}
              subtitle="그림을 그려서 내 미술관에 전시해요"
              textColor={textColor}
            />

            <EmptyArtworkFrame frameImageUrl={frameImageUrl} onClick={handleCreateArtwork} />

            <CreateArtworkButton
              onClick={handleCreateArtwork}
              buttonColor={buttonColor}
              buttonTextColor={buttonTextColor}
            />
          </div>
        )}
      </div>

      {/* 전시관 테마 선택 바텀시트 */}
      <ThemeBottomSheet
        isOpen={isThemeSheetOpen}
        selectedThemeId={selectedThemeId}
        themes={themes}
        onClose={handleThemeClose}
        onSelectTheme={handleSelectTheme}
      />

      {/* 작품 상세 오버레이 */}
      {isDetailOpen && selectedArtwork && (
        <ArtworkDetailOverlay
          title={selectedArtwork.design.title}
          imageUrl={selectedArtwork.imageUrl ?? ""}
          dateLabel={dateLabel}
          reactionCount={0}
          isMenuOpen={isMenuOpen}
          onMenuToggle={handleMenuToggle}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
          onShare={handleShare}
          onDelete={handleDeleteClick}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <DeleteConfirmModal
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <ShareToast isVisible={isShareToastVisible} message={shareToastMessage} />

      {/* 갤러리 작품 상세 오버레이 */}
      {gallerySelectedId !== null && galleryDetail && (
        <GalleryDetailOverlay
          title={galleryDetail.title}
          authorName={galleryDetail.author.nickname}
          timeAgo={galleryDetail.timeAgo}
          imageUrl={galleryDetail.imageUrl}
          likeCount={galleryDetail.likeCount}
          isLiked={galleryDetail.isLiked}
          onClose={handleGalleryDetailClose}
          onLikeToggle={handleDetailLikeToggle}
        />
      )}
    </>
  );
}

export { HomePage };
