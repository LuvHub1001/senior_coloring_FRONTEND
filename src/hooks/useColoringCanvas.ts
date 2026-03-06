import { useRef, useState, useEffect, useCallback } from "react";

// HEX → RGBA 변환
const hexToRgba = (hex: string): { r: number; g: number; b: number; a: number } => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, a: 255 };
};

// 플러드 필 (색 채우기) 알고리즘 — 스택 기반
const floodFill = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: { r: number; g: number; b: number; a: number },
  tolerance: number,
): boolean => {
  const { data, width, height } = imageData;
  const startIdx = (startY * width + startX) * 4;
  const startR = data[startIdx];
  const startG = data[startIdx + 1];
  const startB = data[startIdx + 2];
  const startA = data[startIdx + 3];

  // 이미 같은 색이면 스킵
  if (
    Math.abs(startR - fillColor.r) <= tolerance &&
    Math.abs(startG - fillColor.g) <= tolerance &&
    Math.abs(startB - fillColor.b) <= tolerance &&
    Math.abs(startA - fillColor.a) <= tolerance
  ) {
    return false;
  }

  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);

  const matchesStart = (idx: number): boolean => {
    return (
      Math.abs(data[idx] - startR) <= tolerance &&
      Math.abs(data[idx + 1] - startG) <= tolerance &&
      Math.abs(data[idx + 2] - startB) <= tolerance &&
      Math.abs(data[idx + 3] - startA) <= tolerance
    );
  };

  const stack: number[] = [startX, startY];

  while (stack.length > 0) {
    const y = stack.pop()!;
    const x = stack.pop()!;

    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const pixelIdx = y * width + x;
    if (visited[pixelIdx]) continue;

    const dataIdx = pixelIdx * 4;
    if (!matchesStart(dataIdx)) continue;

    visited[pixelIdx] = 1;
    data[dataIdx] = fillColor.r;
    data[dataIdx + 1] = fillColor.g;
    data[dataIdx + 2] = fillColor.b;
    data[dataIdx + 3] = fillColor.a;

    stack.push(x + 1, y);
    stack.push(x - 1, y);
    stack.push(x, y + 1);
    stack.push(x, y - 1);
  }

  return true;
};

const FLOOD_FILL_TOLERANCE = 32;
const MAX_HISTORY = 50;

const useColoringCanvas = (imageUrl: string, selectedColor: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;
  const hasColoredAnything = historyIndexRef.current > 0;

  // 이미지 로드 및 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // 캔버스 크기를 이미지 비율에 맞게 설정 (최대 670px 제한)
      const maxSize = 670;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvasW = Math.round(img.width * scale);
      const canvasH = Math.round(img.height * scale);

      canvas.width = canvasW;
      canvas.height = canvasH;

      // 흰 배경
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, canvasW, canvasH);

      // 초기 상태 히스토리에 저장
      const initialData = ctx.getImageData(0, 0, canvasW, canvasH);
      historyRef.current = [initialData];
      historyIndexRef.current = 0;
      setHistoryVersion((v) => v + 1);
      setIsImageLoaded(true);
    };

    img.onerror = () => {
      setIsImageLoaded(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  // 캔버스 클릭 → 플러드 필
  const handleCanvasTap = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !isImageLoaded) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const fillColor = hexToRgba(selectedColor);
      const filled = floodFill(imageData, x, y, fillColor, FLOOD_FILL_TOLERANCE);

      if (filled) {
        ctx.putImageData(imageData, 0, 0);

        // 현재 위치 이후 히스토리 제거 후 새 상태 추가
        const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        newHistory.push(snapshot);

        // 히스토리 최대 개수 제한
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        historyRef.current = newHistory;
        historyIndexRef.current = newHistory.length - 1;
        setHistoryVersion((v) => v + 1);
      }
    },
    [selectedColor, isImageLoaded],
  );

  // 실행 취소
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    historyIndexRef.current -= 1;
    ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    setHistoryVersion((v) => v + 1);
  }, []);

  // 다시 실행
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    historyIndexRef.current += 1;
    ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    setHistoryVersion((v) => v + 1);
  }, []);

  // 색칠 진행률 계산 (흰색/검정 제외 픽셀 비율)
  const getProgress = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const total = width * height;
    let colored = 0;

    for (let i = 0; i < total; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // 흰색 계열(배경)과 검정 계열(윤곽선) 제외
      const isWhite = r > 230 && g > 230 && b > 230;
      const isBlack = r < 40 && g < 40 && b < 40;

      if (!isWhite && !isBlack) {
        colored++;
      }
    }

    return Math.min(Math.round((colored / total) * 100), 100);
  }, []);

  // 현재 캔버스를 이미지 데이터 URL로 내보내기 (완성 화면용)
  const getCanvasDataUrl = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  }, []);

  // 현재 캔버스를 File 객체로 내보내기 (임시 저장 API용)
  const getCanvasFile = useCallback((): Promise<File | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return Promise.resolve(null);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        resolve(new File([blob], "coloring.png", { type: "image/png" }));
      }, "image/png");
    });
  }, []);

  return {
    canvasRef,
    isImageLoaded,
    canUndo,
    canRedo,
    hasColoredAnything,
    handleCanvasTap,
    handleUndo,
    handleRedo,
    getCanvasDataUrl,
    getCanvasFile,
    getProgress,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _historyVersion: historyVersion,
  };
};

export { useColoringCanvas };
