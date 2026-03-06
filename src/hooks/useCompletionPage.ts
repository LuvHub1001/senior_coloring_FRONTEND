import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeArtwork } from "@/apis/ArtworkFetcher";

interface CompletionLocationState {
  completedImageUrl?: string;
  title?: string;
  artworkId?: string;
}

const useCompletionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const locationState = (location.state ?? {}) as CompletionLocationState;

  const completedImageUrl = locationState.completedImageUrl ?? "";
  const title = locationState.title ?? "작품";
  const artworkId = locationState.artworkId ?? "";

  // 작품 완성 API 호출
  const completeMutation = useMutation({
    mutationFn: (id: string) => completeArtwork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
    },
  });

  // 미술관에 저장하기 (완성 처리 후 홈으로)
  const handleSaveToMuseum = async () => {
    if (artworkId) {
      await completeMutation.mutateAsync(artworkId);
    }
    navigate("/home", { replace: true });
  };

  // 그만하기 (완성 처리 후 홈으로)
  const handleDismiss = async () => {
    if (artworkId) {
      await completeMutation.mutateAsync(artworkId);
    }
    navigate("/home", { replace: true });
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
    handleSaveToMuseum,
    handleDismiss,
    handleShare,
  };
};

export { useCompletionPage };
