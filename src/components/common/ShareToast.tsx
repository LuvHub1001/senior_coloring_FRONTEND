interface ShareToastProps {
  isVisible: boolean;
  message: string;
}

function ShareToast({ isVisible, message }: ShareToastProps) {
  return (
    <div
      className={`fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-[rgba(2,9,19,0.91)] px-[20px] py-[12px] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <p className="whitespace-nowrap text-center text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-white">
        {message}
      </p>
    </div>
  );
}

export { ShareToast };
