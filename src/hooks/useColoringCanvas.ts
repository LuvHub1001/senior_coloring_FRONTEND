import { useRef, useState, useEffect, useCallback } from "react";
import type { ToolType } from "@/types";

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

// 스캔라인 플러드 필 — 원본 도안 기반 경계 감지 + 멀티패스 갭 닫기 + 후처리
// reusableBuffers: 재사용 가능한 Uint8Array 버퍼 (GC 부담 감소)
const floodFill = (
  imageData: ImageData,
  originalData: Uint8ClampedArray,
  startX: number,
  startY: number,
  fillColor: { r: number; g: number; b: number; a: number },
  tolerance: number,
  lineThreshold: number,
  reusableBuffers?: { visited: Uint8Array; boundary: Uint8Array; closed: Uint8Array },
): boolean => {
  const { data, width, height } = imageData;
  const totalPixels = width * height;
  const startIdx = (startY * width + startX) * 4;
  const startR = data[startIdx];
  const startG = data[startIdx + 1];
  const startB = data[startIdx + 2];
  const startA = data[startIdx + 3];

  // 시작 픽셀이 원본 도안에서 선(어두운 픽셀)이면 채우지 않음
  const origStartIdx = startIdx;
  const origLum = getLuminance(originalData[origStartIdx], originalData[origStartIdx + 1], originalData[origStartIdx + 2]);
  if (origLum < lineThreshold) {
    return false;
  }

  // 이미 같은 색이면 스킵 — 채널별이 아닌 총 색차로 판정하여
  // 후처리로 블렌딩된 픽셀에서 다른 색을 "같은 색"으로 오판하는 것을 방지
  const sameDiff =
    Math.abs(startR - fillColor.r) +
    Math.abs(startG - fillColor.g) +
    Math.abs(startB - fillColor.b);
  if (sameDiff <= 30) {
    return false;
  }

  // 재사용 버퍼 또는 새로 할당 — 크기가 맞으면 초기화 후 재사용
  const hardBoundary = (reusableBuffers && reusableBuffers.boundary.length >= totalPixels)
    ? reusableBuffers.boundary
    : new Uint8Array(totalPixels);
  const closedBoundary = (reusableBuffers && reusableBuffers.closed.length >= totalPixels)
    ? reusableBuffers.closed
    : new Uint8Array(totalPixels);
  const visited = (reusableBuffers && reusableBuffers.visited.length >= totalPixels)
    ? reusableBuffers.visited
    : new Uint8Array(totalPixels);

  // 버퍼 초기화
  hardBoundary.fill(0, 0, totalPixels);
  closedBoundary.fill(0, 0, totalPixels);
  visited.fill(0, 0, totalPixels);

  // 경계 맵 사전 계산 — 원본 도안의 휘도 기반 선 감지
  // 현재 캔버스가 아닌 원본을 참조하므로, 사용자가 칠한 색은 경계로 취급되지 않음
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const lum = getLuminance(originalData[idx], originalData[idx + 1], originalData[idx + 2]);
    if (lum < lineThreshold) {
      hardBoundary[i] = 1;
      closedBoundary[i] = 1;
    }
  }

  // 경계 맵 보강: 멀티패스 갭 닫기 (최대 3px 틈새까지 처리)
  // 각 패스에서 1px 갭을 닫고, 결과를 다음 패스 입력으로 사용
  const GAP_CLOSE_PASSES = 3;

  for (let pass = 0; pass < GAP_CLOSE_PASSES; pass++) {
    // 현재 상태를 기준으로 새 갭 감지
    const prev = new Uint8Array(closedBoundary);
    let changed = false;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pi = y * width + x;
        if (closedBoundary[pi]) continue;

        // 수평 방향: 좌우 모두 경계이면 사이 픽셀도 경계로 처리
        const closedH =
          x > 0 && x < width - 1 && prev[pi - 1] && prev[pi + 1];
        // 수직 방향: 상하 모두 경계이면 사이 픽셀도 경계로 처리
        const closedV =
          y > 0 && y < height - 1 && prev[pi - width] && prev[pi + width];
        // 대각선 방향: 좌상↔우하, 우상↔좌하
        const closedD1 =
          x > 0 && y > 0 && x < width - 1 && y < height - 1 &&
          prev[pi - width - 1] && prev[pi + width + 1];
        const closedD2 =
          x > 0 && y > 0 && x < width - 1 && y < height - 1 &&
          prev[pi - width + 1] && prev[pi + width - 1];

        if (closedH || closedV || closedD1 || closedD2) {
          closedBoundary[pi] = 1;
          changed = true;
        }
      }
    }

    if (!changed) break;
  }

  const canFill = (pixelIdx: number): boolean => {
    if (visited[pixelIdx] || closedBoundary[pixelIdx]) return false;
    const idx = pixelIdx * 4;

    // 조건 1: 시작 픽셀과 색상이 유사하면 채우기 가능 (첫 색칠 + 재색칠)
    if (
      Math.abs(data[idx] - startR) <= tolerance &&
      Math.abs(data[idx + 1] - startG) <= tolerance &&
      Math.abs(data[idx + 2] - startB) <= tolerance &&
      Math.abs(data[idx + 3] - startA) <= tolerance
    ) {
      return true;
    }

    // 조건 2: 원본 비경계 픽셀이고 이미 색칠된 상태면 채우기 가능 (재색칠)
    const origLum = getLuminance(
      originalData[idx], originalData[idx + 1], originalData[idx + 2],
    );
    if (origLum < lineThreshold) return false;

    const diffFromOriginal =
      Math.abs(data[idx] - originalData[idx]) > tolerance ||
      Math.abs(data[idx + 1] - originalData[idx + 1]) > tolerance ||
      Math.abs(data[idx + 2] - originalData[idx + 2]) > tolerance;

    return diffFromOriginal;
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

  // 후처리 1단계: 채워진 영역을 경계선까지 4방향 팽창하여 안티앨리어싱 갭 제거
  // (8방향 대신 4방향으로 제한하여 과도한 팽창 방지)
  const GAP_FILL_ITERATIONS = 3;
  for (let iter = 0; iter < GAP_FILL_ITERATIONS; iter++) {
    let changed = false;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pi = y * width + x;
        if (visited[pi] || hardBoundary[pi]) continue;

        // 4방향 이웃 중 채워진 픽셀이 있는지 확인
        const hasFilledNeighbor =
          (x > 0 && visited[pi - 1]) ||
          (x < width - 1 && visited[pi + 1]) ||
          (y > 0 && visited[pi - width]) ||
          (y < height - 1 && visited[pi + width]);

        if (hasFilledNeighbor) {
          fillPixel(pi);
          changed = true;
        }
      }
    }

    if (!changed) break;
  }

  // 후처리 2단계: 경계선 인접 안티앨리어싱 픽셀에 알파 블렌딩 적용
  // 채워진 영역과 윤곽선 사이의 전환을 자연스럽게 처리
  const BLEND_DARK_LIMIT = 40;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = y * width + x;
      if (visited[pi]) continue;
      if (!hardBoundary[pi]) continue;

      // 경계 픽셀 중 채워진 4방향 이웃이 있는 픽셀만 블렌딩 대상
      const hasFilledNeighbor =
        (x > 0 && visited[pi - 1]) ||
        (x < width - 1 && visited[pi + 1]) ||
        (y > 0 && visited[pi - width]) ||
        (y < height - 1 && visited[pi + width]);

      if (!hasFilledNeighbor) continue;

      const idx = pi * 4;
      const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);

      // 완전히 어두운 선은 블렌딩하지 않고 보존
      if (lum < BLEND_DARK_LIMIT) continue;

      // 휘도에 비례하여 채색 비율 결정 (밝을수록 채색 비율 높음)
      const blendRatio = Math.min((lum - BLEND_DARK_LIMIT) / (lineThreshold - BLEND_DARK_LIMIT), 1);
      data[idx] = Math.round(data[idx] * (1 - blendRatio) + fillColor.r * blendRatio);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - blendRatio) + fillColor.g * blendRatio);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - blendRatio) + fillColor.b * blendRatio);
    }
  }

  return true;
};

