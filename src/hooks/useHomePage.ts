import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";

interface HomeLocationState {
  isNewUser?: boolean;
}

const useHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as HomeLocationState | null;
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const [showWelcome, setShowWelcome] = useState(
    locationState?.isNewUser === true
  );
  const [activeTab, setActiveTab] = useState<"museum" | "gallery">("museum");
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState("white");

  const handleTabChange = (tab: "museum" | "gallery") => {
    setActiveTab(tab);
  };

  const handleThemeClick = () => {
    setIsThemeSheetOpen(true);
  };

  const handleThemeClose = () => {
    setIsThemeSheetOpen(false);
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
  };

  const handleCreateArtwork = () => {
    navigate("/coloring");
  };

  const handleWelcomeDismiss = () => {
    setShowWelcome(false);
    // navigation state 초기화 (새로고침 시 다시 표시 방지)
    window.history.replaceState({}, "");
  };

  return {
    userName: userProfile?.nickname ?? "",
    isProfileLoading,
    showWelcome,
    activeTab,
    isThemeSheetOpen,
    selectedThemeId,
    handleTabChange,
    handleThemeClick,
    handleThemeClose,
    handleSelectTheme,
    handleCreateArtwork,
    handleWelcomeDismiss,
  };
};

export { useHomePage };
