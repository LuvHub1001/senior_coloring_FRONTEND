interface ColoringSvgCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSvgClick: React.MouseEventHandler<HTMLDivElement>;
  isZoomMode: boolean;
}

function ColoringSvgCanvas({
  containerRef,
  onSvgClick,
  isZoomMode,
}: ColoringSvgCanvasProps) {
  const svg = containerRef.current?.querySelector("svg");
  const viewBox = svg?.getAttribute("viewBox");
  let aspectRatio: string | undefined;
  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      aspectRatio = `${parts[2]} / ${parts[3]}`;
    }
  }

  return (
    <div
      className="w-[335px] overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_19px_0px_rgba(0,0,0,0.08)]"
      style={{ aspectRatio }}
    >
      <div
        ref={containerRef}
        onClick={isZoomMode ? undefined : onSvgClick}
        className="size-full touch-none"
        style={{ cursor: isZoomMode ? "grab" : "default" }}
      />
    </div>
  );
}

export { ColoringSvgCanvas };
