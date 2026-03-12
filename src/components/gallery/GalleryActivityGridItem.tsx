interface GalleryActivityGridItemProps {
  imageUrl: string;
  title: string;
  onClick: () => void;
}

function GalleryActivityGridItem({
  imageUrl,
  title,
  onClick,
}: GalleryActivityGridItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-[16px] cursor-pointer"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full object-cover"
        loading="lazy"
      />
    </button>
  );
}

export { GalleryActivityGridItem };
