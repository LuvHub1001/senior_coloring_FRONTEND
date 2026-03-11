import { CompletionScreen, AchievementModal, ShareToast } from "@/components";
import { useCompletionPage } from "@/hooks";
import frameImage from "@images/home/gold_frame.svg";

function CompletionPage() {
  const {
    completedImageUrl,
    isAchievementOpen,
    unlockedTheme,
    handleDismiss,
    handleSaveToMuseum,
    handleShare,
    handleAchievementClose,
    isShareToastVisible,
    shareToastMessage,
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

      <ShareToast isVisible={isShareToastVisible} message={shareToastMessage} />

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
