import instance from "@/apis";
import type {
  ArtworkStatus,
  ArtworkResponse,
  ArtworkCompleteResponse,
  ArtworkListResponse,
  ArtworkDeleteResponse,
} from "@/types";

// 색칠 시작 (작품 생성)
export const createArtwork = async (designId: number): Promise<ArtworkResponse> => {
  const { data } = await instance.post<ArtworkResponse>("/api/artworks", { designId });
  return data;
};

// 임시 저장 (색칠 진행 이미지 + 진행률 업로드)
export const saveArtwork = async (id: string, image: File, progress: number): Promise<ArtworkResponse> => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("progress", String(progress));

  const { data } = await instance.put<ArtworkResponse>(
    `/api/artworks/${encodeURIComponent(id)}/save`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

// 내 작품 목록 조회
export const getArtworks = async (status?: ArtworkStatus): Promise<ArtworkListResponse> => {
  const params = status ? { status } : undefined;
  const { data } = await instance.get<ArtworkListResponse>("/api/artworks", { params });
  return data;
};

// 작품 상세 조회
export const getArtworkById = async (id: string): Promise<ArtworkResponse> => {
  const { data } = await instance.get<ArtworkResponse>(`/api/artworks/${encodeURIComponent(id)}`);
  return data;
};

// 작품 완성
export const completeArtwork = async (id: string): Promise<ArtworkCompleteResponse> => {
  const { data } = await instance.patch<ArtworkCompleteResponse>(
    `/api/artworks/${encodeURIComponent(id)}/complete`
  );
  return data;
};

// 작품 삭제
export const deleteArtwork = async (id: string): Promise<ArtworkDeleteResponse> => {
  const { data } = await instance.delete<ArtworkDeleteResponse>(
    `/api/artworks/${encodeURIComponent(id)}`
  );
  return data;
};
