interface DeleteConfirmModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 딤 레이어 */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* 모달 카드 */}
      <div className="relative z-10 flex w-[320px] flex-col gap-[14px] overflow-hidden rounded-[16px] bg-white px-[16px] pt-[22px] pb-[16px]">
        <div className="flex flex-col gap-[8px] px-[8px]">
          <p className="text-[20px] font-[700] leading-[29px] tracking-[-0.1px] text-[#333D48]">
            작품을 영구 삭제하시겠어요?
          </p>
          <p className="text-[17px] font-[400] leading-[25.5px] tracking-[-0.085px] text-[#6B7684]">
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-[48px] flex-1 items-center justify-center rounded-[12px] bg-[rgba(2,32,71,0.05)] cursor-pointer"
          >
            <span className="text-[17px] font-[600] leading-[25.5px] tracking-[-0.085px] text-[#4E5968]">
              아니요
            </span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[48px] flex-1 items-center justify-center rounded-[12px] bg-[#333D48] cursor-pointer"
          >
            <span className="text-[17px] font-[600] leading-[25.5px] tracking-[-0.085px] text-white">
              삭제하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { DeleteConfirmModal };
