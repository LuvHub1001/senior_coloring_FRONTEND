interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {categories.map((category) => {
        const isSelected = category === selectedCategory;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`shrink-0 h-9 rounded-full px-4 text-[15px] tracking-[-0.075px] leading-[22.5px] font-medium cursor-pointer ${
              isSelected
                ? "bg-[rgba(0,12,31,0.8)] text-white"
                : "bg-[rgba(2,32,71,0.05)] text-[#4A5565]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export { CategoryFilter };
