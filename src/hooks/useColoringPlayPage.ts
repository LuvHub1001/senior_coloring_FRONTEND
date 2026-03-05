import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDesignDetail } from "@/hooks/useDesigns";
import { useColoringCanvas } from "@/hooks/useColoringCanvas";

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
];

const MIN_LOADING_MS = 2500;

interface LocationState {
  imageUrl?: string;
  title?: string;
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

  const title = apiDesign?.title ?? locationState.title ?? "도안";
  const imageUrl = apiDesign?.imageUrl ?? locationState.imageUrl ?? "";
  const isLoading = !minLoadingDone || isApiLoading;

  // 캔버스 색칠 로직
  const {
    canvasRef,
    canUndo,
    canRedo,
    hasColoredAnything,
    handleCanvasTap,
    handleUndo,
    handleRedo,
    getCanvasDataUrl,
  } = useColoringCanvas(imageUrl, selectedColor);

  const isCompleteEnabled = hasColoredAnything;

  // 최소 2.5초 로딩 보장
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, MIN_LOADING_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleComplete = () => {
    const completedImageUrl = getCanvasDataUrl();
    navigate(`/coloring/${id}/complete`, {
      state: { completedImageUrl, title },
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

  const handleGuide = () => {
    // 추후 안내 모달 표시
  };

  const handleCollapse = () => {
    setIsToolBarCollapsed((prev) => !prev);
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
    handleComplete,
    handleSelectColor,
    handleCanvasTap,
    handleUndo,
    handleRedo,
    handlePalette,
    handleGuide,
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
  };
};

export { useColoringPlayPage };
