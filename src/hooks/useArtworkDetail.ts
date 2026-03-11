import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArtwork } from "@/apis/ArtworkFetcher";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useShare } from "@/hooks/useShare";
import type { Artwork } from "@/types";

const useArtworkDetail = (frameImageUrl?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userProfile } = useUserProfile();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { handleShare: shareImage, isShareToastVisible, shareToastMessage } = useShare();

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
    // artworkId를 넘기지 않아 새 IN_PROGRESS 작품이 생성되도록 함
    // originalArtworkId: 수정본 완성 시 기존 완성작을 삭제하기 위해 전달
    const isOriginalFeatured = userProfile?.featuredArtworkId === selectedArtwork.id;
    navigate(`/coloring/${selectedArtwork.designId}`, {
      state: {
        originalArtworkId: selectedArtwork.id,
        isOriginalFeatured,
        savedImageUrl: selectedArtwork.imageUrl,
        title: selectedArtwork.design.title,
        imageUrl: selectedArtwork.design.imageUrl,
      },
    });
  };

  const handleShare = async () => {
    if (!selectedArtwork) return;
    setIsMenuOpen(false);
    await shareImage(selectedArtwork.imageUrl, frameImageUrl ?? "");
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
    isShareToastVisible,
    shareToastMessage,
  };
};

export { useArtworkDetail };
