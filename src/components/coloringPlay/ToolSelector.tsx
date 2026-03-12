import paintIcon from "@images/coloring/paint.svg";
import brushIcon from "@images/coloring/brush.svg";
import eraserIcon from "@images/coloring/eraser.svg";
import type { ToolType } from "@/types";

interface ToolSelectorProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const TOOLS: { type: ToolType; label: string; icon: string }[] = [
  { type: "paint", label: "페인트", icon: paintIcon },
  { type: "brush", label: "붓", icon: brushIcon },
  { type: "eraser", label: "지우개", icon: eraserIcon },
];

function ToolSelector({ activeTool, onToolChange }: ToolSelectorProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white bg-white/80 p-2 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.08)] backdrop-blur-[6.5px]">
      {TOOLS.map(({ type, label, icon }) => {
        const isActive = activeTool === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onToolChange(type)}
            className={`flex w-[80px] cursor-pointer flex-col items-center gap-[4px] rounded-[8px] ${
              isActive
                ? "bg-[rgba(2,32,71,0.05)] pb-[12px] pt-[8px]"
                : "border border-transparent px-[1px] pb-[13px] pt-[9px]"
            }`}
          >
            <div className="flex size-[40px] items-center justify-center rounded-full bg-white">
              <img src={icon} alt={label} className="size-[40px]" />
            </div>
            <span
              className={`text-[15px] font-bold leading-[22.5px] tracking-[-0.075px] ${
                isActive ? "text-[#191F28]" : "text-[#333D48]"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { ToolSelector };
