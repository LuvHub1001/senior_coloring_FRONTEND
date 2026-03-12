import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArtwork, saveArtwork } from "@/apis";

// 작품 생성 및 임시 저장 관리 (initialArtworkId: 이어 그리기 시 기존 작품 ID)
const useArtworkSave = (designId: string, initialArtworkId?: string) => {
  const queryClient = useQueryClient();
  const [artworkId, setArtworkId] = useState<string | null>(initialArtworkId ?? null);
  // 작품 생성 Promise를 보관하여 저장 시 생성 완료를 대기할 수 있도록 함
  const createPromiseRef = useRef<Promise<string> | null>(null);

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

  // artworkId 확정 — 생성 중이면 완료까지 대기
  const resolveArtworkId = useCallback(async (): Promise<string | null> => {
    if (artworkId) return artworkId;
    if (createPromiseRef.current) {
      return await createPromiseRef.current;
    }
    return null;
  }, [artworkId]);

  // 작품 생성 (색칠 시작 시 호출) — mutateAsync로 Promise 보관
  const handleCreateArtwork = useCallback(() => {
    const numericId = Number(designId);
    if (!designId || Number.isNaN(numericId)) return;
    if (createPromiseRef.current) return;

    createPromiseRef.current = createMutation
      .mutateAsync(numericId)
      .then((response) => response.data.id);
  }, [designId, createMutation]);

  // 임시 저장 (캔버스 File + 진행률을 받아 저장, 생성 완료 대기 후 저장)
  const handleSaveArtwork = useCallback(
    async (
      getCanvasFile: () => Promise<File | null>,
      getProgress: () => number,
    ): Promise<string | null> => {
      const id = await resolveArtworkId();
      if (!id) return null;

      const file = await getCanvasFile();
      if (!file) return null;

      const progress = getProgress();
      await saveMutation.mutateAsync({ id, image: file, progress });
      // 목록 캐시 무효화 — refetch 완료까지 대기하여 navigate 전에 최신 데이터 확보
      await queryClient.invalidateQueries({ queryKey: ["artworks"] });
      return id;
    },
    [resolveArtworkId, saveMutation],
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
