interface ColorPaletteBarProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

function ColorPaletteBar({ colors, selectedColor, onSelectColor }: ColorPaletteBarProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      {/* 선택된 색상 (테두리 강조) */}
      <div className="shrink-0 rounded-full border-2 p-1" style={{ borderColor: selectedColor }}>
        <div
          className="size-10 rounded-full"
          style={{ backgroundColor: selectedColor }}
        />
      </div>

      {/* 구분선 */}
      <div className="h-[33px] w-px bg-[#D9D9D9]" />

      {/* 색상 목록 (가로 스크롤) */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelectColor(color)}
            className="size-10 shrink-0 rounded-full cursor-pointer"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export { ColorPaletteBar };
