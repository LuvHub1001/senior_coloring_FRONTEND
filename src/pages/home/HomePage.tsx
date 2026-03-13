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
      {activeTab === "gallery" ? (
        <div className="relative min-h-dvh">
          {/* 갤러리 뷰 */}
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

          {/* 네비게이션 (갤러리 위에 오버레이) */}
          <div className="absolute top-0 left-0 w-full z-10">
            <HomeNavBar
              activeTab={activeTab}
              toggleType="LIGHT"
              onTabChange={handleTabChange}
              onThemeClick={handleThemeClick}
            />
          </div>
        </div>
      ) : hasArtworks ? (
        <div className="relative min-h-dvh">
          {/* 미술관 뷰 (테마 배경 + 작품) */}
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

          {/* 네비게이션 (미술관 위에 오버레이) */}
          <div className="absolute top-0 left-0 w-full z-10">
            <HomeNavBar
              activeTab={activeTab}
              toggleType={toggleType}
              onTabChange={handleTabChange}
              onThemeClick={handleThemeClick}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col min-h-dvh bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${selectedThemeImageUrl})` }}
        >
          {/* 네비게이션 */}
          <HomeNavBar
            activeTab={activeTab}
            toggleType={toggleType}
            onTabChange={handleTabChange}
            onThemeClick={handleThemeClick}
          />

          {/* 타이틀 */}
          <HomeTitle
            userName={userName}
            subtitle="그림을 그려서 내 미술관에 전시해요"
            textColor={textColor}
          />

          {/* 빈 액자 */}
          <EmptyArtworkFrame frameImageUrl={frameImageUrl} onClick={handleCreateArtwork} />

          {/* 하단 버튼 */}
          <CreateArtworkButton
            onClick={handleCreateArtwork}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
          />
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
