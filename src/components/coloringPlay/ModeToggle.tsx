interface ModeToggleProps {
  activeMode: "color" | "zoom";
  onModeChange: (mode: "color" | "zoom") => void;
}

function ModeToggle({ activeMode, onModeChange }: ModeToggleProps) {
  return (
    <div>
      <div className="relative flex rounded-full bg-[rgba(2,32,71,0.05)] p-[4px] backdrop-blur-[7px]">
        {/* 슬라이딩 인디케이터 */}
        <div
          className="absolute top-[4px] bottom-[4px] left-[4px] w-[calc(50%-4px)] rounded-full bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out"
          style={{
            transform:
              activeMode === "zoom" ? "translateX(100%)" : "translateX(0)",
          }}
        />

        {/* 버튼 레이어 */}
        <button
          type="button"
          onClick={() => onModeChange("color")}
          className={`relative z-10 h-[30px] rounded-full px-[20px] text-[15px] leading-[22.5px] tracking-[-0.075px] transition-colors duration-300 ease-in-out ${
            activeMode === "color"
              ? "font-[700] text-[#191F28]"
              : "font-[500] text-[#4E5968]"
          }`}
        >
          색칠
        </button>
        <button
          type="button"
          onClick={() => onModeChange("zoom")}
          className={`relative z-10 h-[30px] rounded-full px-[20px] text-[15px] leading-[22.5px] tracking-[-0.075px] transition-colors duration-300 ease-in-out ${
            activeMode === "zoom"
              ? "font-[700] text-[#191F28]"
              : "font-[500] text-[#4E5968]"
          }`}
        >
          확대
        </button>
      </div>
    </div>
  );
}

export { ModeToggle };
