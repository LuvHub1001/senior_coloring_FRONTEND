interface CreateArtworkButtonProps {
  onClick: () => void;
}

function CreateArtworkButton({ onClick }: CreateArtworkButtonProps) {
  return (
    <div className="w-full shrink-0">
      {/* 상단 페이드 그라데이션 */}
      <div className="h-9 bg-gradient-to-t from-[#F9FAFB] to-transparent" />

      {/* 버튼 영역 */}
      <div className="px-5 bg-[#F9FAFB]">
        <button
          type="button"
          onClick={onClick}
          className="flex w-full h-14 items-center justify-center rounded-2xl bg-[#333D48] cursor-pointer"
        >
          <span className="text-[19px] font-bold text-white tracking-[-0.095px] leading-[28px]">
            작품 만들기
          </span>
        </button>
      </div>

      {/* 하단 여백 (홈 인디케이터 영역) */}
      <div className="h-[34px] bg-[#F9FAFB]" />
    </div>
  );
}

export { CreateArtworkButton };
