interface ModeToggleProps {
  activeMode: "color" | "zoom";
  onModeChange: (mode: "color" | "zoom") => void;
}

function ModeToggle({ activeMode, onModeChange }: ModeToggleProps) {
  return (
    <div>
      <div className="flex gap-[4px] rounded-full bg-[rgba(2,32,71,0.05)] p-[4px] backdrop-blur-[7px]">
        <button
          type="button"
          onClick={() => onModeChange("color")}
          className={`h-[30px] rounded-full px-[20px] text-[15px] font-[700] leading-[22.5px] tracking-[-0.075px] transition-all ${
            activeMode === "color"
              ? "bg-white text-[#191F28] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]"
              : "text-[#4E5968]"
          }`}
        >
          색칠
        </button>
        <button
          type="button"
          onClick={() => onModeChange("zoom")}
          className={`h-[30px] rounded-full px-[20px] text-[15px] font-[700] leading-[22.5px] tracking-[-0.075px] transition-all ${
            activeMode === "zoom"
              ? "bg-white text-[#191F28] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]"
              : "text-[#4E5968]"
          }`}
        >
          확대
        </button>
      </div>
    </div>
  );
}

export { ModeToggle };
