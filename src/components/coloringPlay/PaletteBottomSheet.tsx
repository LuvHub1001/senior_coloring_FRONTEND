import { useSliderDrag } from "@/hooks";

interface PaletteBottomSheetProps {
  isOpen: boolean;
  paletteColor: string;
  hueBaseColor: string;
  huePercent: number;
  brightnessPercent: number;
  onHueChange: (percent: number) => void;
  onBrightnessChange: (percent: number) => void;
  onApply: () => void;
  onClose: () => void;
}

function PaletteBottomSheet({
  isOpen,
  paletteColor,
  hueBaseColor,
  huePercent,
  brightnessPercent,
  onHueChange,
  onBrightnessChange,
  onApply,
  onClose,
}: PaletteBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 딤 오버레이 */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* 팔레트 시트 */}
      <div className="absolute bottom-[140px] left-1/2 -translate-x-1/2 w-[335px] bg-white rounded-[20px] shadow-[0px_0px_50px_rgba(0,0,0,0.25)] overflow-hidden pt-4 pb-5">
        <div className="flex flex-col gap-5 items-center w-full">
          {/* 헤더: 선택한 색상 + 적용하기 */}
          <div className="flex items-center w-full px-4">
            <div className="flex flex-1 items-center gap-2">
              <div
                className="shrink-0 rounded-full border-2 p-1"
                style={{ borderColor: paletteColor }}
              >
                <div
                  className="size-6 rounded-full"
                  style={{ backgroundColor: paletteColor }}
                />
              </div>
              <span className="text-[13px] font-medium text-[#4E5968] tracking-[-0.065px] leading-[19.5px]">
                선택한 색상
              </span>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 cursor-pointer"
              onClick={onApply}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33 8L6.67 11.33L12.67 5.33"
                  stroke="#191F28"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] font-bold text-[#191F28] tracking-[-0.075px] leading-[22.5px]">
                적용하기
              </span>
            </button>
          </div>

          {/* 슬라이더 영역 */}
          <div className="flex flex-col gap-4 w-full">
            {/* 색상(Hue) 스펙트럼 바 */}
            <div className="px-4">
              <HueSlider percent={huePercent} onChange={onHueChange} />
            </div>

            {/* 밝기(Brightness) 바 */}
            <div className="px-4">
              <BrightnessSlider
                color={hueBaseColor}
                percent={brightnessPercent}
                onChange={onBrightnessChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hue 스펙트럼 슬라이더 ── */

interface HueSliderProps {
  percent: number;
  onChange: (percent: number) => void;
}

function HueSlider({ percent, onChange }: HueSliderProps) {
  const { handlePointerDown } = useSliderDrag(onChange);

  return (
    <div
      className="relative h-10 rounded-full shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)] cursor-pointer touch-none"
      style={{
        background:
          "linear-gradient(90deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #00FFFF 57%, #0000FF 71%, #FF00FF 85%, #FF0000 100%)",
      }}
      onPointerDown={handlePointerDown}
    >
      {/* 슬라이더 thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[6px] h-8 bg-white rounded-[200px] border-[2.4px] border-white shadow-[0px_7.5px_11.25px_rgba(0,0,0,0.1),0px_3px_4.5px_rgba(0,0,0,0.1)]"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

/* ── Brightness 슬라이더 ── */

interface BrightnessSliderProps {
  color: string;
  percent: number;
  onChange: (percent: number) => void;
}

function BrightnessSlider({ color, percent, onChange }: BrightnessSliderProps) {
  const { handlePointerDown } = useSliderDrag(onChange);

  /* 밝기 단계 마커 위치 (7개) */
  const MARKER_POSITIONS = [0, 16.67, 33.33, 50, 66.67, 83.33, 100];

  return (
    <div
      className="relative h-10 rounded-full overflow-hidden cursor-pointer touch-none"
      style={{
        background: `linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(255,255,255,0.5) 100%), ${color}`,
      }}
      onPointerDown={handlePointerDown}
    >
      {/* 인셋 그림자 */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)] pointer-events-none" />

      {/* 밝기 단계 마커 (점들) */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {MARKER_POSITIONS.map((pos) => (
          <div
            key={pos}
            className="size-4 rounded-full border-2 border-white shadow-[0px_5px_7.5px_rgba(0,0,0,0.1),0px_2px_3px_rgba(0,0,0,0.1)]"
            style={{
              opacity: Math.abs(pos - percent) < 8 ? 1 : 0.4,
            }}
          />
        ))}
      </div>

      {/* 슬라이더 thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-6 bg-white rounded-full border-[2.4px] border-white shadow-[0px_7.5px_11.25px_rgba(0,0,0,0.1),0px_3px_4.5px_rgba(0,0,0,0.1)]"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

export { PaletteBottomSheet };
