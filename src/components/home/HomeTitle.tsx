interface HomeTitleProps {
  userName: string;
  subtitle: string;
  textColor?: string;
}

function HomeTitle({ userName, subtitle, textColor }: HomeTitleProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-2">
      <h1
        className="text-[26px] font-bold tracking-[-0.13px] leading-[35px] text-center"
        style={{ color: textColor ?? "#191F28" }}
      >
        {userName}님의 미술관
      </h1>
      <p
        className="text-[15px] font-medium tracking-[-0.075px] leading-[22.5px] text-center"
        style={{ color: textColor ?? "#191F28" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export { HomeTitle };
