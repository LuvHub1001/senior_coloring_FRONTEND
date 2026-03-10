interface ColoringCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCanvasTap: React.MouseEventHandler<HTMLCanvasElement>;
  isZoomMode: boolean;
  zoomScale: number;
  panX: number;
  panY: number;
  onPanStart: React.PointerEventHandler<HTMLDivElement>;
  onPanMove: React.PointerEventHandler<HTMLDivElement>;
  onPanEnd: React.PointerEventHandler<HTMLDivElement>;
}

function ColoringCanvas({
  canvasRef,
  onCanvasTap,
  isZoomMode,
  zoomScale,
  panX,
  panY,
  onPanStart,
  onPanMove,
  onPanEnd,
}: ColoringCanvasProps) {
  return (
    <div
      className="size-[335px] overflow-hidden rounded-[24px] border border-[#F3F5F7] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]"
      onPointerDown={isZoomMode ? onPanStart : undefined}
      onPointerMove={isZoomMode ? onPanMove : undefined}
      onPointerUp={isZoomMode ? onPanEnd : undefined}
      onPointerLeave={isZoomMode ? onPanEnd : undefined}
      style={{ touchAction: isZoomMode ? "none" : undefined }}
    >
      <canvas
        ref={canvasRef}
        onClick={isZoomMode ? undefined : onCanvasTap}
        className="size-full touch-none"
        style={{
          transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`,
          transformOrigin: "center center",
          cursor: isZoomMode ? "grab" : "default",
        }}
      />
    </div>
  );
}

export { ColoringCanvas };
