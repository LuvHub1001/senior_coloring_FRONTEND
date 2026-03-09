import {
  ColoringHeader,
  ProgressSection,
  CategoryFilter,
  ColoringItemGrid,
  ArtworkPreviewModal,
  DesignDetailModal,
} from "@/components";
import { useColoringBookPage } from "@/hooks";

function ColoringBookPage() {
  const {
    categories,
    selectedCategory,
    progressItems,
    filteredItems,
    selectedArtwork,
    isMoreMenuOpen,
    handleBack,
    handleCategorySelect,
    handleProgressItemClick,
    handleColoringItemClick,
    handleClosePreview,
    handleContinueColoring,
    handleExhibit,
    handleToggleMoreMenu,
    handleDeleteArtwork,
    handleShareArtwork,
    selectedDesign,
    isDesignDetailLoading,
    handleCloseDesignDetail,
    handleStartColoring,
  } = useColoringBookPage();

  return (
    <div className="flex min-h-dvh flex-col bg-[#F3F5F7]">
      {/* 헤더 */}
      <ColoringHeader onBack={handleBack} />

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        {/* 이어서 색칠하기 (진행중인 도안이 있을 때만) */}
        <ProgressSection
          items={progressItems}
          onItemClick={handleProgressItemClick}
        />

        {/* 도안 모아보기 */}
        <section className="flex flex-col gap-6 px-5 py-5">
          <div className="flex flex-col gap-4">
            <h2 className="text-[19px] font-bold text-[#0A0A0A] tracking-[-0.095px] leading-[28px]">
              도안 모아보기
            </h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </div>

          {/* 도안 그리드 */}
          <ColoringItemGrid
            items={filteredItems}
            onItemClick={handleColoringItemClick}
          />
        </section>
      </div>

      {/* 도안 상세 모달 */}
      {selectedDesign && (
        <DesignDetailModal
          design={selectedDesign}
          isLoading={isDesignDetailLoading}
          onClose={handleCloseDesignDetail}
          onStartColoring={handleStartColoring}
        />
      )}

      {/* 임시저장 작품 프리뷰 모달 */}
      {selectedArtwork && (
        <ArtworkPreviewModal
          artwork={selectedArtwork}
          isMoreMenuOpen={isMoreMenuOpen}
          onClose={handleClosePreview}
          onContinue={handleContinueColoring}
          onExhibit={handleExhibit}
          onToggleMoreMenu={handleToggleMoreMenu}
          onShare={handleShareArtwork}
          onDelete={handleDeleteArtwork}
        />
      )}
    </div>
  );
}

export { ColoringBookPage };
