import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDesignDetail } from "@/hooks/useDesigns";
import { useColoringCanvas } from "@/hooks/useColoringCanvas";
import { useArtworkSave } from "@/hooks/useArtworkSave";
import type { ToolType } from "@/types";

// HSL → HEX 변환
const hslToHex = (h: number, s: number, l: number): string => {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// HEX → HSL 변환 (hue: 0~360, saturation: 0~100, lightness: 0~100)
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const DEFAULT_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7684",
  "#191F28",
];

const MIN_LOADING_MS = 2500;

interface LocationState {
  imageUrl?: string;
  title?: string;
  artworkId?: string;
  savedImageUrl?: string;
  rootArtworkId?: string;
}

const useColoringPlayPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const locationState = (location.state ?? {}) as LocationState;

  const { design: apiDesign, isLoading: isApiLoading } = useDesignDetail(id ?? "");

  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isToolBarCollapsed, setIsToolBarCollapsed] = useState(false);
  const [huePercent, setHuePercent] = useState(0);
  const [brightnessPercent, setBrightnessPercent] = useState(50);

  // 도구 선택 (페인트 / 붓 / 지우개)
  const [activeTool, setActiveTool] = useState<ToolType>("paint");
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);

  // 모드 토글 (색칠 / 확대)
  const [activeMode, setActiveMode] = useState<"color" | "zoom">("color");
  const [isZoomToastVisible, setIsZoomToastVisible] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const zoomToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 뷰포트 컨테이너 ref (팬 클램핑에 사용)
  const viewportRef = useRef<HTMLDivElement>(null);

  // 패닝(드래그 이동) 상태
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const panStartXRef = useRef(0);
  const panStartYRef = useRef(0);

  // 핀치 줌 상태
  const isPinchingRef = useRef(false);
  const pinchStartDistRef = useRef(0);
  const zoomStartRef = useRef(100);

  // useColoringCanvas에 전달할 ref (회전/스케일 역변환용)
  const rotationRef = useRef(0);
  const zoomScaleRef = useRef(1);

  const title = apiDesign?.title ?? locationState.title ?? "도안";
  // 저장된 이미지가 있으면 (이어 그리기) 그걸 우선 사용
  const imageUrl = locationState.savedImageUrl ?? apiDesign?.imageUrl ?? locationState.imageUrl ?? "";
  // 원본 도안 URL — 경계선 감지에 항상 깨끗한 도안 사용 (이어 그리기 시에도)
  const originalImageUrl = apiDesign?.imageUrl ?? locationState.imageUrl ?? "";
  const isLoading = !minLoadingDone || isApiLoading;

  // 모든 이미지(SVG 포함)를 캔버스 래스터화 후 flood fill로 색칠
  const {
    canvasRef,
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
  } = useColoringCanvas(imageUrl, selectedColor, rotationRef, zoomScaleRef, originalImageUrl, activeTool);

  // 작품 생성 및 임시 저장 (이어 그리기 시 기존 artworkId 전달)
  const {
    artworkId,
    handleCreateArtwork,
    handleSaveArtwork,
    isSaving,
  } = useArtworkSave(id ?? "", locationState.artworkId, locationState.rootArtworkId);

  // 이어 그리기(savedImageUrl 존재)면 이미 색칠된 상태이므로 완성 가능
  // artworkId가 존재해야 완성 처리가 가능 (서버에 작품이 생성된 이후)
  const isResuming = !!locationState.savedImageUrl;
  const isCompleteEnabled = (isResuming || hasColoredAnything) && !!artworkId;

  // 최소 2.5초 로딩 보장
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, MIN_LOADING_MS);

    return () => clearTimeout(timer);
  }, []);

  // ref 동기화 — 캔버스 탭 좌표 역변환에 사용
  // 기울이기 비활성화: rotationRef는 항상 0
  // useEffect(() => {
  //   rotationRef.current = rotation;
  // }, [rotation]);

  useEffect(() => {
    const scale = zoomPercent / 100;
    zoomScaleRef.current = scale;

    // 줌 변경 시 팬 값 클램핑 (줌 아웃 시 빈 공간이 보이지 않도록)
    const wrapper = viewportRef.current;
    const parent = wrapper?.parentElement;
    if (wrapper && parent) {
      const elW = wrapper.clientWidth;
      const elH = wrapper.clientHeight;
      const parentW = parent.clientWidth;
      const parentH = parent.clientHeight;
      const maxPanX = Math.max(0, (elW * scale - parentW) / 2);
      const maxPanY = Math.max(0, (elH * scale - parentH) / 2);
      setPanX((prev) => Math.max(-maxPanX, Math.min(maxPanX, prev)));
      setPanY((prev) => Math.max(-maxPanY, Math.min(maxPanY, prev)));
    }
  }, [zoomPercent]);

  // 첫 색칠 시 작품 생성 (색칠 안 하면 작품 미생성)
  useEffect(() => {
    if (!isLoading && !artworkId && id && hasColoredAnything) {
      handleCreateArtwork();
    }
  }, [isLoading, artworkId, id, hasColoredAnything, handleCreateArtwork]);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 뒤로가기 버튼 → 이번 세션에서 색칠한 게 있으면 모달, 없으면 바로 이동
  const handleBack = () => {
    if (hasColoredAnything) {
      setIsBackModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  // 모달에서 "확인" → 임시 저장 후 목록 페이지로 이동 (스크롤 최상단)
  const handleBackConfirm = async () => {
    if (hasColoredAnything) {
      await handleSaveArtwork(getCanvasFile, getProgress);
    }
    navigate("/coloring", { replace: true });
  };

  // 모달에서 "취소" → 모달 닫고 계속 색칠
  const handleBackCancel = () => {
    setIsBackModalOpen(false);
  };

  const handleComplete = async () => {
    // 완성 전 최종 저장 (작품 생성 완료 대기 포함)
    const resolvedId = await handleSaveArtwork(getCanvasFile, getProgress);
    if (!resolvedId) return;

    const completedImageUrl = getCanvasDataUrl();
    navigate(`/coloring/${id}/complete`, {
      state: {
        completedImageUrl,
        title,
        artworkId: resolvedId,
        rootArtworkId: locationState.rootArtworkId,
      },
    });
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
  };

  const handlePalette = () => {
    if (!isPaletteOpen) {
      // 팔레트를 열 때 현재 selectedColor로 슬라이더 동기화
      const { h, l } = hexToHsl(selectedColor);
      setHuePercent((h / 360) * 100);
      setBrightnessPercent(((l - 15) / 70) * 100);
    }
    setIsPaletteOpen((prev) => !prev);
  };

  // hue(0~360) + brightness(0~100 → lightness 15~85)로 팔레트 색상 계산
  const hue = (huePercent / 100) * 360;
  const lightness = 15 + (brightnessPercent / 100) * 70;
  const paletteColor = useMemo(
    () => hslToHex(hue, 100, lightness),
    [hue, lightness],
  );

  // hue 바에서 100% 채도의 기본 색상 (밝기 바 배경용)
  const hueBaseColor = useMemo(() => hslToHex(hue, 100, 50), [hue]);

  const handleHueChange = (percent: number) => {
    setHuePercent(percent);
  };

  const handleBrightnessChange = (percent: number) => {
    setBrightnessPercent(percent);
  };

  const handlePaletteApply = () => {
    setSelectedColor(paletteColor);
    setIsPaletteOpen(false);
  };

  const handlePaletteClose = () => {
    setIsPaletteOpen(false);
  };


  const handleToolChange = useCallback((tool: ToolType) => {
    setActiveTool(tool);
    setIsToolSelectorOpen(false);
  }, []);

  const handleToolIconClick = useCallback(() => {
    setIsToolSelectorOpen((prev) => !prev);
  }, []);

  const handleCollapse = () => {
    setIsToolBarCollapsed((prev) => !prev);
    // 토글 후 화면 바닥으로 스크롤 — 하단 도구 영역이 바로 보이도록
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  };

  // 리셋 버튼 → 색칠한 게 있으면 확인 모달, 없으면 무시
  const handleResetClick = useCallback(() => {
    if (hasColoredAnything) {
      setIsResetModalOpen(true);
    }
  }, [hasColoredAnything]);

  const handleResetConfirm = useCallback(() => {
    handleReset();
    setIsResetModalOpen(false);
  }, [handleReset]);

  const handleResetCancel = useCallback(() => {
    setIsResetModalOpen(false);
  }, []);

  // 모드 전환 — 확대 모드 진입 시 토스트 3초 노출, 색칠 모드 복귀 시 줌/팬 초기화
  const handleModeChange = useCallback((mode: "color" | "zoom") => {
    setActiveMode(mode);

    if (mode === "zoom") {
      setIsZoomToastVisible(true);

      if (zoomToastTimerRef.current) {
        clearTimeout(zoomToastTimerRef.current);
      }
      zoomToastTimerRef.current = setTimeout(() => {
        setIsZoomToastVisible(false);
        zoomToastTimerRef.current = null;
      }, 3000);
    } else {
      setIsZoomToastVisible(false);
      if (zoomToastTimerRef.current) {
        clearTimeout(zoomToastTimerRef.current);
        zoomToastTimerRef.current = null;
      }
    }
  }, []);

  // 토스트 타이머 정리
  useEffect(() => {
    return () => {
      if (zoomToastTimerRef.current) {
        clearTimeout(zoomToastTimerRef.current);
      }
    };
  }, []);

  const ZOOM_MIN = 50;
  const ZOOM_MAX = 200;
  const ZOOM_STEP = 25;

  const handleZoomIn = useCallback(() => {
    setZoomPercent((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomPercent((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));
  }, []);

  // panX/panY의 최신 값을 ref로 유지 — handleDragStart 의존성 제거
  const panXRef = useRef(panX);
  const panYRef = useRef(panY);
  panXRef.current = panX;
  panYRef.current = panY;

  // 드래그 핸들러 — 확대 모드에서 캔버스 패닝 (드래그 이동)
  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartYRef.current = e.clientY;
      panStartXRef.current = panXRef.current;
      panStartYRef.current = panYRef.current;
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    },
    [],
  );

  // 팬 값 클램핑 — 확대된 래퍼가 부모 뷰포트 밖으로 빈 공간이 보이지 않도록 제한
  const clampPan = useCallback(
    (rawPanX: number, rawPanY: number): { x: number; y: number } => {
      const wrapper = viewportRef.current;
      const parent = wrapper?.parentElement;
      if (!wrapper || !parent) return { x: rawPanX, y: rawPanY };

      const scale = zoomScaleRef.current;
      // 래퍼 원본 크기 (CSS transform 미적용 레이아웃 크기)
      const elW = wrapper.clientWidth;
      const elH = wrapper.clientHeight;
      // 부모 뷰포트 크기
      const parentW = parent.clientWidth;
      const parentH = parent.clientHeight;

      // 확대된 래퍼가 뷰포트보다 클 때만 패닝 가능
      const maxPanX = Math.max(0, (elW * scale - parentW) / 2);
      const maxPanY = Math.max(0, (elH * scale - parentH) / 2);

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, rawPanX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, rawPanY)),
      };
    },
    [],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || isPinchingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      const dy = e.clientY - dragStartYRef.current;
      const clamped = clampPan(panStartXRef.current + dx, panStartYRef.current + dy);
      setPanX(clamped.x);
      setPanY(clamped.y);
    },
    [clampPan],
  );

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // 핀치 줌 핸들러 — 두 손가락 터치로 확대/축소
  const getPinchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handlePinchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 2) return;
      isPinchingRef.current = true;
      isDraggingRef.current = false;
      pinchStartDistRef.current = getPinchDistance(e.touches[0], e.touches[1]);
      zoomStartRef.current = zoomPercent;
    },
    [zoomPercent],
  );

  const handlePinchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 2 || !isPinchingRef.current) return;
      const dist = getPinchDistance(e.touches[0], e.touches[1]);
      const ratio = dist / pinchStartDistRef.current;
      const newZoom = Math.round(
        Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomStartRef.current * ratio)),
      );
      setZoomPercent(newZoom);
    },
    [],
  );

  const handlePinchEnd = useCallback(() => {
    isPinchingRef.current = false;
  }, []);

  const zoomScale = zoomPercent / 100;

  // 줌 내부 콘텐츠 스타일 — 뷰포트 안에서 스케일 + 패닝
  const hasTransform = zoomScale !== 1 || panX !== 0 || panY !== 0;
  const zoomContainerStyle: React.CSSProperties = {
    transform: hasTransform
      ? `translate(${panX}px, ${panY}px) scale(${zoomScale})`
      : undefined,
    transformOrigin: "center center",
  };

  return {
    isLoading,
    title,
    imageUrl,
    canvasRef,
    colors: DEFAULT_COLORS,
    selectedColor,
    canUndo,
    canRedo,
    isCompleteEnabled,
    handleBack,
    handleBackConfirm,
    handleBackCancel,
    isBackModalOpen,
    handleComplete,
    handleSelectColor,
    handleCanvasTap,
    handleUndo,
    handleRedo,
    handlePalette,
    handleResetClick,
    handleResetConfirm,
    handleResetCancel,
    isResetModalOpen,
    handleCollapse,
    isToolBarCollapsed,
    isPaletteOpen,
    paletteColor,
    hueBaseColor,
    huePercent,
    brightnessPercent,
    handleHueChange,
    handleBrightnessChange,
    handlePaletteApply,
    handlePaletteClose,
    isSaving,
    activeTool,
    isToolSelectorOpen,
    handleToolChange,
    handleToolIconClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    activeMode,
    handleModeChange,
    isZoomToastVisible,
    zoomPercent,
    handleZoomIn,
    handleZoomOut,
    viewportRef,
    zoomContainerStyle,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handlePinchStart,
    handlePinchMove,
    handlePinchEnd,
  };
};

export { useColoringPlayPage };
