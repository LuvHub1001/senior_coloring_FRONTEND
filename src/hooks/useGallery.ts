import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  getGalleryArtworks,
  getGalleryPopular,
  getGalleryArtworkDetail,
  toggleGalleryLike,
} from "@/apis";
import type { GalleryArtwork, GalleryArtworkDetail } from "@/types";

// 상대 시간 변환 (createdAt → "3일 전" 등)
const formatTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 30) return `${diffDay}일 전`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}달 전`;
  return `${Math.floor(diffDay / 365)}년 전`;
};

// API 데이터 → 컴포넌트 props 형태로 변환
const toViewArtwork = (artwork: GalleryArtwork) => ({
  id: artwork.artworkId,
  imageUrl: artwork.imageUrl,
  title: artwork.title,
  authorName: artwork.author.nickname,
  timeAgo: formatTimeAgo(artwork.createdAt),
  likeCount: artwork.likeCount,
  isLiked: artwork.isLiked,
});

const useGallery = (enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  // 인기 작품 (캐러셀)
  const { data: popularData } = useQuery({
    queryKey: ["gallery", "popular"],
    queryFn: () => getGalleryPopular(10),
    enabled,
    staleTime: 0,
  });

  // 활동 모아보기 (무한스크롤)
  const {
    data: activityData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["gallery", "artworks", "recent"],
    queryFn: ({ pageParam = 1 }) => getGalleryArtworks("recent", pageParam, 20),
    getNextPageParam: (lastPage) =>
      lastPage.data.last ? undefined : lastPage.data.page + 2,
    initialPageParam: 1,
    enabled,
    staleTime: 0,
  });

  // 작품 상세 (오버레이)
  const { data: detailData } = useQuery({
    queryKey: ["gallery", "detail", selectedArtworkId],
    queryFn: () => getGalleryArtworkDetail(selectedArtworkId!),
    enabled: selectedArtworkId !== null,
  });

  // 좋아요 토글 mutation
  const likeMutation = useMutation({
    mutationFn: (artworkId: string) => toggleGalleryLike(artworkId),
    onSuccess: (result, artworkId) => {
      const { isLiked, likeCount } = result.data;

      // 캐시된 목록/상세 데이터 낙관적 업데이트
      queryClient.setQueriesData(
        { queryKey: ["gallery"] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any) => {
          if (!old) return old;

          // 인기 작품 캐시 업데이트
          if (Array.isArray(old.data)) {
            return {
              ...old,
              data: old.data.map((a: GalleryArtwork) =>
                a.artworkId === artworkId ? { ...a, isLiked, likeCount } : a,
              ),
            };
          }

          // 페이지네이션 캐시 업데이트
          if (old.pages) {
            return {
              ...old,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pages: old.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  content: page.data.content.map((a: GalleryArtwork) =>
                    a.artworkId === artworkId ? { ...a, isLiked, likeCount } : a,
                  ),
                },
              })),
            };
          }

          // 상세 캐시 업데이트
          if (old.data?.artworkId === artworkId) {
            return {
              ...old,
              data: { ...old.data, isLiked, likeCount },
            };
          }

          return old;
        },
      );
    },
  });

  // 뷰 데이터 변환
  const popularArtworks = useMemo(
    () => (popularData?.data ?? []).map(toViewArtwork),
    [popularData],
  );

  const activityArtworks = useMemo(
    () =>
      (activityData?.pages ?? []).flatMap((page) =>
        page.data.content.map(toViewArtwork),
      ),
    [activityData],
  );

  const selectedDetail: (GalleryArtworkDetail & { timeAgo: string }) | null =
    useMemo(() => {
      if (!detailData?.data) return null;
      return {
        ...detailData.data,
        timeAgo: formatTimeAgo(detailData.data.createdAt),
      };
    }, [detailData]);

  // 핸들러
  const handleViewModeChange = useCallback((mode: "list" | "grid") => {
    setViewMode(mode);
  }, []);

  const handleArtworkClick = useCallback((artworkId: string) => {
    setSelectedArtworkId(artworkId);
  }, []);

  const handleLikeToggle = useCallback(
    (artworkId: string) => {
      likeMutation.mutate(artworkId);
    },
    [likeMutation],
  );

  const handleDetailLikeToggle = useCallback(() => {
    if (selectedArtworkId !== null) {
      likeMutation.mutate(selectedArtworkId);
    }
  }, [selectedArtworkId, likeMutation]);

  const handleCloseDetail = useCallback(() => {
    setSelectedArtworkId(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    // 상태
    viewMode,
    selectedArtworkId,

    // 데이터
    popularArtworks,
    activityArtworks,
    selectedDetail,

    // 무한스크롤
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,

    // 핸들러
    handleViewModeChange,
    handleArtworkClick,
    handleLikeToggle,
    handleDetailLikeToggle,
    handleCloseDetail,
    handleLoadMore,
  };
};

export { useGallery };