const FLOOD_FILL_TOLERANCE = 25;
const LINE_BOUNDARY_THRESHOLD = 180;

const MAX_HISTORY = 50;

// 캔버스 디스플레이 너비 (CSS w-[335px])
const CANVAS_DISPLAY_WIDTH = 335;

const useColoringCanvas = (
  imageUrl: string,
  selectedColor: string,
  rotationRef?: React.RefObject<number>,
  zoomScaleRef?: React.RefObject<number>,
  originalImageUrl?: string,
  activeTool: ToolType = "paint",
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);
  // 원본 도안 데이터 — 경계선 감지 전용 (이어 그리기 시에도 깨끗한 도안 유지)
  const originalDataRef = useRef<Uint8ClampedArray | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 붓/지우개 드로잉 상태
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // 영역 제한 마스크 — 브러시 시작 시 해당 영역만 색칠 허용
  const regionMaskRef = useRef<Uint8Array | null>(null);

  // floodFill 재사용 버퍼 (GC 부담 감소)
  const fillBuffersRef = useRef<{ visited: Uint8Array; boundary: Uint8Array; closed: Uint8Array } | null>(null);

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

      // 원본 도안 이미지를 별도로 로드하여 경계선 감지에 사용
      const origUrl = originalImageUrl ?? imageUrl;
      if (origUrl !== imageUrl && originalImageUrl) {
        const origImg = new Image();
        origImg.crossOrigin = "anonymous";
        origImg.onload = () => {
          // 오프스크린 캔버스에 원본 도안 렌더링
          const offscreen = document.createElement("canvas");
          offscreen.width = canvasW;
          offscreen.height = canvasH;
          const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
          if (offCtx) {
            offCtx.fillStyle = "#FFFFFF";
            offCtx.fillRect(0, 0, canvasW, canvasH);
            offCtx.drawImage(origImg, 0, 0, canvasW, canvasH);
            originalDataRef.current = offCtx.getImageData(0, 0, canvasW, canvasH).data;
          }
          setIsImageLoaded(true);
        };
        origImg.onerror = () => {
          // 원본 로드 실패 시 현재 이미지를 원본으로 사용
          originalDataRef.current = initialData.data;
          setIsImageLoaded(true);
        };
        origImg.src = originalImageUrl;
      } else {
        // 새로 시작하는 경우: 현재 이미지가 곧 원본
        originalDataRef.current = initialData.data;
        setIsImageLoaded(true);
      }
    };

    img.onerror = () => {
      setIsImageLoaded(false);
    };

    img.src = imageUrl;
  }, [imageUrl, originalImageUrl]);

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

  // 리셋: 캔버스를 초기 상태(히스토리 0번)로 되돌림
  const handleReset = useCallback(() => {
    if (historyRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.putImageData(historyRef.current[0], 0, 0);
    historyRef.current = [historyRef.current[0]];
    historyIndexRef.current = 0;
    setHistoryVersion((v) => v + 1);
  }, []);

  // 색칠 진행률 계산 — 매 4번째 픽셀만 샘플링하여 성능 최적화
  const PROGRESS_SAMPLE_STEP = 4;
  const getProgress = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const origData = originalDataRef.current;
    if (!origData) return 0;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;

    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const total = current.width * current.height;
    let fillable = 0;
    let colored = 0;

    const PIXEL_CHANGE_THRESHOLD = 30;

    for (let i = 0; i < total; i += PROGRESS_SAMPLE_STEP) {
      const idx = i * 4;

      // 원본 도안에서 윤곽선(어두운 픽셀)은 색칠 대상이 아니므로 제외
      const origR = origData[idx];
      const origG = origData[idx + 1];
      const origB = origData[idx + 2];
      const origLum = getLuminance(origR, origG, origB);
      if (origLum < LINE_BOUNDARY_THRESHOLD) continue;

      fillable++;

      // 원본 대비 현재 픽셀이 충분히 변했으면 색칠된 것으로 판정
      const curR = current.data[idx];
      const curG = current.data[idx + 1];
      const curB = current.data[idx + 2];
      const diff = Math.abs(curR - origR) + Math.abs(curG - origG) + Math.abs(curB - origB);
      if (diff > PIXEL_CHANGE_THRESHOLD) {
        colored++;
      }
    }

    if (fillable === 0) return 0;
    return Math.min(Math.round((colored / fillable) * 100), 100);
  }, []);

  // 브러시 시작점 기준 영역 마스크 생성 — flood fill과 동일한 경계 감지로 색칠 가능 영역 판별
  const buildRegionMask = useCallback(
    (startX: number, startY: number): Uint8Array | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const origData = originalDataRef.current;
      if (!origData) return null;

      const width = canvas.width;
      const height = canvas.height;
      const totalPixels = width * height;

      // 시작점이 윤곽선 위이면 마스크 생성 불가
      const startIdx = (startY * width + startX) * 4;
      const startLum = getLuminance(origData[startIdx], origData[startIdx + 1], origData[startIdx + 2]);
      if (startLum < LINE_BOUNDARY_THRESHOLD) return null;

      // 경계 맵 구축 (원본 도안 기준)
      const boundary = new Uint8Array(totalPixels);
      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        const lum = getLuminance(origData[idx], origData[idx + 1], origData[idx + 2]);
        if (lum < LINE_BOUNDARY_THRESHOLD) {
          boundary[i] = 1;
        }
      }

      // 멀티패스 갭 닫기 (floodFill과 동일한 로직)
      const GAP_CLOSE_PASSES = 3;
      for (let pass = 0; pass < GAP_CLOSE_PASSES; pass++) {
        const prev = new Uint8Array(boundary);
        let changed = false;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pi = y * width + x;
            if (boundary[pi]) continue;
            const closedH = x > 0 && x < width - 1 && prev[pi - 1] && prev[pi + 1];
            const closedV = y > 0 && y < height - 1 && prev[pi - width] && prev[pi + width];
            const closedD1 = x > 0 && y > 0 && x < width - 1 && y < height - 1 && prev[pi - width - 1] && prev[pi + width + 1];
            const closedD2 = x > 0 && y > 0 && x < width - 1 && y < height - 1 && prev[pi - width + 1] && prev[pi + width - 1];
            if (closedH || closedV || closedD1 || closedD2) {
              boundary[pi] = 1;
              changed = true;
            }
          }
        }
        if (!changed) break;
      }

      // 스캔라인 flood fill로 마스크 생성
      const mask = new Uint8Array(totalPixels);
      const stack: number[] = [startX, startY];

      while (stack.length > 0) {
        const y = stack.pop()!;
        let x = stack.pop()!;
        while (x > 0 && !boundary[y * width + x - 1] && !mask[y * width + x - 1]) x--;

        let spanAbove = false;
        let spanBelow = false;

        while (x < width) {
          const pi = y * width + x;
          if (boundary[pi] || mask[pi]) break;

          mask[pi] = 1;

          if (y > 0) {
            if (!boundary[(y - 1) * width + x] && !mask[(y - 1) * width + x]) {
              if (!spanAbove) { stack.push(x, y - 1); spanAbove = true; }
            } else { spanAbove = false; }
          }
          if (y < height - 1) {
            if (!boundary[(y + 1) * width + x] && !mask[(y + 1) * width + x]) {
              if (!spanBelow) { stack.push(x, y + 1); spanBelow = true; }
            } else { spanBelow = false; }
          }
          x++;
        }
      }

      return mask;
    },
    [],
  );

  // 포인터 이벤트 좌표 → 캔버스 픽셀 좌표 변환
  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const currentRotation = rotationRef?.current ?? 0;
      const currentScale = zoomScaleRef?.current ?? 1;

      let x: number;
      let y: number;

      if (currentRotation === 0 && currentScale === 1) {
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        x = Math.floor((clientX - rect.left) * scaleX);
        y = Math.floor((clientY - rect.top) * scaleY);
      } else {
        const displayW = CANVAS_DISPLAY_WIDTH;
        const displayH = canvas.height * (displayW / canvas.width);
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const rad = -currentRotation * (Math.PI / 180);
        const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
        const ux = rx / currentScale;
        const uy = ry / currentScale;
        x = Math.floor((ux / displayW + 0.5) * canvas.width);
        y = Math.floor((uy / displayH + 0.5) * canvas.height);
      }

      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return null;
      return { x, y };
    },
    [],
  );

  // 붓/지우개 브러시 크기 (캔버스 내부 픽셀 기준)
  const BRUSH_RADIUS = 8;

  // 두 점 사이를 보간하며 원형 브러시 스트로크 그리기
  // bounding box 기반으로 필요한 영역만 getImageData/putImageData 수행
  const drawStroke = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      from: { x: number; y: number },
      to: { x: number; y: number },
      tool: ToolType,
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const origData = originalDataRef.current;
      if (!origData) return;

      const canvasW = canvas.width;
      const canvasH = canvas.height;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(Math.ceil(dist / 2), 1);

      // 스트로크 영역의 bounding box 계산
      const minX = Math.max(0, Math.min(from.x, to.x) - BRUSH_RADIUS);
      const minY = Math.max(0, Math.min(from.y, to.y) - BRUSH_RADIUS);
      const maxX = Math.min(canvasW - 1, Math.max(from.x, to.x) + BRUSH_RADIUS);
      const maxY = Math.min(canvasH - 1, Math.max(from.y, to.y) + BRUSH_RADIUS);
      const regionW = maxX - minX + 1;
      const regionH = maxY - minY + 1;

      if (regionW <= 0 || regionH <= 0) return;

      const imageData = ctx.getImageData(minX, minY, regionW, regionH);
      const { data } = imageData;

      if (tool === "brush") {
        // 붓: 선택한 색상으로 그리기 (원본 도안의 선은 보존 + 영역 마스크 제한)
        const color = hexToRgba(selectedColor);
        const mask = regionMaskRef.current;

        for (let s = 0; s <= steps; s++) {
          const t = steps === 0 ? 0 : s / steps;
          const cx = Math.round(from.x + dx * t);
          const cy = Math.round(from.y + dy * t);

          for (let ry = -BRUSH_RADIUS; ry <= BRUSH_RADIUS; ry++) {
            for (let rx = -BRUSH_RADIUS; rx <= BRUSH_RADIUS; rx++) {
              if (rx * rx + ry * ry > BRUSH_RADIUS * BRUSH_RADIUS) continue;
              const px = cx + rx;
              const py = cy + ry;
              if (px < minX || px > maxX || py < minY || py > maxY) continue;
              // 영역 마스크가 있으면 해당 영역 내 픽셀만 허용
              if (mask && !mask[py * canvasW + px]) continue;
              // 원본 도안에서 경계선(어두운 픽셀)이면 건너뜀
              const origIdx = (py * canvasW + px) * 4;
              const lum = getLuminance(origData[origIdx], origData[origIdx + 1], origData[origIdx + 2]);
              if (lum < LINE_BOUNDARY_THRESHOLD) continue;
              // 로컬 영역 좌표로 변환
              const localIdx = ((py - minY) * regionW + (px - minX)) * 4;
              data[localIdx] = color.r;
              data[localIdx + 1] = color.g;
              data[localIdx + 2] = color.b;
              data[localIdx + 3] = color.a;
            }
          }
        }
      } else if (tool === "eraser") {
        // 지우개: 원본 도안 픽셀로 복원
        for (let s = 0; s <= steps; s++) {
          const t = steps === 0 ? 0 : s / steps;
          const cx = Math.round(from.x + dx * t);
          const cy = Math.round(from.y + dy * t);

          for (let ry = -BRUSH_RADIUS; ry <= BRUSH_RADIUS; ry++) {
            for (let rx = -BRUSH_RADIUS; rx <= BRUSH_RADIUS; rx++) {
              if (rx * rx + ry * ry > BRUSH_RADIUS * BRUSH_RADIUS) continue;
              const px = cx + rx;
              const py = cy + ry;
              if (px < minX || px > maxX || py < minY || py > maxY) continue;
              const origIdx = (py * canvasW + px) * 4;
              const localIdx = ((py - minY) * regionW + (px - minX)) * 4;
              data[localIdx] = origData[origIdx];
              data[localIdx + 1] = origData[origIdx + 1];
              data[localIdx + 2] = origData[origIdx + 2];
              data[localIdx + 3] = origData[origIdx + 3];
            }
          }
        }
      }

      ctx.putImageData(imageData, minX, minY);
    },
    [selectedColor],
  );

  // 히스토리 스냅샷 저장 (붓/지우개 스트로크 완료 시)
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    newHistory.push(snapshot);

    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setHistoryVersion((v) => v + 1);
  }, []);

  // 캔버스 클릭 → 플러드 필 (페인트 도구)
  const handleCanvasTap = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (activeTool !== "paint") return;

      const canvas = canvasRef.current;
      if (!canvas || !isImageLoaded) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (!coords) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const originalData = originalDataRef.current;
      if (!originalData) return;

      const fillColor = hexToRgba(selectedColor);
      // 재사용 버퍼 크기 확인 및 필요 시 재할당
      const totalPixels = canvas.width * canvas.height;
      if (!fillBuffersRef.current || fillBuffersRef.current.visited.length < totalPixels) {
        fillBuffersRef.current = {
          visited: new Uint8Array(totalPixels),
          boundary: new Uint8Array(totalPixels),
          closed: new Uint8Array(totalPixels),
        };
      }

      const filled = floodFill(imageData, originalData, coords.x, coords.y, fillColor, FLOOD_FILL_TOLERANCE, LINE_BOUNDARY_THRESHOLD, fillBuffersRef.current);

      if (filled) {
        ctx.putImageData(imageData, 0, 0);
        saveSnapshot();
      }
    },
    [selectedColor, isImageLoaded, activeTool, getCanvasCoords, saveSnapshot],
  );

  // 붓/지우개 포인터 이벤트 핸들러
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (activeTool === "paint") return;
      if (!isImageLoaded) return;

      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (!coords) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      isDrawingRef.current = true;
      lastPosRef.current = coords;

      // 브러시 도구일 때 시작점 기준 영역 마스크 생성
      if (activeTool === "brush") {
        regionMaskRef.current = buildRegionMask(coords.x, coords.y);
      } else {
        regionMaskRef.current = null;
      }

      // 첫 점 찍기
      drawStroke(ctx, coords, coords, activeTool);

      // 포인터 캡처로 캔버스 밖 이동도 추적
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [activeTool, isImageLoaded, getCanvasCoords, drawStroke, buildRegionMask],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current || !lastPosRef.current) return;
      if (activeTool === "paint") return;

      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (!coords) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      drawStroke(ctx, lastPosRef.current, coords, activeTool);
      lastPosRef.current = coords;
    },
    [activeTool, getCanvasCoords, drawStroke],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;
    lastPosRef.current = null;
    regionMaskRef.current = null;

    // 스트로크 완료 후 히스토리에 저장
    saveSnapshot();
  }, [saveSnapshot]);

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
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleUndo,
    handleRedo,
    handleReset,
    getCanvasDataUrl,
    getCanvasFile,
    getProgress,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _historyVersion: historyVersion,
  };
};

export { useColoringCanvas };
