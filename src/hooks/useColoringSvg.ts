import { useRef, useState, useEffect, useCallback } from "react";

const MAX_HISTORY = 50;
const SHAPE_SELECTOR = "path, polygon, ellipse, circle, rect";

interface FillAction {
  colorIndex: number;
  previousFill: string;
  newFill: string;
}

// SVG 패스 기반 색칠 훅 — 벡터 품질의 깔끔한 경계선 유지
const useColoringSvg = (imageUrl: string, selectedColor: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const historyRef = useRef<FillAction[]>([]);
  const historyIndexRef = useRef(-1);
  const [historyVersion, setHistoryVersion] = useState(0);
  const selectedColorRef = useRef(selectedColor);

  // selectedColor를 ref로 동기화 (이벤트 핸들러 내에서 최신 값 참조)
  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  const canUndo = historyIndexRef.current >= 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;
  const hasColoredAnything = historyIndexRef.current >= 0;

  // SVG 페치 및 인라인 DOM 구성
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !imageUrl) {
      setIsImageLoaded(false);
      return;
    }

    const abortController = new AbortController();

    const loadSvg = async () => {
      try {
        const response = await fetch(imageUrl, {
          signal: abortController.signal,
          mode: "cors",
        });
        const text = await response.text();

        if (!text.includes("<svg")) {
          setIsImageLoaded(false);
          return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg) {
          setIsImageLoaded(false);
          return;
        }

        container.innerHTML = "";

        const importedSvg = document.importNode(svg, true) as SVGSVGElement;
        importedSvg.setAttribute("width", "100%");
        importedSvg.setAttribute("height", "100%");
        importedSvg.style.display = "block";

        // viewBox 보존 (없으면 원본 width/height로 생성)
        if (!importedSvg.getAttribute("viewBox")) {
          const w = parseFloat(importedSvg.getAttribute("width") || "670");
          const h = parseFloat(importedSvg.getAttribute("height") || "670");
          importedSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        }

        // 모든 shape 요소에 인덱스 부여
        const shapes = importedSvg.querySelectorAll(SHAPE_SELECTOR);
        let colorIndex = 0;

        shapes.forEach((shape) => {
          // 최상위 배경 rect 건너뛰기 (흰색 배경)
          if (
            shape.tagName === "rect" &&
            shape.parentElement === importedSvg &&
            colorIndex === 0
          ) {
            const fill = shape.getAttribute("fill");
            if (
              fill === "white" ||
              fill === "#FFFFFF" ||
              fill === "#ffffff" ||
              fill === "#fff"
            ) {
              return;
            }
          }

          shape.setAttribute("data-color-index", String(colorIndex));
          (shape as SVGElement).style.cursor = "pointer";
          colorIndex++;
        });

        container.appendChild(importedSvg);

        // 히스토리 초기화
        historyRef.current = [];
        historyIndexRef.current = -1;
        setHistoryVersion(0);
        setIsImageLoaded(true);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setIsImageLoaded(false);
        }
      }
    };

    loadSvg();

    return () => abortController.abort();
  }, [imageUrl]);

  // data-color-index로 DOM 요소 찾기
  const findElement = useCallback(
    (colorIndex: number): SVGElement | null => {
      const container = containerRef.current;
      if (!container) return null;
      return container.querySelector(`[data-color-index="${colorIndex}"]`);
    },
    [],
  );

  // SVG path 클릭 → 색칠
  const handleSvgClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as SVGElement;
      const indexStr = target.getAttribute("data-color-index");
      if (indexStr === null) return;

      const colorIndex = Number(indexStr);
      const previousFill = target.getAttribute("fill") || "";
      const newFill = selectedColorRef.current;

      // 같은 색이면 스킵
      if (previousFill === newFill) return;

      target.setAttribute("fill", newFill);

      // 히스토리 추가 (현재 위치 이후 히스토리 제거)
      const newHistory = historyRef.current.slice(
        0,
        historyIndexRef.current + 1,
      );
      newHistory.push({ colorIndex, previousFill, newFill });
      if (newHistory.length > MAX_HISTORY) newHistory.shift();

      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      setHistoryVersion((v) => v + 1);
    },
    [],
  );

  // 실행 취소
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current < 0) return;

    const action = historyRef.current[historyIndexRef.current];
    const el = findElement(action.colorIndex);
    if (el) el.setAttribute("fill", action.previousFill);

    historyIndexRef.current -= 1;
    setHistoryVersion((v) => v + 1);
  }, [findElement]);

  // 다시 실행
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    historyIndexRef.current += 1;
    const action = historyRef.current[historyIndexRef.current];
    const el = findElement(action.colorIndex);
    if (el) el.setAttribute("fill", action.newFill);

    setHistoryVersion((v) => v + 1);
  }, [findElement]);

  // 색칠 진행률 계산 (색칠된 path 수 / 전체 path 수)
  const getProgress = useCallback((): number => {
    const container = containerRef.current;
    if (!container) return 0;

    const shapes = container.querySelectorAll("[data-color-index]");
    let fillable = 0;
    let colored = 0;

    shapes.forEach((shape) => {
      fillable++;
      const fill = shape.getAttribute("fill");
      const isUncolored =
        !fill ||
        fill === "none" ||
        fill === "white" ||
        fill === "#FFFFFF" ||
        fill === "#ffffff" ||
        fill === "#fff";
      if (!isUncolored) colored++;
    });

    if (fillable === 0) return 0;
    return Math.min(Math.round((colored / fillable) * 100), 100);
  }, []);

  // SVG → Data URL 변환 (완성 화면용)
  const getCanvasDataUrl = useCallback((): string => {
    const container = containerRef.current;
    if (!container) return "";

    const svg = container.querySelector("svg");
    if (!svg) return "";

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${encoded}`;
  }, []);

  // SVG → PNG File 변환 (서버 저장용 — 래스터화)
  const getCanvasFile = useCallback((): Promise<File | null> => {
    const container = containerRef.current;
    if (!container) return Promise.resolve(null);

    const svg = container.querySelector("svg");
    if (!svg) return Promise.resolve(null);

    return new Promise((resolve) => {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        // viewBox에서 비율 가져와 캔버스 크기 결정
        const viewBox = svg.getAttribute("viewBox");
        let canvasW = 670;
        let canvasH = 670;

        if (viewBox) {
          const parts = viewBox.split(/[\s,]+/).map(Number);
          if (parts.length === 4) {
            const [, , vbW, vbH] = parts;
            const scale = Math.min(670 / vbW, 670 / vbH);
            canvasW = Math.round(vbW * scale);
            canvasH = Math.round(vbH * scale);
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasW, canvasH);
        ctx.drawImage(img, 0, 0, canvasW, canvasH);

        URL.revokeObjectURL(url);

        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            resolve(null);
            return;
          }
          resolve(new File([pngBlob], "coloring.png", { type: "image/png" }));
        }, "image/png");
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    });
  }, []);

  return {
    containerRef,
    isImageLoaded,
    canUndo,
    canRedo,
    hasColoredAnything,
    handleSvgClick,
    handleUndo,
    handleRedo,
    getCanvasDataUrl,
    getCanvasFile,
    getProgress,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _historyVersion: historyVersion,
  };
};

export { useColoringSvg };
