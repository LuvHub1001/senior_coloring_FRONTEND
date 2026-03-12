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
  ToolSelector,
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
    handleResetClick,
    handleResetConfirm,
    handleResetCancel,
    isResetModalOpen,
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
    activeTool,
    isToolSelectorOpen,
    handleToolChange,
    handleToolIconClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    activeMode,
    handleModeChange,
    isZoomToastVisible,
    zoomPercent,
    handleZoomIn,
    handleZoomOut,
    viewportRef,
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

        {/* 줌 래퍼 — 래퍼+도안이 함께 확대, 부모 overflow-hidden이 뷰포트 역할 */}
        <div
          ref={viewportRef}
          className="mt-5"
          style={{ ...zoomContainerStyle, touchAction: activeMode === "zoom" ? "none" : undefined }}
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
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            isZoomMode={activeMode === "zoom"}
            activeTool={activeTool}
          />
        </div>

        {/* 도구 선택 패널 — 캔버스 좌측 플로팅 (토글로 열기/닫기) */}
        {!isLoading && activeMode === "color" && isToolSelectorOpen && (
          <div className="absolute bottom-[9px] left-5 z-20">
            <ToolSelector activeTool={activeTool} onToolChange={handleToolChange} />
          </div>
        )}

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
              activeTool={activeTool}
              onSelectColor={handleSelectColor}
              onToolIconClick={handleToolIconClick}
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
            onReset={handleResetClick}
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
      {/* 리셋 확인 모달 */}
      {isResetModalOpen && (
        <SaveConfirmModal
          title="초기화하시겠어요?"
          description="지금까지 한 작업이 초기화 됩니다."
          onConfirm={handleResetConfirm}
          onCancel={handleResetCancel}
        />
      )}
    </div>
  );
}

export { ColoringPlayPage };
