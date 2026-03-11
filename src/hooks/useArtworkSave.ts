import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { createArtwork, saveArtwork } from "@/apis";

// 작품 생성 및 임시 저장 관리 (initialArtworkId: 이어 그리기 시 기존 작품 ID)
const useArtworkSave = (designId: string, initialArtworkId?: string) => {
  const [artworkId, setArtworkId] = useState<string | null>(initialArtworkId ?? null);

  // 작품 생성 mutation
  const createMutation = useMutation({
    mutationFn: (id: number) => createArtwork(id),
    onSuccess: (response) => {
      setArtworkId(response.data.id);
    },
  });

  // 임시 저장 mutation
  const saveMutation = useMutation({
    mutationFn: ({ id, image, progress }: { id: string; image: File; progress: number }) =>
      saveArtwork(id, image, progress),
  });

  // 작품 생성 (색칠 시작 시 호출)
  const handleCreateArtwork = useCallback(() => {
    const numericId = Number(designId);
    if (!designId || Number.isNaN(numericId)) return;
    createMutation.mutate(numericId);
  }, [designId, createMutation]);

  // 임시 저장 (캔버스 File + 진행률을 받아 저장)
  const handleSaveArtwork = useCallback(
    async (getCanvasFile: () => Promise<File | null>, getProgress: () => number) => {
      if (!artworkId) return;

      const file = await getCanvasFile();
      if (!file) return;

      const progress = getProgress();
      await saveMutation.mutateAsync({ id: artworkId, image: file, progress });
    },
    [artworkId, saveMutation],
  );

  return {
    artworkId,
    handleCreateArtwork,
    handleSaveArtwork,
    isCreating: createMutation.isPending,
    isSaving: saveMutation.isPending,
  };
};

export { useArtworkSave };
