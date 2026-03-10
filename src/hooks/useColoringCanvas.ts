import { useRef, useState, useEffect, useCallback } from "react";

// HEX → RGBA 변환
const hexToRgba = (hex: string): { r: number; g: number; b: number; a: number } => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, a: 255 };
};

// 픽셀 휘도 계산 (ITU-R BT.601 가중치)
const getLuminance = (r: number, g: number, b: number): number =>
  0.299 * r + 0.587 * g + 0.114 * b;

// 스캔라인 플러드 필 — 경계 감지 + 색상 매칭 + 갭 채우기 후처리
const floodFill = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: { r: number; g: number; b: number; a: number },
  tolerance: number,
  lineThreshold: number,
): boolean => {
  const { data, width, height } = imageData;
  const totalPixels = width * height;
  const startIdx = (startY * width + startX) * 4;
  const startR = data[startIdx];
  const startG = data[startIdx + 1];
  const startB = data[startIdx + 2];
  const startA = data[startIdx + 3];

  // 시작 픽셀이 선(어두운 픽셀)이면 채우지 않음
  const startLum = getLuminance(startR, startG, startB);
  if (startLum < lineThreshold) {
    return false;
  }

  // 이미 같은 색이면 스킵
  if (
    Math.abs(startR - fillColor.r) <= tolerance &&
    Math.abs(startG - fillColor.g) <= tolerance &&
    Math.abs(startB - fillColor.b) <= tolerance &&
    Math.abs(startA - fillColor.a) <= tolerance
  ) {
    return false;
  }

  // 경계 맵 사전 계산 — 휘도 기반 선 감지
  const hardBoundary = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);
    if (lum < lineThreshold) {
      hardBoundary[i] = 1;
    }
  }

  // 경계 맵 보강: 1px 틈새 닫기 (수평/수직 방향 경계 사이 빈 픽셀 메우기)
  // 얇은 선의 미세한 끊김으로 인한 색 번짐 방지
  const closedBoundary = new Uint8Array(hardBoundary);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = y * width + x;
      if (closedBoundary[pi]) continue;

      // 수평 방향: 좌우 모두 경계이면 사이 픽셀도 경계로 처리
      const closedH =
        x > 0 && x < width - 1 && hardBoundary[pi - 1] && hardBoundary[pi + 1];
      // 수직 방향: 상하 모두 경계이면 사이 픽셀도 경계로 처리
      const closedV =
        y > 0 && y < height - 1 && hardBoundary[pi - width] && hardBoundary[pi + width];

      if (closedH || closedV) {
        closedBoundary[pi] = 1;
      }
    }
  }

  const visited = new Uint8Array(totalPixels);

  const canFill = (pixelIdx: number): boolean => {
    if (visited[pixelIdx] || closedBoundary[pixelIdx]) return false;
    const idx = pixelIdx * 4;
    // 시작 픽셀과 색상 유사성 확인
    return (
      Math.abs(data[idx] - startR) <= tolerance &&
      Math.abs(data[idx + 1] - startG) <= tolerance &&
      Math.abs(data[idx + 2] - startB) <= tolerance &&
      Math.abs(data[idx + 3] - startA) <= tolerance
    );
  };

  const fillPixel = (pixelIdx: number) => {
    visited[pixelIdx] = 1;
    const idx = pixelIdx * 4;
    data[idx] = fillColor.r;
    data[idx + 1] = fillColor.g;
    data[idx + 2] = fillColor.b;
    data[idx + 3] = fillColor.a;
  };

  // 스캔라인 기반: 행 단위로 처리하여 스택 사용량 감소 및 캐시 효율 향상
  const stack: number[] = [startX, startY];

  while (stack.length > 0) {
    const y = stack.pop()!;
    let x = stack.pop()!;

    // 왼쪽 끝으로 이동
    while (x > 0 && canFill(y * width + x - 1)) x--;

    let spanAbove = false;
    let spanBelow = false;

    // 왼쪽에서 오른쪽으로 스캔하며 채우기
    while (x < width) {
      const pi = y * width + x;
      if (!canFill(pi)) break;

      fillPixel(pi);

      // 위쪽 행 체크
      if (y > 0) {
        if (canFill((y - 1) * width + x)) {
          if (!spanAbove) {
            stack.push(x, y - 1);
            spanAbove = true;
          }
        } else {
          spanAbove = false;
        }
      }

      // 아래쪽 행 체크
      if (y < height - 1) {
        if (canFill((y + 1) * width + x)) {
          if (!spanBelow) {
            stack.push(x, y + 1);
            spanBelow = true;
          }
        } else {
          spanBelow = false;
        }
      }

      x++;
    }
  }

  // 후처리 1단계: 채워진 영역을 경계선까지 8방향 팽창하여 안티앨리어싱 갭 제거
  const GAP_FILL_ITERATIONS = 6;
  for (let iter = 0; iter < GAP_FILL_ITERATIONS; iter++) {
    let changed = false;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pi = y * width + x;
        if (visited[pi] || hardBoundary[pi]) continue;

        // 8방향 이웃 중 채워진 픽셀이 있는지 확인 (대각선 포함)
        const hasFilledNeighbor =
          (x > 0 && visited[pi - 1]) ||
          (x < width - 1 && visited[pi + 1]) ||
          (y > 0 && visited[pi - width]) ||
          (y < height - 1 && visited[pi + width]) ||
          (x > 0 && y > 0 && visited[pi - width - 1]) ||
          (x < width - 1 && y > 0 && visited[pi - width + 1]) ||
          (x > 0 && y < height - 1 && visited[pi + width - 1]) ||
          (x < width - 1 && y < height - 1 && visited[pi + width + 1]);

        if (hasFilledNeighbor) {
          fillPixel(pi);
          changed = true;
        }
      }
    }

    if (!changed) break;
  }

  // 후처리 2단계: 경계선 인접 안티앨리어싱 픽셀에 알파 블렌딩 적용 (8방향 탐색)
  // 채워진 영역과 윤곽선 사이의 전환을 자연스럽게 처리
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = y * width + x;
      if (visited[pi]) continue;
      if (!hardBoundary[pi]) continue;

      // 경계 픽셀 중 채워진 8방향 이웃이 있는 픽셀만 블렌딩 대상
      const hasFilledNeighbor =
        (x > 0 && visited[pi - 1]) ||
        (x < width - 1 && visited[pi + 1]) ||
        (y > 0 && visited[pi - width]) ||
        (y < height - 1 && visited[pi + width]) ||
        (x > 0 && y > 0 && visited[pi - width - 1]) ||
        (x < width - 1 && y > 0 && visited[pi - width + 1]) ||
        (x > 0 && y < height - 1 && visited[pi + width - 1]) ||
        (x < width - 1 && y < height - 1 && visited[pi + width + 1]);

      if (!hasFilledNeighbor) continue;

      const idx = pi * 4;
      const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);

      // 완전히 어두운 선(lum < 40)은 블렌딩하지 않고 보존
      if (lum < 40) continue;

      // 휘도에 비례하여 채색 비율 결정 (밝을수록 채색 비율 높음)
      const blendRatio = Math.min((lum - 40) / (lineThreshold - 40), 1);
      data[idx] = Math.round(data[idx] * (1 - blendRatio) + fillColor.r * blendRatio);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - blendRatio) + fillColor.g * blendRatio);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - blendRatio) + fillColor.b * blendRatio);
    }
  }

  return true;
};

const FLOOD_FILL_TOLERANCE = 55;
const LINE_BOUNDARY_THRESHOLD = 110;
const ANTI_ALIAS_THRESHOLD = 180;
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
      const filled = floodFill(imageData, x, y, fillColor, FLOOD_FILL_TOLERANCE, LINE_BOUNDARY_THRESHOLD);

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

  // 색칠 진행률 계산 (색칠 가능 영역 대비 색칠된 비율)
  const getProgress = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const total = width * height;
    let fillable = 0;
    let colored = 0;

    for (let i = 0; i < total; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = getLuminance(r, g, b);

      // 윤곽선(어두운 픽셀)과 안티앨리어싱 회색 영역은 집계에서 제외
      if (lum < ANTI_ALIAS_THRESHOLD) continue;

      fillable++;

      // 흰색 계열이 아닌 픽셀 = 색칠된 픽셀
      const isWhite = r > 230 && g > 230 && b > 230;
      if (!isWhite) {
        colored++;
      }
    }

    if (fillable === 0) return 0;
    return Math.min(Math.round((colored / fillable) * 100), 100);
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
