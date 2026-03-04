interface HomeTitleProps {
  userName: string;
  subtitle: string;
}

function HomeTitle({ userName, subtitle }: HomeTitleProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-4">
      <h1 className="text-[26px] font-bold text-[#191F28] tracking-[-0.13px] leading-[35px] text-center">
        {userName}님의 미술관
      </h1>
      <p className="text-[15px] font-medium text-[#191F28] tracking-[-0.075px] leading-[22.5px] text-center">
        {subtitle}
      </p>
    </div>
  );
}

export { HomeTitle };
