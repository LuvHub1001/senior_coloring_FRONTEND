import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDesignList, useDesignDetail, useDesignCategories } from "@/hooks/useDesigns";
import { useShare } from "@/hooks/useShare";
import goldFrame from "@images/home/gold_frame.svg";
import { getArtworks, deleteArtwork } from "@/apis/ArtworkFetcher";
import type { Artwork } from "@/types";

const useColoringBookPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 카테고리 목록 API 조회 ("전체" 앞에 추가)
  const { categories: apiCategories } = useDesignCategories();
  const categories = ["전체", ...apiCategories];
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { handleShare: shareImage, isShareToastVisible, shareToastMessage } = useShare();
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  // 카테고리 필터링: "전체"면 undefined로 전달하여 전체 조회
  const categoryParam = selectedCategory === "전체" ? undefined : selectedCategory;
  const { designs } = useDesignList(categoryParam);

  // 도안 상세 조회 (모달용)
  const { design: selectedDesign, isLoading: isDesignDetailLoading } =
    useDesignDetail(selectedDesignId ?? "");

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
      setIsDeleteConfirmOpen(false);
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
    setIsDeleteConfirmOpen(false);
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

  // 전시하기 → 완성 페이지로 이동
  const handleExhibit = () => {
    if (!selectedArtwork) return;
    navigate(`/coloring/${selectedArtwork.designId}/complete`, {
      state: {
        completedImageUrl: selectedArtwork.imageUrl,
        title: selectedArtwork.design.title,
        artworkId: selectedArtwork.id,
      },
    });
  };

  const handleToggleMoreMenu = () => {
    setIsMoreMenuOpen((prev) => !prev);
  };

  // 삭제 메뉴 클릭 → 확인 모달 열기
  const handleDeleteClick = () => {
    setIsMoreMenuOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  // 삭제 확인 → 실제 삭제 실행
  const handleDeleteConfirm = () => {
    if (!selectedArtwork) return;
    deleteMutation.mutate(selectedArtwork.id);
  };

  // 삭제 취소
  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleShareArtwork = async () => {
    if (!selectedArtwork) return;
    setIsMoreMenuOpen(false);
    await shareImage(selectedArtwork.imageUrl, goldFrame);
  };

  // 도안 클릭 → 상세 모달 열기
  const handleColoringItemClick = (id: string) => {
    setSelectedDesignId(id);
  };

  // 상세 모달 닫기
  const handleCloseDesignDetail = () => {
    setSelectedDesignId(null);
  };

  // 상세 모달에서 색칠하기 시작
  const handleStartColoring = () => {
    if (!selectedDesign) return;
    setSelectedDesignId(null);
    navigate(`/coloring/${selectedDesign.id}`, {
      state: { imageUrl: selectedDesign.imageUrl, title: selectedDesign.title },
    });
  };

  return {
    categories,
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
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    isDeleteConfirmOpen,
    handleShareArtwork,
    selectedDesign,
    isDesignDetailLoading,
    handleCloseDesignDetail,
    handleStartColoring,
    isShareToastVisible,
    shareToastMessage,
  };
};

export { useColoringBookPage };
