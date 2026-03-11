interface ColoringCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCanvasTap: React.MouseEventHandler<HTMLCanvasElement>;
  isZoomMode: boolean;
}

function ColoringCanvas({
  canvasRef,
  onCanvasTap,
  isZoomMode,
}: ColoringCanvasProps) {
  const canvas = canvasRef.current;
  const aspectRatio =
    canvas && canvas.width > 0 && canvas.height > 0
      ? `${canvas.width} / ${canvas.height}`
      : undefined;

  return (
    <div
      className="w-[335px] overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_19px_0px_rgba(0,0,0,0.08)]"
      style={{ aspectRatio }}
    >
      <canvas
        ref={canvasRef}
        onClick={isZoomMode ? undefined : onCanvasTap}
        className="size-full touch-none"
        style={{ cursor: isZoomMode ? "grab" : "default" }}
      />
    </div>
  );
}

export { ColoringCanvas };
