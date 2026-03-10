interface HomeTitleProps {
  userName: string;
  subtitle: string;
  textColor?: string;
}

function HomeTitle({ userName, subtitle, textColor }: HomeTitleProps) {
  return (
    <div className="flex flex-col items-center gap-[8px] px-[24px] pt-[32px] pb-[8px]">
      <h1
        className="text-[26px] font-[700] tracking-[-0.13px] leading-[35px] text-center"
        style={{ color: textColor ?? "#191F28" }}
      >
        {userName}님의 미술관
      </h1>
      <p
        className="text-[15px] font-[500] tracking-[-0.075px] leading-[22.5px] text-center"
        style={{ color: textColor ?? "#191F28" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export { HomeTitle };
