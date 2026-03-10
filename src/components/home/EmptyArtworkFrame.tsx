interface EmptyArtworkFrameProps {
  frameImageUrl: string;
  onClick: () => void;
}

function EmptyArtworkFrame({ frameImageUrl, onClick }: EmptyArtworkFrameProps) {
  return (
    <div className="flex flex-1 items-center justify-center relative">
      <div className="relative w-[320px] h-[384px]">
        {/* 액자 프레임 이미지 (흰색 마진 포함) */}
        <img
          src={frameImageUrl}
          alt="액자 틀"
          className="absolute inset-0 w-[320px] h-[384px] pointer-events-none"
        />

        {/* 그라데이션 박스 (SVG 내부 그라데이션 영역에 맞춤) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-[4px]"
          style={{
            width: "179px",
            height: "232px",
            background:
              "linear-gradient(141deg, #F9CFE9 0.14%, #BFDBFF 48.02%, #FAF7C6 100.03%)",
          }}
        />

        {/* 플러스 아이콘 + 안내 텍스트 */}
        <div
          onClick={onClick}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 cursor-pointer"
        >
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
