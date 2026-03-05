interface ColoringCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCanvasTap: React.MouseEventHandler<HTMLCanvasElement>;
}

function ColoringCanvas({ canvasRef, onCanvasTap }: ColoringCanvasProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#F9FAFB]">
      <div className="size-[335px] overflow-hidden rounded-3xl border border-[#F3F5F7] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
        <canvas
          ref={canvasRef}
          onClick={onCanvasTap}
          className="size-full touch-none"
        />
      </div>
    </div>
  );
}

export { ColoringCanvas };
