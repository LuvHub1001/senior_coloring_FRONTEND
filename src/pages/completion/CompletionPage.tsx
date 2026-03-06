import { CompletionScreen, AchievementModal } from "@/components";
import { useCompletionPage } from "@/hooks";
import frameImage from "@images/home/frame.png";

function CompletionPage() {
  const {
    completedImageUrl,
    isAchievementOpen,
    unlockedTheme,
    handleDismiss,
    handleSaveToMuseum,
    handleShare,
    handleAchievementClose,
  } = useCompletionPage();

  return (
    <>
      <CompletionScreen
        artworkImageUrl={completedImageUrl}
        frameImageUrl={frameImage}
        onDismiss={handleDismiss}
        onSaveToMuseum={handleSaveToMuseum}
        onShare={handleShare}
      />

      {unlockedTheme && (
        <AchievementModal
          isOpen={isAchievementOpen}
          imageUrl={unlockedTheme.imageUrl}
          badge="전시 공간 오픈"
          title={unlockedTheme.name}
          description={"새로운 전시관이 오픈됐어요!\n바로 적용할게요"}
          onClose={handleAchievementClose}
        />
      )}
    </>
  );
}

export { CompletionPage };
