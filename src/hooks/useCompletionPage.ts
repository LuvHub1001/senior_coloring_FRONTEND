import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeArtwork, deleteArtwork, featureArtwork } from "@/apis/ArtworkFetcher";
import type { UnlockedTheme } from "@/types";

interface CompletionLocationState {
  completedImageUrl?: string;
  title?: string;
  artworkId?: string;
  originalArtworkId?: string;
  isOriginalFeatured?: boolean;
}

const useCompletionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const locationState = (location.state ?? {}) as CompletionLocationState;

  const completedImageUrl = locationState.completedImageUrl ?? "";
  const title = locationState.title ?? "작품";
  const artworkId = locationState.artworkId ?? "";
  const originalArtworkId = locationState.originalArtworkId;
  const isOriginalFeatured = locationState.isOriginalFeatured ?? false;

  const [unlockedTheme, setUnlockedTheme] = useState<UnlockedTheme | null>(null);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  // 완성 후 홈 이동 대기 여부 (모달 닫은 뒤 이동하기 위함)
  const [pendingNavigate, setPendingNavigate] = useState(false);

  // 작품 완성 API 호출
  const completeMutation = useMutation({
    mutationFn: (id: string) => completeArtwork(id),
    onSuccess: async (response) => {
      // 수정하기로 진입한 경우 기존 완성작 삭제 → 대표 작품이었으면 새 작품을 대표로 설정
      if (originalArtworkId) {
        await deleteArtwork(originalArtworkId);
        if (isOriginalFeatured && artworkId) {
          await featureArtwork(artworkId);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      queryClient.invalidateQueries({ queryKey: ["themes"] });

      // 새로 해금된 테마가 있으면 모달 표시
      if (response.data.unlockedTheme) {
        setUnlockedTheme(response.data.unlockedTheme);
        setIsAchievementOpen(true);
      }
    },
  });

  // 미술관에 저장하기 (완성 처리)
  const handleSaveToMuseum = async () => {
    if (artworkId) {
      const result = await completeMutation.mutateAsync(artworkId);
      // 해금 모달이 뜨면 홈 이동을 보류
      if (result.data.unlockedTheme) {
        setPendingNavigate(true);
        return;
      }
    }
    navigate("/home", { replace: true });
  };

  // 그만하기 (완성 처리 후 홈으로)
  const handleDismiss = async () => {
    if (artworkId) {
      const result = await completeMutation.mutateAsync(artworkId);
      if (result.data.unlockedTheme) {
        setPendingNavigate(true);
        return;
      }
    }
    navigate("/home", { replace: true });
  };

  // 해금 모달 닫기
  const handleAchievementClose = () => {
    setIsAchievementOpen(false);
    if (pendingNavigate) {
      navigate("/home", { replace: true });
    }
  };

  // 공유하기
  const handleShare = async () => {
    if (!completedImageUrl) return;

    // Web Share API 지원 시
    if (navigator.share) {
      const blob = await fetch(completedImageUrl).then((r) => r.blob());
      const file = new File([blob], `${title}.png`, { type: "image/png" });

      await navigator.share({
        title: `${title} - 색칠 완성`,
        files: [file],
      });
    }
  };

  return {
    completedImageUrl,
    title,
    isSaving: completeMutation.isPending,
    isAchievementOpen,
    unlockedTheme,
    handleSaveToMuseum,
    handleDismiss,
    handleShare,
    handleAchievementClose,
  };
};

export { useCompletionPage };
