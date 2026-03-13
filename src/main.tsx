import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { showErrorToast } from '@/hooks/useErrorToast'
import './index.css'
import App from './App.tsx'

// API 에러 응답에서 사용자 메시지 추출
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "오류가 발생했습니다. 다시 시도해 주세요.";
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
