import {
  ColoringLoadingSkeleton,
  ColoringPlayHeader,
  ColoringCanvas,
  ColorPaletteBar,
  ColoringToolBar,
  PaletteBottomSheet,
} from "@/components";
import { useColoringPlayPage } from "@/hooks";

function ColoringPlayPage() {
  const {
    isLoading,
    title,
    imageUrl,
    colors,
    selectedColor,
    canUndo,
    canRedo,
    isCompleteEnabled,
    handleBack,
    handleComplete,
    handleSelectColor,
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
  } = useColoringPlayPage();

  if (isLoading) {
    return <ColoringLoadingSkeleton />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F9FAFB]">
      {/* 헤더 */}
      <ColoringPlayHeader
        title={title}
        onBack={handleBack}
        onComplete={handleComplete}
        isCompleteEnabled={isCompleteEnabled}
      />

      {/* 캔버스 영역 */}
      <ColoringCanvas
        imageUrl={imageUrl}
        title={title}
      />

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

      {/* 하단 도구 영역 */}
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
    </div>
  );
}

export { ColoringPlayPage };
