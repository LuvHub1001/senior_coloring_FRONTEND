import { CompletionScreen, AchievementModal } from "@/components";

function CompletionPage() {
  return (
    <>
      <CompletionScreen
        artworkImageUrl=""
        frameImageUrl=""
        onDismiss={() => {}}
        onSaveToMuseum={() => {}}
        onShare={() => {}}
      />

      <AchievementModal
        isOpen={false}
        imageUrl=""
        badge="전시 공간 오픈"
        title="오페라홀"
        description={"새로운 전시관이 오픈됐어요!\n바로 적용할게요"}
        onClose={() => {}}
      />
    </>
  );
}

export { CompletionPage };
