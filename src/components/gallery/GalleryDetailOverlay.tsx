import { useState, useEffect } from "react";
import goldFrame from "@images/home/gold_frame.svg";
import heartIcon from "@images/exhibition/heart.svg";
import heartEmptyIcon from "@images/exhibition/heart_empty.svg";

interface GalleryDetailOverlayProps {
  title: string;
  authorName: string;
  timeAgo: string;
  imageUrl: string;
  likeCount: number;
  isLiked: boolean;
  onClose: () => void;
  onLikeToggle: () => void;
}

// 반짝이 파티클 초기 위치/크기 (랜덤 생성 방지 — SSR 안전)
const SPARKLES = [
  { left: "37.6%", top: "11.1%", size: 3, delay: 0, opacity: 0.96 },
  { left: "72.3%", top: "16.0%", size: 3, delay: 0.3, opacity: 0.96 },
  { left: "18.9%", top: "22.2%", size: 3, delay: 0.7, opacity: 0.6 },
  { left: "27.5%", top: "27.0%", size: 3, delay: 1.1, opacity: 0.96 },
  { left: "68.0%", top: "14.5%", size: 3, delay: 0.5, opacity: 0.3 },
  { left: "50.0%", top: "8.0%", size: 2, delay: 1.4, opacity: 0.7 },
  { left: "82.0%", top: "20.0%", size: 2, delay: 0.9, opacity: 0.5 },
  { left: "12.0%", top: "15.0%", size: 2, delay: 1.7, opacity: 0.8 },
];

function GalleryDetailOverlay({
  title,
  authorName,
  timeAgo,
  imageUrl,
  likeCount,
  isLiked,
  onClose,
  onLikeToggle,
}: GalleryDetailOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 마운트 후 애니메이션 트리거
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* 어두운 배경 + 블러 */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "rgba(0, 0, 0, 0.50)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* 스포트라이트 조명 — 위에서 작품을 향해 비추는 빛 */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1.2s ease-out 0.2s",
        }}
      >
        {/* 메인 빔: 위가 좁고 아래로 퍼지는 원뿔 */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -370,
            width: 0,
            height: 0,
            borderLeft: "115px solid transparent",
            borderRight: "115px solid transparent",
            borderBottom: "580px solid rgba(255,255,255,0.16)",
            filter: "blur(30px)",
          }}
        />
        {/* 보조 빔: 더 넓게 퍼지는 외곽 */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -370,
            width: 0,
            height: 0,
            borderLeft: "125px solid transparent",
            borderRight: "125px solid transparent",
            borderBottom: "580px solid rgba(255,255,255,0.08)",
            filter: "blur(40px)",
          }}
        />
        {/* 가장 넓은 외곽 빔 */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -370,
            width: 0,
            height: 0,
            borderLeft: "150px solid transparent",
            borderRight: "150px solid transparent",
            borderBottom: "580px solid rgba(255,255,255,0.04)",
            filter: "blur(50px)",
          }}
        />
        {/* 상단 광원 글로우 (빛의 출발점) */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -10,
            width: 60,
            height: 30,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* 반짝이 파티클 */}
      {SPARKLES.map((sparkle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            opacity: isVisible ? sparkle.opacity : 0,
            boxShadow: `0 0 ${sparkle.size * 2.5}px rgba(255,255,255,0.77)`,
            animation: isVisible
              ? `sparkle-fade ${1.8 + sparkle.delay}s ease-in-out ${sparkle.delay}s infinite`
              : "none",
            transition: `opacity 0.6s ease ${sparkle.delay + 0.3}s`,
          }}
        />
      ))}

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-[16px] top-[26px] z-10 flex size-[48px] items-center justify-center rounded-full bg-white/10 cursor-pointer"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 7l14 14M21 7L7 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 중앙 콘텐츠 (클릭 이벤트 전파 방지) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-[8px] transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 작품 정보 */}
        <div className="flex flex-col items-center gap-[6px]">
          <h2 className="text-[26px] font-[600] leading-[35px] tracking-[-0.13px] text-white">
            {title}
          </h2>
          <div className="flex items-center gap-[4px]">
            <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-white">
              {authorName}
            </span>
            <span className="size-[2px] rounded-full bg-white" />
            <span className="text-[13px] font-[500] leading-[19.5px] tracking-[-0.065px] text-white/60">
              {timeAgo}
            </span>
          </div>
        </div>

        {/* 액자 + 작품 이미지 */}
        <div className="relative w-[366px] h-[366px]">
          {/* 액자 프레임 */}
          <img
            src={goldFrame}
            alt="액자"
            className="absolute inset-0 size-full pointer-events-none"
          />
          {/* 작품 이미지 (액자 내부) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px]"
            style={{ width: "250px", height: "250px" }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="size-full object-cover"
            />
          </div>
        </div>

        {/* 좋아요 버튼 */}
        <button
          type="button"
          onClick={onLikeToggle}
          className={`flex items-center gap-[8px] rounded-full border px-[17px] py-[13px] cursor-pointer transition-colors duration-200 ${
            isLiked
              ? "border-[#F66571] bg-[rgba(3,24,50,0.46)]"
              : "border-[rgba(255,255,255,0.3)] bg-[rgba(3,24,50,0.46)]"
          }`}
        >
          <img
            src={isLiked ? heartIcon : heartEmptyIcon}
            alt="좋아요"
            className="block w-[20px] h-[17.5px]"
          />
          <span
            className={`text-[17px] font-[700] leading-none tracking-[-0.085px] ${
              isLiked ? "text-[#F66571]" : "text-white/50"
            }`}
          >
            {likeCount}
          </span>
        </button>
      </div>
    </div>
  );
}

export { GalleryDetailOverlay };
