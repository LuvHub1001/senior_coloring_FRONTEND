import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDesignList } from "@/hooks/useDesigns";
import { getArtworks, deleteArtwork } from "@/apis/ArtworkFetcher";
import type { Artwork } from "@/types";

const CATEGORIES = ["전체", "식물", "동물", "풍경", "사물"];

const useColoringBookPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // 카테고리 필터링: "전체"면 undefined로 전달하여 전체 조회
  const categoryParam = selectedCategory === "전체" ? undefined : selectedCategory;
  const { designs } = useDesignList(categoryParam);

  // 진행중인 작품 목록 조회
  const { data: artworksData } = useQuery({
    queryKey: ["artworks", "IN_PROGRESS"],
    queryFn: () => getArtworks("IN_PROGRESS"),
  });

  // 같은 도안은 가장 최근 작품만 표시 (진행률 0%는 제외)
  const inProgressArtworks = (artworksData?.data ?? [])
    .filter((artwork) => artwork.progress > 0)
    .reduce<Artwork[]>(
      (acc, artwork) => {
        const existing = acc.find((a) => a.designId === artwork.designId);
        if (!existing) {
          acc.push(artwork);
        } else if (new Date(artwork.updatedAt) > new Date(existing.updatedAt)) {
          acc[acc.indexOf(existing)] = artwork;
        }
        return acc;
      },
      [],
    );

  // 작품 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArtwork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      setSelectedArtwork(null);
      setIsMoreMenuOpen(false);
    },
  });

  // ProgressSection에 전달할 데이터 매핑
  const progressItems = inProgressArtworks.map((artwork) => ({
    id: artwork.id,
    thumbnail: artwork.imageUrl ?? artwork.design.imageUrl,
    title: artwork.design.title,
    progress: artwork.progress,
  }));

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

  // 진행중 카드 클릭 → 프리뷰 모달 열기
  const handleProgressItemClick = (id: string) => {
    const artwork = inProgressArtworks.find((a) => a.id === id);
    if (artwork) {
      setSelectedArtwork(artwork);
    }
  };

  const handleClosePreview = () => {
    setSelectedArtwork(null);
    setIsMoreMenuOpen(false);
  };

  // 이어 그리기 → 저장된 이미지로 색칠 페이지 이동
  const handleContinueColoring = () => {
    if (!selectedArtwork) return;
    navigate(`/coloring/${selectedArtwork.designId}`, {
      state: {
        artworkId: selectedArtwork.id,
        savedImageUrl: selectedArtwork.imageUrl,
        title: selectedArtwork.design.title,
        imageUrl: selectedArtwork.design.imageUrl,
      },
    });
  };

  const handleExhibit = () => {
    // TODO: 전시하기 기능
  };

  const handleToggleMoreMenu = () => {
    setIsMoreMenuOpen((prev) => !prev);
  };

  const handleDeleteArtwork = () => {
    if (!selectedArtwork) return;
    deleteMutation.mutate(selectedArtwork.id);
  };

  const handleShareArtwork = () => {
    // TODO: 공유하기 기능
    setIsMoreMenuOpen(false);
  };

  const handleColoringItemClick = (id: string) => {
    const design = filteredItems.find((item) => item.id === id);
    navigate(`/coloring/${id}`, {
      state: { imageUrl: design?.imageUrl, title: design?.title },
    });
  };

  return {
    categories: CATEGORIES,
    selectedCategory,
    progressItems,
    filteredItems,
    selectedArtwork,
    isMoreMenuOpen,
    handleBack,
    handleCategorySelect,
    handleProgressItemClick,
    handleColoringItemClick,
    handleClosePreview,
    handleContinueColoring,
    handleExhibit,
    handleToggleMoreMenu,
    handleDeleteArtwork,
    handleShareArtwork,
  };
};

export { useColoringBookPage };
