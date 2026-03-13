import axios from "axios";
import type { TokenRefreshResponse } from "@/types";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 토큰 갱신 중복 요청 방지
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];
let pendingRejects: Array<(reason: unknown) => void> = [];

const processPendingRequests = (token: string) => {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
  pendingRejects = [];
};

// refresh 실패 시 대기 중인 요청 전부 reject
const rejectPendingRequests = (error: unknown) => {
  pendingRejects.forEach((reject) => reject(error));
  pendingRequests = [];
  pendingRejects = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도가 아니며, refresh 요청 자체가 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh")
    ) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // refresh token 없으면 로그인 페이지로 이동
        localStorage.removeItem("token");
        // 히스토리에 남지 않도록 replace 사용 (뒤로가기 루프 방지)
        window.location.replace("/");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 갱신 중이면 대기열에 추가 (reject도 저장하여 실패 시 정리)
        return new Promise((resolve, reject) => {
          pendingRequests.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
          pendingRejects.push(reject);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<TokenRefreshResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { timeout: 10000 }
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processPendingRequests(newAccessToken);

        return instance(originalRequest);
      } catch (refreshError) {
        // refresh 실패 시 대기 중인 요청 전부 reject 후 토큰 제거
        rejectPendingRequests(refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // 히스토리에 남지 않도록 replace 사용 (뒤로가기 루프 방지)
        window.location.replace("/");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

// Barrel re-export: 모든 Fetcher 함수 통합
export {
  createArtwork,
  saveArtwork,
  getArtworks,
  getArtworkById,
  completeArtwork,
  featureArtwork,
  deleteArtwork,
} from "@/apis/ArtworkFetcher";
export {
  getDesigns,
  getDesignCategories,
  getDesignById,
  createDesign,
} from "@/apis/DesignFetcher";
export { getThemes, selectTheme } from "@/apis/ThemeFetcher";
export { getUserProfile } from "@/apis/UserFetcher";
export { postRefreshToken, postLogout } from "@/apis/AuthFetcher";
export {
  getGalleryArtworks,
  getGalleryPopular,
  getGalleryArtworkDetail,
  toggleGalleryLike,
  publishArtwork,
} from "@/apis/GalleryFetcher";
