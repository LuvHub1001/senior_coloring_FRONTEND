import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ProgressItem, ColoringItemData } from "@/types";

const CATEGORIES = ["전체", "식물", "동물", "풍경", "사물"];

// 임시 데이터 (추후 API 연동 시 교체)
const PROGRESS_ITEMS: ProgressItem[] = [
  { id: "1", thumbnail: "", title: "연꽃", progress: 50 },
  { id: "2", thumbnail: "", title: "호랑이", progress: 0 },
];

const COLORING_ITEMS: ColoringItemData[] = [
  { id: "1", imageUrl: "", title: "연꽃", category: "식물" },
  { id: "2", imageUrl: "", title: "고양이", category: "동물" },
  { id: "3", imageUrl: "", title: "앵무새", category: "동물" },
  { id: "4", imageUrl: "", title: "난초", category: "식물" },
  { id: "5", imageUrl: "", title: "호랑이", category: "동물" },
  { id: "6", imageUrl: "", title: "장미", category: "식물" },
];

const useColoringBookPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 카테고리 필터링된 도안 목록
  const filteredItems = useMemo(() => {
    if (selectedCategory === "전체") {
      return COLORING_ITEMS;
    }
    return COLORING_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProgressItemClick = (id: string) => {
    navigate(`/coloring/${id}`);
  };

  const handleColoringItemClick = (id: string) => {
    navigate(`/coloring/${id}`);
  };

  return {
    categories: CATEGORIES,
    selectedCategory,
    progressItems: PROGRESS_ITEMS,
    filteredItems,
    handleBack,
    handleCategorySelect,
    handleProgressItemClick,
    handleColoringItemClick,
  };
};

export { useColoringBookPage };
