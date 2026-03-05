interface ColoringLoadingSkeletonProps {
  imageUrl?: string;
  title?: string;
}

function ColoringLoadingSkeleton({ imageUrl, title }: ColoringLoadingSkeletonProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F3F5F7] pb-[60px]">
      {/* 스켈레톤 이미지 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title ?? "도안"}
          className="size-[250px] rounded-[18px] border border-[#F9FAFB] object-cover shadow-[0px_0px_15px_0px_rgba(0,0,0,0.08)] skeleton-reveal"
        />
      ) : (
        <div className="size-[250px] rounded-[18px] border border-[#F9FAFB] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.08)] skeleton-shimmer" />
      )}

      {/* 텍스트 + 로딩 dots */}
      <div className="mt-5 flex flex-col items-center gap-5">
        <p className="text-[20px] font-bold text-[#191F28] tracking-[-0.1px] leading-[29px] text-center">
          도안을 불러오는 중입니다
        </p>
        <div className="flex items-center gap-2">
          <div
            className="size-2 rounded-full bg-[#191F28] dot-pulse"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="size-2 rounded-full bg-[#191F28] dot-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="size-2 rounded-full bg-[#191F28] dot-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}

export { ColoringLoadingSkeleton };
