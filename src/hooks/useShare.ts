import { useState, useRef, useCallback } from "react";

const TOAST_DURATION = 2500;
const SHARE_BG_COLOR = "#D1C0BA";
const CANVAS_SIZE = 600;

// gold_frame.svg viewBox 기준 좌표 → 캔버스 비율 변환
// SVG viewBox: 0 0 823 951
// 작품 영역 rect: x=181 y=184 w=460 h=575
const SVG_W = 823;
const SVG_H = 951;
const ART_X = 181;
const ART_Y = 184;
const ART_W = 460;
const ART_H = 575;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 원격 이미지 URL을 프록시를 통해 blob으로 가져오기
const fetchImageBlob = async (src: string): Promise<Blob> => {
  const proxyUrl = `${API_BASE_URL}/api/images/proxy?url=${encodeURIComponent(src)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error("이미지 프록시 요청 실패");
  return response.blob();
};

// 이미지 URL을 로드하여 HTMLImageElement로 반환
// data URL / 로컬 에셋은 직접 로드, 원격 URL은 프록시를 통해 로드
const loadImage = async (src: string): Promise<HTMLImageElement> => {
  let objectUrl: string | null = null;
  let imageSrc = src;

  // 원격 URL인 경우 프록시를 통해 blob → objectURL로 변환
  if (!src.startsWith("data:")) {
    try {
      const url = new URL(src, window.location.origin);
      if (url.origin !== window.location.origin) {
        const blob = await fetchImageBlob(src);
        objectUrl = URL.createObjectURL(blob);
        imageSrc = objectUrl;
      }
    } catch {
      // 로컬 에셋이거나 URL 파싱 실패 시 그대로 진행
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지 로드 실패"));
    };
    img.src = imageSrc;
  });
};

// 배경색 + 액자 + 작품을 합성한 Blob 생성
// SVG 프레임 내부에 반투명 흰색 레이어가 있으므로
// 1) 배경 → 2) 프레임 → 3) 작품(프레임 내부 영역 위에) 순서로 그림
const composeShareImage = async (
  artworkUrl: string,
  frameUrl: string,
): Promise<Blob> => {
  const [artworkImg, frameImg] = await Promise.all([
    loadImage(artworkUrl),
    loadImage(frameUrl),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d")!;

  // 프레임을 정사각형 캔버스에 맞춰 중앙 배치 (비율 유지)
  const frameScale = Math.min(CANVAS_SIZE / SVG_W, CANVAS_SIZE / SVG_H);
  const frameW = SVG_W * frameScale;
  const frameH = SVG_H * frameScale;
  const frameX = (CANVAS_SIZE - frameW) / 2;
  const frameY = (CANVAS_SIZE - frameH) / 2;

  // 작품 영역을 캔버스 좌표로 변환
  const artX = frameX + ART_X * frameScale;
  const artY = frameY + ART_Y * frameScale;
  const artW = ART_W * frameScale;
  const artH = ART_H * frameScale;

  // 1) 배경색
  ctx.fillStyle = SHARE_BG_COLOR;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2) 액자 프레임 (반투명 내부 포함)
  ctx.drawImage(frameImg, frameX, frameY, frameW, frameH);

  // 3) 작품 — 프레임 내부 투명 영역 위에 그림
  ctx.drawImage(artworkImg, artX, artY, artW, artH);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("캔버스 Blob 변환 실패"));
    }, "image/png");
  });
};

const useShare = () => {
  const [isShareToastVisible, setIsShareToastVisible] = useState(false);
  const [shareToastMessage, setShareToastMessage] = useState("");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setShareToastMessage(message);
    setIsShareToastVisible(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setIsShareToastVisible(false);
      toastTimerRef.current = null;
    }, TOAST_DURATION);
  }, []);

  // 작품 이미지 + 액자 프레임을 합성하여 클립보드에 복사
  const handleShare = useCallback(
    async (artworkImageUrl: string, frameImageUrl: string) => {
      if (!artworkImageUrl || !frameImageUrl) return;

      try {
        const blob = await composeShareImage(artworkImageUrl, frameImageUrl);
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showToast("이미지가 클립보드에 복사되었습니다.");
      } catch {
        showToast("클립보드 복사에 실패했습니다.");
      }
    },
    [showToast],
  );

  return {
    handleShare,
    isShareToastVisible,
    shareToastMessage,
  };
};

export { useShare };
