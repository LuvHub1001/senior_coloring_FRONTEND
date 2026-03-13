// 갤러리 작품 작성자
export interface GalleryAuthor {
  id: number;
  nickname: string;
}

// 갤러리 작품
export interface GalleryArtwork {
  artworkId: string;
  title: string;
  imageUrl: string;
  author: GalleryAuthor;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

// 갤러리 작품 상세 (열람 오버레이용)
export interface GalleryArtworkDetail extends GalleryArtwork {
  design: {
    id: number;
    title: string;
    imageUrl: string;
  };
}

// 갤러리 목록 응답 (페이지네이션)
export interface GalleryListResponse {
  success: boolean;
  data: {
    content: GalleryArtwork[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

// 인기 작품 응답
export interface GalleryPopularResponse {
  success: boolean;
  data: GalleryArtwork[];
}

// 작품 상세 응답
export interface GalleryDetailResponse {
  success: boolean;
  data: GalleryArtworkDetail;
}

// 좋아요 토글 응답
export interface GalleryLikeResponse {
  success: boolean;
  data: {
    isLiked: boolean;
    likeCount: number;
  };
}

// 작품 공개 설정 응답
export interface GalleryPublishResponse {
  success: boolean;
  data: {
    artworkId: string;
    isPublic: boolean;
  };
}
