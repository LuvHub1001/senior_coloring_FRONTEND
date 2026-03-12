import { useMemo } from "react";
import type { ToolType } from "@/types";

interface ColoringCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCanvasTap: React.MouseEventHandler<HTMLCanvasElement>;
  onPointerDown?: React.PointerEventHandler<HTMLCanvasElement>;
  onPointerMove?: React.PointerEventHandler<HTMLCanvasElement>;
  onPointerUp?: React.PointerEventHandler<HTMLCanvasElement>;
  isZoomMode: boolean;
  activeTool: ToolType;
}

function ColoringCanvas({
  canvasRef,
  onCanvasTap,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  isZoomMode,
  activeTool,
}: ColoringCanvasProps) {
  const canvas = canvasRef.current;
  const aspectRatio = useMemo(
    () =>
      canvas && canvas.width > 0 && canvas.height > 0
        ? `${canvas.width} / ${canvas.height}`
        : undefined,
    [canvas?.width, canvas?.height],
  );

  const isFreehand = !isZoomMode && (activeTool === "brush" || activeTool === "eraser");

  return (
    <div
      className="w-[335px] overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_19px_0px_rgba(0,0,0,0.08)]"
      style={{ aspectRatio }}
    >
      <canvas
        ref={canvasRef}
        onClick={isZoomMode ? undefined : onCanvasTap}
        onPointerDown={isFreehand ? onPointerDown : undefined}
        onPointerMove={isFreehand ? onPointerMove : undefined}
        onPointerUp={isFreehand ? onPointerUp : undefined}
        onPointerLeave={isFreehand ? onPointerUp : undefined}
        className="size-full touch-none"
        style={{ cursor: isZoomMode ? "grab" : isFreehand ? "crosshair" : "default" }}
      />
    </div>
  );
}

export { ColoringCanvas };
