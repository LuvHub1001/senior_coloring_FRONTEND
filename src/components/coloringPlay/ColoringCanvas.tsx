interface ColoringCanvasProps {
  imageUrl: string;
  title: string;
}

function ColoringCanvas({ imageUrl, title }: ColoringCanvasProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#F9FAFB]">
      <div className="size-[335px] overflow-hidden rounded-3xl border border-[#F3F5F7] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
        <img
          src={imageUrl}
          alt={title}
          className="size-full object-cover"
        />
      </div>
    </div>
  );
}

export { ColoringCanvas };
