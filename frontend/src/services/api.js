import axios from "axios";

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

export const setAccessToken = (token) => {
  accessToken = token || null;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Chỉ retry khi: 403 (token hết hạn), chưa retry lần nào, và không phải chính endpoint refresh
    const shouldRefresh =
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh");

    if (!shouldRefresh) return Promise.reject(error);

    // Đang refresh rồi → xếp hàng chờ
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh");
      const newToken = data.accessToken;

      setAccessToken(newToken);

      // Lazy import tránh circular dependency (authStore import api)
      const { useAuthStore } = await import("../store/authStore");
      useAuthStore.setState((s) => ({
        ...s,
        accessToken: newToken,
        user: data.user ?? s.user,
      }));

      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      setAccessToken(null);
      const { useAuthStore } = await import("../store/authStore");
      useAuthStore.setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });

      // Hard redirect — không dùng useNavigate vì đây là ngoài component tree
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
