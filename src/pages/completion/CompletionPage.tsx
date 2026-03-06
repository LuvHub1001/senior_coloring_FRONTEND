import { CompletionScreen } from "@/components";
import { useCompletionPage } from "@/hooks";
import frameImage from "@images/home/frame.png";

function CompletionPage() {
  const {
    completedImageUrl,
    handleDismiss,
    handleSaveToMuseum,
    handleShare,
  } = useCompletionPage();

  return (
    <CompletionScreen
      artworkImageUrl={completedImageUrl}
      frameImageUrl={frameImage}
      onDismiss={handleDismiss}
      onSaveToMuseum={handleSaveToMuseum}
      onShare={handleShare}
    />
  );
}

export { CompletionPage };
