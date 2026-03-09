import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getThemes, selectTheme } from "@/apis/ThemeFetcher";
import { getArtworks, featureArtwork } from "@/apis/ArtworkFetcher";

interface HomeLocationState {
  isNewUser?: boolean;
}

const useHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const locationState = location.state as HomeLocationState | null;
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const [showWelcome, setShowWelcome] = useState(
    locationState?.isNewUser === true
  );
  const [activeTab, setActiveTab] = useState<"museum" | "gallery">("museum");
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);

  // 완성된 작품 목록 조회
  const { data: completedData } = useQuery({
    queryKey: ["artworks", "COMPLETED"],
    queryFn: () => getArtworks("COMPLETED"),
  });

  const completedArtworks = completedData?.data ?? [];

  // 테마 목록 조회
  const { data: themesData } = useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
  });

  // API 데이터를 컴포넌트 형태로 매핑
  const themes = (themesData?.data ?? []).map((theme) => ({
    id: theme.id,
    name: theme.name,
    description: theme.unlocked
      ? "사용 가능"
      : `작품 ${theme.requiredArtworks}개 완성하기`,
    imageUrl: theme.imageUrl,
    isLocked: !theme.unlocked,
  }));

  // 현재 선택된 테마 ID (유저 프로필 기준)
  const selectedThemeId = userProfile?.selectedThemeId ?? 1;

  // 테마 선택 mutation
  const selectMutation = useMutation({
    mutationFn: (themeId: number) => selectTheme(themeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  const handleTabChange = (tab: "museum" | "gallery") => {
    setActiveTab(tab);
  };

  const handleThemeClick = () => {
    setIsThemeSheetOpen(true);
  };

  const handleThemeClose = () => {
    setIsThemeSheetOpen(false);
  };

  const handleSelectTheme = (themeId: number) => {
    selectMutation.mutate(themeId);
  };

  const handleCreateArtwork = () => {
    navigate("/coloring");
  };

  const handleWelcomeDismiss = () => {
    setShowWelcome(false);
    // navigation state 초기화 (새로고침 시 다시 표시 방지)
    window.history.replaceState({}, "");
  };

  // 대표 작품 선택 mutation
  const featureMutation = useMutation({
    mutationFn: (artworkId: string) => featureArtwork(artworkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  const handleFeatureArtwork = (artworkId: string) => {
    featureMutation.mutate(artworkId);
  };

  // 대표 작품 (featuredArtworkId 기준, 없으면 최신 작품)
  const featuredArtworkId = userProfile?.featuredArtworkId;
  const featuredArtwork = completedArtworks.find((a) => a.id === featuredArtworkId)
    ?? (completedArtworks.length > 0
      ? completedArtworks.reduce((latest, artwork) =>
          new Date(artwork.updatedAt) > new Date(latest.updatedAt) ? artwork : latest
        )
      : null);

  return {
    userName: userProfile?.nickname ?? "",
    isProfileLoading,
    showWelcome,
    activeTab,
    isThemeSheetOpen,
    selectedThemeId,
    selectedThemeImageUrl: userProfile?.selectedTheme?.imageUrl ?? "",
    buttonColor: userProfile?.selectedTheme?.buttonColor ?? "#333D48",
    buttonTextColor: userProfile?.selectedTheme?.buttonTextColor ?? "#FFFFFF",
    textColor: userProfile?.selectedTheme?.textColor ?? "#000000",
    toggleType: userProfile?.selectedTheme?.toggleType ?? "LIGHT",
    frameImageUrl: userProfile?.selectedTheme?.frameImageUrl ?? "",
    themes,
    completedArtworks,
    featuredArtwork,
    handleTabChange,
    handleThemeClick,
    handleThemeClose,
    handleSelectTheme,
    handleCreateArtwork,
    handleWelcomeDismiss,
    handleFeatureArtwork,
  };
};

export { useHomePage };
