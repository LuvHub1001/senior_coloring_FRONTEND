import { useQuery, useMutation } from "@tanstack/react-query";
import { getDesigns, getDesignById, getDesignCategories, createDesign } from "@/apis/DesignFetcher";
import type { DesignCreateRequest } from "@/types";

// 도안 목록 조회
export const useDesignList = (category?: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["designs", category],
    queryFn: () => getDesigns(category),
  });

  return {
    designs: data?.data ?? [],
    isLoading,
    isError,
  };
};

// 도안 카테고리 목록 조회
export const useDesignCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["designCategories"],
    queryFn: getDesignCategories,
  });

  return {
    categories: data?.data ?? [],
    isLoading,
    isError,
  };
};

// 도안 상세 조회
export const useDesignDetail = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["design", id],
    queryFn: () => getDesignById(id),
    enabled: !!id,
  });

  return {
    design: data?.data ?? null,
    isLoading,
    isError,
  };
};

// 도안 등록
export const useCreateDesign = () => {
  const mutation = useMutation({
    mutationFn: (request: DesignCreateRequest) => createDesign(request),
  });

  return {
    handleCreateDesign: mutation.mutate,
    isCreating: mutation.isPending,
    isError: mutation.isError,
    createdData: mutation.data?.data ?? null,
  };
};
