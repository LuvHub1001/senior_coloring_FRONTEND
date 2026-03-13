import { useCallback } from "react";

// 슬라이더 포인터 드래그 핸들러 (Hue, Brightness 슬라이더 공용)
const useSliderDrag = (onChange: (percent: number) => void) => {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const bar = e.currentTarget;
      if (!(bar instanceof HTMLElement)) return;

      const rect = bar.getBoundingClientRect();
      bar.setPointerCapture(e.pointerId);

      const update = (clientX: number) => {
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        onChange((x / rect.width) * 100);
      };

      update(e.clientX);

      const onMove = (ev: PointerEvent) => {
        update(ev.clientX);
      };
      const onUp = () => {
        bar.removeEventListener("pointermove", onMove);
        bar.removeEventListener("pointerup", onUp);
      };
      bar.addEventListener("pointermove", onMove, { passive: true });
      bar.addEventListener("pointerup", onUp);
    },
    [onChange],
  );

  return { handlePointerDown };
};

export { useSliderDrag };
