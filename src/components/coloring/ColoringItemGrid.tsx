import { ColoringItem } from "@/components/coloring/ColoringItem";

interface ColoringItemData {
  id: string;
  imageUrl: string;
  title: string;
}

interface ColoringItemGridProps {
  items: ColoringItemData[];
  onItemClick: (id: string) => void;
}

function ColoringItemGrid({ items, onItemClick }: ColoringItemGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <ColoringItem
          key={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </div>
  );
}

export { ColoringItemGrid };
