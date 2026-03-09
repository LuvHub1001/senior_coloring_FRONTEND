import instance from "@/apis";
import type {
  DesignListResponse,
  DesignDetailResponse,
  DesignCategoryResponse,
  DesignCreateRequest,
  DesignCreateResponse,
} from "@/types";

// 도안 목록 조회
export const getDesigns = async (category?: string): Promise<DesignListResponse> => {
  const params = category ? { category } : undefined;
  const { data } = await instance.get<DesignListResponse>("/api/designs", { params });
  return data;
};

// 도안 카테고리 목록 조회
export const getDesignCategories = async (): Promise<DesignCategoryResponse> => {
  const { data } = await instance.get<DesignCategoryResponse>("/api/designs/categories");
  return data;
};

// 도안 상세 조회
export const getDesignById = async (id: string): Promise<DesignDetailResponse> => {
  const { data } = await instance.get<DesignDetailResponse>(`/api/designs/${encodeURIComponent(id)}`);
  return data;
};

// 도안 등록
export const createDesign = async (request: DesignCreateRequest): Promise<DesignCreateResponse> => {
  const formData = new FormData();
  formData.append("image", request.image);
  formData.append("title", request.title);
  formData.append("category", request.category);
  if (request.description) {
    formData.append("description", request.description);
  }

  const { data } = await instance.post<DesignCreateResponse>("/api/designs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
