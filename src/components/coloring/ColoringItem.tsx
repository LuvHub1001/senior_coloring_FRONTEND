import { memo } from "react";

interface ColoringItemProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
}

const ColoringItem = memo(function ColoringItem({ imageUrl, title, onClick }: ColoringItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 cursor-pointer"
    >
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border-[0.54px] border-[#E9E9E9] bg-[rgba(255,255,255,0.8)] p-[12.5px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
        {/* 이미지 영역 */}
        <div className="aspect-[4/5] w-[136px] shrink-0 overflow-hidden rounded-xl border border-[#E9E9E9] bg-[#F9FAFB]">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="size-full object-cover"
          />
        </div>

        {/* 제목 */}
        <span className="text-[15px] font-semibold text-[#101828] tracking-[-0.075px] leading-[22.5px]">
          {title}
        </span>
      </div>
    </button>
  );
});

export { ColoringItem };
