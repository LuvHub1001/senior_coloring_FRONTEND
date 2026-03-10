import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArtwork } from "@/apis/ArtworkFetcher";
import type { Artwork } from "@/types";

const useArtworkDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (artworkId: string) => deleteArtwork(artworkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setSelectedArtwork(null);
      setIsMenuOpen(false);
      setIsDeleteConfirmOpen(false);
    },
  });

  const handleOpenDetail = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsMenuOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedArtwork(null);
    setIsMenuOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    if (!selectedArtwork) return;
    setIsMenuOpen(false);
    setSelectedArtwork(null);
    navigate(`/coloring/${selectedArtwork.designId}`, {
      state: {
        artworkId: selectedArtwork.id,
        savedImageUrl: selectedArtwork.imageUrl,
        title: selectedArtwork.design.title,
        imageUrl: selectedArtwork.design.imageUrl,
      },
    });
  };

  const handleShare = () => {
    if (!selectedArtwork) return;
    // TODO: 공유 기능 구현
    setIsMenuOpen(false);
  };

  // 삭제 메뉴 클릭 → 확인 모달 열기
  const handleDeleteClick = () => {
    setIsMenuOpen(false);
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

  // 날짜 라벨 생성
  const getDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 30) return `${diffDays}일 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  };

  return {
    selectedArtwork,
    isMenuOpen,
    isDeleteConfirmOpen,
    isDetailOpen: selectedArtwork !== null,
    dateLabel: selectedArtwork ? getDateLabel(selectedArtwork.updatedAt) : "",
    handleOpenDetail,
    handleCloseDetail,
    handleMenuToggle,
    handleEdit,
    handleShare,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};

export { useArtworkDetail };
