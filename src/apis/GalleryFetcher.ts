import instance from "@/apis";
import type {
  GalleryListResponse,
  GalleryPopularResponse,
  GalleryDetailResponse,
  GalleryLikeResponse,
  GalleryPublishResponse,
} from "@/types";

// 갤러리 작품 목록 조회 (페이지네이션)
export const getGalleryArtworks = async (
  sort: "popular" | "recent" = "recent",
  page: number = 1,
  size: number = 20,
): Promise<GalleryListResponse> => {
  const { data } = await instance.get<GalleryListResponse>(
    "/api/gallery/artworks",
    { params: { sort, page, size } },
  );
  return data;
};

// 오늘의 인기 작품 (캐러셀용)
export const getGalleryPopular = async (
  size: number = 10,
): Promise<GalleryPopularResponse> => {
  const { data } = await instance.get<GalleryPopularResponse>(
    "/api/gallery/artworks/popular",
    { params: { size } },
  );
  return data;
};

// 갤러리 작품 상세 조회
export const getGalleryArtworkDetail = async (
  artworkId: string,
): Promise<GalleryDetailResponse> => {
  const { data } = await instance.get<GalleryDetailResponse>(
    `/api/gallery/artworks/${encodeURIComponent(artworkId)}`,
  );
  return data;
};

// 좋아요 토글
export const toggleGalleryLike = async (
  artworkId: string,
): Promise<GalleryLikeResponse> => {
  const { data } = await instance.post<GalleryLikeResponse>(
    `/api/gallery/artworks/${encodeURIComponent(artworkId)}/like`,
  );
  return data;
};

// 작품 공개 설정
export const publishArtwork = async (
  artworkId: string,
  isPublic: boolean,
): Promise<GalleryPublishResponse> => {
  const { data } = await instance.patch<GalleryPublishResponse>(
    `/api/artworks/${encodeURIComponent(artworkId)}/publish`,
    { isPublic },
  );
  return data;
};
