import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDesignList } from "@/hooks/useDesigns";
import type { ProgressItem } from "@/types";

const CATEGORIES = ["전체", "식물", "동물", "풍경", "사물"];

const useColoringBookPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 카테고리 필터링: "전체"면 undefined로 전달하여 전체 조회
  const categoryParam = selectedCategory === "전체" ? undefined : selectedCategory;
  const { designs, isLoading: isDesignsLoading } = useDesignList(categoryParam);

  // API 응답을 기존 ColoringItemData 형태로 매핑
  const filteredItems = designs.map((design) => ({
    id: design.id,
    imageUrl: design.imageUrl,
    title: design.title,
    category: design.category,
  }));

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
    isDesignsLoading,
    progressItems: [] as ProgressItem[],
    filteredItems,
    handleBack,
    handleCategorySelect,
    handleProgressItemClick,
    handleColoringItemClick,
  };
};

export { useColoringBookPage };
