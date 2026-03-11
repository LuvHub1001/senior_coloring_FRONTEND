import { useRef, useEffect, useState, useCallback } from "react";

/**
 * 이미지 목록을 무한 횡스크롤(마퀴) 애니메이션으로 움직이는 훅
 * - 뷰포트 너비에 따라 이미지 반복 횟수를 동적으로 계산
 * - containerRef를 이미지 래퍼에 연결
 * - repeatCount만큼 이미지를 반복 렌더링해야 이음새 없이 루프됨
 */
const useImageCarousel = (itemCount: number, speed: number = 0.5) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const positionRef = useRef<number>(0);
  const singleSetWidthRef = useRef<number>(0);
  const [repeatCount, setRepeatCount] = useState(2);

  // 뷰포트 너비 기반으로 반복 횟수 계산
  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current || !containerRef.current.children.length) return;

      const firstItem = containerRef.current.children[0];
      if (!(firstItem instanceof HTMLElement)) return;
      const gap = parseFloat(getComputedStyle(containerRef.current).gap) || 0;
      const itemWidth = firstItem.offsetWidth + gap;
      const singleSetWidth = itemWidth * itemCount;
      singleSetWidthRef.current = singleSetWidth;

      const viewportWidth = window.innerWidth;
      // 화면을 채울 수 있는 세트 수 + 1 (루프용)
      const needed = Math.ceil(viewportWidth / singleSetWidth) + 1;
      setRepeatCount((prev) => {
        const next = Math.max(needed, 2);
        return next !== prev ? next : prev;
      });
    };

    requestAnimationFrame(calculate);
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [itemCount]);

  // 애니메이션 루프
  const animate = useCallback(() => {
    if (!containerRef.current || singleSetWidthRef.current === 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    positionRef.current -= speed;

    if (Math.abs(positionRef.current) >= singleSetWidthRef.current) {
      positionRef.current += singleSetWidthRef.current;
    }

    containerRef.current.style.transform = `translateX(${positionRef.current}px)`;
    animationRef.current = requestAnimationFrame(animate);
  }, [speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  return { containerRef, repeatCount };
};

export { useImageCarousel };
