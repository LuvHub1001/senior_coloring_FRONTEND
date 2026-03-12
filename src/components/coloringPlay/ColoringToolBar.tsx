interface ColoringToolBarProps {
  canUndo: boolean;
  canRedo: boolean;
  selectedColor: string;
  isPaletteActive?: boolean;
  isCollapsed?: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onPalette: () => void;
  onReset: () => void;
  onCollapse: () => void;
}

function ColoringToolBar({
  canUndo,
  canRedo,
  selectedColor,
  isPaletteActive = false,
  isCollapsed = false,
  onUndo,
  onRedo,
  onPalette,
  onReset,
  onCollapse,
}: ColoringToolBarProps) {
  return (
    <div className="flex items-center justify-between px-5 pb-4 pt-3">
      {/* 이전 (Undo) */}
      <ToolButton
        label="이전"
        disabled={!canUndo}
        onClick={onUndo}
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8L8 4" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 8L8 12" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 8H12C14.2091 8 16 9.7909 16 12V12C16 14.2091 14.2091 16 12 16H10" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      {/* 복구 (Redo) */}
      <ToolButton
        label="복구"
        disabled={!canRedo}
        onClick={onRedo}
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8L12 4" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8L12 12" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8H8C5.79086 8 4 9.7909 4 12V12C4 14.2091 5.79086 16 8 16H10" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      {/* 팔레트 — 접힘 시 선택 색상 원으로 표시 */}
      {isCollapsed ? (
        <button
          type="button"
          onClick={onPalette}
          className="flex w-[56px] flex-col items-center gap-[4px] cursor-pointer"
        >
          <div
            className="shrink-0 rounded-full border-[1.67px] p-[3.33px]"
            style={{ borderColor: selectedColor }}
          >
            <div
              className="size-[33.33px] rounded-full"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
          <span className="text-[10px] font-[700] text-[#6B7684] tracking-[-0.05px] leading-[12px]">
            팔레트
          </span>
        </button>
      ) : (
        <ToolButton
          label="팔레트"
          active={isPaletteActive}
          onClick={onPalette}
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33C10.92 18.33 11.67 17.58 11.67 16.67V15.83C11.67 15.42 11.83 15.05 12.1 14.78C12.37 14.51 12.42 14.1 12.2 13.78C11.98 13.46 12.03 13.05 12.3 12.78C12.57 12.51 12.92 12.37 13.33 12.37H15C16.84 12.37 18.33 10.88 18.33 9.03C18.33 4.97 14.6 1.67 10 1.67Z" stroke={isPaletteActive ? "white" : "#6B7684"} strokeWidth="1.5" />
              <circle cx="5.83" cy="10" r="0.83" fill={isPaletteActive ? "white" : "#6B7684"} />
              <circle cx="8.33" cy="6.67" r="0.83" fill={isPaletteActive ? "white" : "#6B7684"} />
              <circle cx="11.67" cy="6.67" r="0.83" fill={isPaletteActive ? "white" : "#6B7684"} />
              <circle cx="14.17" cy="8.33" r="0.83" fill={isPaletteActive ? "white" : "#6B7684"} />
            </svg>
          }
        />
      )}

      {/* 리셋 */}
      <ToolButton
        label="초기화"
        onClick={onReset}
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 2.5V7.5H7.5" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.17 12.5C4.7 14.93 6.83 16.67 9.33 16.67C12.28 16.67 14.67 14.28 14.67 11.33C14.67 8.38 12.28 6 9.33 6C7.17 6 5.28 7.25 4.42 9.08L2.5 7.5" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      {/* 접기 / 열기 */}
      <ToolButton
        label={isCollapsed ? "열기" : "접기"}
        onClick={onCollapse}
        icon={
          isCollapsed ? (
            /* 열기: 위 화살표 + 아래 선 */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 7L15 12" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 16H15" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            /* 접기: 아래 화살표 + 위 선 */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8L10 13L15 8" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 4H15" stroke="#6B7684" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )
        }
      />
    </div>
  );
}

interface ToolButtonProps {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}

function ToolButton({ label, icon, disabled = false, active = false, onClick }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-[56px] flex-col items-center gap-[4px] cursor-pointer ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <div
        className={`flex size-[40px] items-center justify-center rounded-[10px] ${
          active ? "bg-[#4E5968]" : "bg-[rgba(2,32,71,0.05)]"
        }`}
      >
        {icon}
      </div>
      <span className="text-[10px] font-[700] text-[#6B7684] tracking-[-0.05px] leading-[12px]">
        {label}
      </span>
    </button>
  );
}

export { ColoringToolBar };
