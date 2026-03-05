import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

// 임시 도안 데이터 (추후 API 연동 시 교체)
const MOCK_DESIGNS: Record<string, { title: string; imageUrl: string }> = {
  "1": { title: "연꽃", imageUrl: "" },
  "2": { title: "고양이", imageUrl: "" },
  "3": { title: "앵무새", imageUrl: "" },
  "4": { title: "난초", imageUrl: "" },
  "5": { title: "호랑이", imageUrl: "" },
  "6": { title: "장미", imageUrl: "" },
};

const MIN_LOADING_MS = 2500;

const useColoringPlayPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isToolBarCollapsed, setIsToolBarCollapsed] = useState(false);
  const [huePercent, setHuePercent] = useState(0);
  const [brightnessPercent, setBrightnessPercent] = useState(50);

  const design = MOCK_DESIGNS[id ?? ""] ?? { title: "도안", imageUrl: "" };

  // 최소 2.5초 로딩 보장
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, MIN_LOADING_MS);

    return () => clearTimeout(timer);
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < colorHistory.length - 1;
  const isCompleteEnabled = colorHistory.length > 0;

  const handleBack = () => {
    navigate(-1);
  };

  const handleComplete = () => {
    navigate(`/coloring/${id}/complete`);
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
  };

  // 색칠 행위를 히스토리에 기록 (추후 캔버스 연동 시 사용)
  const handleColorApply = useCallback(() => {
    const newHistory = colorHistory.slice(0, historyIndex + 1);
    newHistory.push(selectedColor);
    setColorHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [colorHistory, historyIndex, selectedColor]);

  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex((prev) => prev + 1);
    }
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
    title: design.title,
    imageUrl: design.imageUrl,
    colors: DEFAULT_COLORS,
    selectedColor,
    canUndo,
    canRedo,
    isCompleteEnabled,
    handleBack,
    handleComplete,
    handleSelectColor,
    handleColorApply,
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
