import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";

const useHomePage = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
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

  return {
    userName: userProfile?.nickname ?? "",
    isProfileLoading,
    activeTab,
    isThemeSheetOpen,
    selectedThemeId,
    handleTabChange,
    handleThemeClick,
    handleThemeClose,
    handleSelectTheme,
    handleCreateArtwork,
  };
};

export { useHomePage };
