import {
  ColoringLoadingSkeleton,
  ColoringPlayHeader,
  ColoringCanvas,
  ColorPaletteBar,
  ColoringToolBar,
  PaletteBottomSheet,
  SaveConfirmModal,
  ModeToggle,
  ZoomToast,
  ZoomControls,
} from "@/components";
import { useColoringPlayPage } from "@/hooks";

function ColoringPlayPage() {
  const {
    isLoading,
    title,
    imageUrl,
    canvasRef,
    colors,
    selectedColor,
    canUndo,
    canRedo,
    isCompleteEnabled,
    handleBack,
    handleBackConfirm,
    handleBackCancel,
    isBackModalOpen,
    handleComplete,
    handleSelectColor,
    handleCanvasTap,
    handleUndo,
    handleRedo,
    handlePalette,
    handleGuide,
    handleCollapse,
    isToolBarCollapsed,
    isPaletteOpen,
    paletteColor,
    hueBaseColor,
    huePercent,
    brightnessPercent,
    handleHueChange,
    handleBrightnessChange,
    handlePaletteApply,
    handlePaletteClose,
    activeMode,
    handleModeChange,
    isZoomToastVisible,
    zoomPercent,
    handleZoomIn,
    handleZoomOut,
    zoomContainerStyle,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handlePinchStart,
    handlePinchMove,
    handlePinchEnd,
  } = useColoringPlayPage();

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F9FAFB]">
      {/* 로딩 스켈레톤 오버레이 — 캔버스가 항상 DOM에 존재하도록 */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <ColoringLoadingSkeleton imageUrl={imageUrl} title={title} />
        </div>
      )}

      {/* 헤더 */}
      <ColoringPlayHeader
        title={title}
        onBack={handleBack}
        onComplete={handleComplete}
        isCompleteEnabled={isCompleteEnabled}
      />

      {/* 캔버스 영역 */}
      <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-[#F9FAFB] pt-5">
        {/* 모드 토글 — 확대 시에도 항상 보이도록 z-20 */}
        {!isLoading && (
          <div className="relative z-20">
            <ModeToggle activeMode={activeMode} onModeChange={handleModeChange} />
          </div>
        )}

        {/* 줌 wrapper — 토글 아래 20px 간격 */}
        <div
          className="mt-5"
          style={zoomContainerStyle}
          onPointerDown={activeMode === "zoom" ? handleDragStart : undefined}
          onPointerMove={activeMode === "zoom" ? handleDragMove : undefined}
          onPointerUp={activeMode === "zoom" ? handleDragEnd : undefined}
          onPointerLeave={activeMode === "zoom" ? handleDragEnd : undefined}
          onTouchStart={activeMode === "zoom" ? handlePinchStart : undefined}
          onTouchMove={activeMode === "zoom" ? handlePinchMove : undefined}
          onTouchEnd={activeMode === "zoom" ? handlePinchEnd : undefined}
        >
          <ColoringCanvas
            canvasRef={canvasRef}
            onCanvasTap={handleCanvasTap}
            isZoomMode={activeMode === "zoom"}
          />
        </div>

        <ZoomToast isVisible={isZoomToastVisible} />

        {/* 오버레이: 확대 모드 줌 컨트롤 */}
        {activeMode === "zoom" && (
          <ZoomControls
            zoomPercent={zoomPercent}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        )}
      </div>

      {/* 팔레트 바텀시트 */}
      <PaletteBottomSheet
        isOpen={isPaletteOpen}
        paletteColor={paletteColor}
        hueBaseColor={hueBaseColor}
        huePercent={huePercent}
        brightnessPercent={brightnessPercent}
        onHueChange={handleHueChange}
        onBrightnessChange={handleBrightnessChange}
        onApply={handlePaletteApply}
        onClose={handlePaletteClose}
      />

      {/* 하단 도구 영역 — 로딩 중에는 숨김 */}
      {!isLoading && (
        <div className="bg-white">
          {/* 색상 선택 바 (접힘 시 슬라이드 애니메이션) */}
          <div
            className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
            style={{
              maxHeight: isToolBarCollapsed ? 0 : 73,
              opacity: isToolBarCollapsed ? 0 : 1,
            }}
          >
            <div className="h-px bg-[#E5E7EB]" />
            <ColorPaletteBar
              colors={colors}
              selectedColor={selectedColor}
              onSelectColor={handleSelectColor}
            />
          </div>

          {/* 구분선 */}
          <div className="h-px bg-[#E5E7EB]" />

          {/* 도구 바 */}
          <ColoringToolBar
            canUndo={canUndo}
            canRedo={canRedo}
            selectedColor={selectedColor}
            isPaletteActive={isPaletteOpen}
            isCollapsed={isToolBarCollapsed}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onPalette={handlePalette}
            onGuide={handleGuide}
            onCollapse={handleCollapse}
          />
        </div>
      )}
      {/* 뒤로가기 확인 모달 */}
      {isBackModalOpen && (
        <SaveConfirmModal
          onConfirm={handleBackConfirm}
          onCancel={handleBackCancel}
        />
      )}
    </div>
  );
}

export { ColoringPlayPage };
