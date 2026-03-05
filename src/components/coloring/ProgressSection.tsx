import { ProgressCard } from "@/components/coloring/ProgressCard";

interface ProgressItem {
  id: string;
  thumbnail: string;
  title: string;
  progress: number;
}

interface ProgressSectionProps {
  items: ProgressItem[];
  onItemClick: (id: string) => void;
}

function ProgressSection({ items, onItemClick }: ProgressSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 px-5 py-5">
      <h2 className="text-[19px] font-bold text-[#0A0A0A] tracking-[-0.095px] leading-[28px]">
        이어서 색칠하기
      </h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {items.map((item) => (
          <ProgressCard
            key={item.id}
            thumbnail={item.thumbnail}
            title={item.title}
            progress={item.progress}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

export { ProgressSection };
