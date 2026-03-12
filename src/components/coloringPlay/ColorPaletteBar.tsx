import { useRef, useState, useCallback, useEffect } from "react";
import type { ToolType } from "@/types";
import paintIcon from "@images/coloring/paint.svg";
import brushIcon from "@images/coloring/brush.svg";
import eraserIcon from "@images/coloring/eraser.svg";

const TOOL_ICONS: Record<ToolType, string> = {
  paint: paintIcon,
  brush: brushIcon,
  eraser: eraserIcon,
};

interface ColorPaletteBarProps {
  colors: string[];
  selectedColor: string;
  activeTool: ToolType;
  onSelectColor: (color: string) => void;
  onToolIconClick: () => void;
}

function ColorPaletteBar({
  colors,
  selectedColor,
  activeTool,
  onSelectColor,
  onToolIconClick,
}: ColorPaletteBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    // rAF throttle — 프레임당 한 번만 setState 호출
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const el = scrollRef.current;
      if (!el) return;
      setIsScrolled(el.scrollLeft > 0);
    });
  }, []);

  // 컴포넌트 언마운트 시 대기 중인 rAF 취소
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-[16px] px-5 py-4">
      {/* 선택된 도구 아이콘 + 색상 테두리 */}
      <button
        type="button"
        onClick={onToolIconClick}
        className="relative shrink-0 cursor-pointer rounded-full border-[2px] p-[4px]"
        style={{ borderColor: selectedColor }}
      >
        <div className="relative size-[40px] overflow-hidden rounded-full" style={{ backgroundColor: selectedColor }}>
          <img
            src={TOOL_ICONS[activeTool]}
            alt={activeTool}
            className="absolute left-1/2 top-[7px] size-[41px] -translate-x-1/2"
          />
        </div>
        {/* + 뱃지 */}
        <div className="absolute left-[-8px] top-[-6px] flex size-[24px] items-center justify-center rounded-full bg-black shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)]">
          <span className="text-[14px] font-bold leading-none text-white">+</span>
        </div>
      </button>

      {/* 구분선 */}
      <div className="h-[33px] w-px bg-[#D9D9D9]" />

      {/* 색상 목록 (가로 스크롤) */}
      <div className="relative min-w-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-[8px] overflow-x-auto scrollbar-hide"
        >
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onSelectColor(color)}
              className="size-[40px] shrink-0 cursor-pointer rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        {/* 왼쪽 페이드 그라데이션 — 스크롤 시에만 표시 */}
        {isScrolled && (
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-[37px]"
            style={{
              background:
                "linear-gradient(to right, #FFFFFF 9.5%, rgba(255,255,255,0) 78.4%)",
            }}
          />
        )}
      </div>
    </div>
  );
}

export { ColorPaletteBar };
