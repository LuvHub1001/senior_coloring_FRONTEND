import frameImage from "@images/home/frame.png";

interface EmptyArtworkFrameProps {
  onClick: () => void;
}

function EmptyArtworkFrame({ onClick }: EmptyArtworkFrameProps) {
  return (
    <div className="flex flex-1 items-center justify-center relative" onClick={onClick}>
      {/* 그림자 */}
      <div className="absolute w-[320px] h-[369px] blur-[17px] mix-blend-multiply opacity-10 bg-black rounded-sm" />

      {/* 액자 프레임 */}
      <div className="relative w-[320px] h-[369px]">
        {/* 프레임 이미지 (overflow-hidden으로 클리핑) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={frameImage}
            alt="액자 틀"
            className="absolute w-[116%] h-[151%] left-[-8%] top-[-21%] max-w-none"
          />
        </div>

        {/* 액자 내부 콘텐츠 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[56.5px] w-[186px] h-[254px] rounded-[10px] overflow-hidden flex flex-col items-center justify-center gap-4 pb-[18px] px-3"
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
