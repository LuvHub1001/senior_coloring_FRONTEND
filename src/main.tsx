import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { showErrorToast } from '@/hooks/useErrorToast'
import './index.css'
import App from './App.tsx'

// API 에러 응답에서 한국어 메시지 변환
const getErrorMessage = (error: unknown): string => {
  // axios 에러인 경우
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { status?: number }; code?: string };
    const status = axiosError.response?.status;

    if (!axiosError.response && axiosError.code === "ERR_NETWORK") {
      return "네트워크 연결을 확인해 주세요.";
    }
    if (axiosError.code === "ECONNABORTED") {
      return "요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.";
    }
    if (status === 400) return "잘못된 요청입니다.";
    if (status === 403) return "접근 권한이 없습니다.";
    if (status === 404) return "요청한 정보를 찾을 수 없습니다.";
    if (status === 409) return "이미 처리된 요청입니다.";
    if (status && status >= 500) return "서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
};

const mutationCache = new MutationCache({
  onError: (error) => {
    showErrorToast(getErrorMessage(error));
  },
});

const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
