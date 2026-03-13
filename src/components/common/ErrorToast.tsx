interface ErrorToastProps {
  isVisible: boolean;
  message: string;
}

function ErrorToast({ isVisible, message }: ErrorToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-[100px] left-1/2 z-[60] -translate-x-1/2 rounded-[8px] bg-[#E53935] px-[20px] py-[12px] shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <p className="whitespace-nowrap text-center text-[15px] font-[500] leading-[22.5px] tracking-[-0.075px] text-white">
        {message}
      </p>
    </div>
  );
}

export { ErrorToast };
