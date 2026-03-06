interface SaveConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function SaveConfirmModal({ onConfirm, onCancel }: SaveConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 딤 배경 */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* 모달 */}
      <div className="relative z-10 w-[300px] rounded-2xl bg-white px-6 pb-5 pt-7 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
        <p className="text-center text-[17px] font-bold leading-[25.5px] tracking-[-0.085px] text-[#191F28]">
          그만 그리시겠어요?
        </p>
        <p className="mt-2 text-center text-[14px] font-medium leading-[20px] tracking-[-0.07px] text-[#6A7282]">
          지금까지 색칠한 내용은 임시저장돼요
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[rgba(2,32,71,0.05)]"
          >
            <span className="text-[16px] font-semibold leading-[24px] tracking-[-0.08px] text-[#4E5968]">
              취소
            </span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#191F28]"
          >
            <span className="text-[16px] font-semibold leading-[24px] tracking-[-0.08px] text-white">
              확인
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { SaveConfirmModal };
