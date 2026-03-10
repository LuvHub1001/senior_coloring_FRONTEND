interface CreateArtworkButtonProps {
  onClick: () => void;
  buttonColor?: string;
  buttonTextColor?: string;
}

function CreateArtworkButton({
  onClick,
  buttonColor,
  buttonTextColor,
}: CreateArtworkButtonProps) {
  return (
    <div className="w-full shrink-0">
      <div className="h-[36px]" />
      <div className="px-[20px]">
        <button
          type="button"
          onClick={onClick}
          className="flex w-full h-[56px] items-center justify-center rounded-[16px] cursor-pointer"
          style={{ backgroundColor: buttonColor ?? "#333D48" }}
        >
          <span
            className="text-[19px] font-[700] tracking-[-0.095px] leading-[28px]"
            style={{ color: buttonTextColor ?? "#FFFFFF" }}
          >
            작품 만들기
          </span>
        </button>
      </div>
      <div className="h-[34px]" />
    </div>
  );
}

export { CreateArtworkButton };
