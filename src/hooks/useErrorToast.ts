import { useState, useEffect, useCallback } from "react";

// 모듈 레벨 구독자 — 어디서든 showErrorToast()를 호출하면 구독 중인 컴포넌트에 알림
type Listener = (message: string) => void;
const listeners = new Set<Listener>();

// 전역 에러 토스트 트리거 (hooks, QueryClient onError 등에서 호출)
const showErrorToast = (message: string) => {
  listeners.forEach((fn) => fn(message));
};

// 에러 토스트 상태를 구독하는 커스텀 훅
const useErrorToast = (duration: number = 3000) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handler: Listener = (message) => {
      setErrorMessage(message);
      clearTimeout(timer);
      timer = setTimeout(() => setErrorMessage(null), duration);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
      clearTimeout(timer);
    };
  }, [duration]);

  const dismissError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    errorMessage,
    isErrorVisible: errorMessage !== null,
    dismissError,
  };
};

export { useErrorToast, showErrorToast };
