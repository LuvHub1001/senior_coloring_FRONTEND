interface EmptyArtworkFrameProps {
  frameImageUrl: string;
  onClick: () => void;
}

function EmptyArtworkFrame({ frameImageUrl, onClick }: EmptyArtworkFrameProps) {
  return (
    <div className="flex flex-1 items-center justify-center relative">
      {/* 그림자 */}
      <div className="absolute w-[320px] h-[384px] blur-[17px] mix-blend-multiply opacity-10 bg-black rounded-sm" />

      {/* 액자 프레임 */}
      <div className="relative w-[320px] h-[384px]">
        {/* 프레임 이미지 */}
        <img
          src={frameImageUrl}
          alt="액자 틀"
          className="absolute inset-0 w-[320px] h-[384px] pointer-events-none"
        />

        {/* 액자 내부 콘텐츠 (클릭 영역) */}
        <div
          onClick={onClick}
          className="absolute left-1/2 -translate-x-1/2 top-[46.5px] w-[185px] h-[265px] rounded-[2px] overflow-hidden flex flex-col items-center justify-center gap-4 pb-[18px] px-3 cursor-pointer"
          style={{
            backgroundImage:
              "linear-gradient(126.2deg, #FCCED8 0%, #BEDBFF 50%, #FEF9C2 100%)",
          }}
        >
          {/* 플러스 아이콘 */}
          <div className="flex size-20 items-center justify-center rounded-full bg-[rgba(255,255,255,0.7)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="#4E5968"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 안내 텍스트 */}
          <p className="text-[19px] font-medium text-[#4E5968] tracking-[-0.095px] leading-[28px] text-center whitespace-nowrap">
            이 액자에
            <br />
            첫 그림을 담아보세요
          </p>
        </div>
      </div>
    </div>
  );
}

export { EmptyArtworkFrame };
