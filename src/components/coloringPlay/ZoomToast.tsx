interface ZoomToastProps {
  isVisible: boolean;
}

function ZoomToast({ isVisible }: ZoomToastProps) {
  return (
    <div
      className={`pointer-events-none mt-[38px] rounded-[8px] bg-[rgba(2,9,19,0.91)] p-[12px] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="whitespace-nowrap text-center text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-white">
        도안을 이동하거나 확대할 수 있습니다.
      </p>
    </div>
  );
}

export { ZoomToast };
