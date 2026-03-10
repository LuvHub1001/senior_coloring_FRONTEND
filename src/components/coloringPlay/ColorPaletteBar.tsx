interface ColorPaletteBarProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

function ColorPaletteBar({ colors, selectedColor, onSelectColor }: ColorPaletteBarProps) {
  return (
    <div className="flex items-center gap-[16px] px-5 py-4">
      {/* 선택된 색상 (테두리 강조) */}
      <div className="shrink-0 rounded-full border-[2px] p-[4px]" style={{ borderColor: selectedColor }}>
        <div
          className="size-[40px] rounded-full"
          style={{ backgroundColor: selectedColor }}
        />
      </div>

      {/* 구분선 */}
      <div className="h-[33px] w-px bg-[#D9D9D9]" />

      {/* 색상 목록 (가로 스크롤) */}
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelectColor(color)}
            className="size-[40px] shrink-0 rounded-full cursor-pointer"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export { ColorPaletteBar };
