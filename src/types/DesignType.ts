export interface Design {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  originalImageUrl?: string;
  description?: string;
  createdAt: string;
}

export interface DesignListResponse {
  success: boolean;
  data: Design[];
}

export interface DesignDetailResponse {
  success: boolean;
  data: Design;
}

export interface DesignCreateRequest {
  image: File;
  title: string;
  category: string;
  description?: string;
}

export interface DesignCategoryResponse {
  success: boolean;
  data: string[];
}

export interface DesignCreateResponse {
  success: boolean;
  data: {
    imageUrl: string;
  };
}
