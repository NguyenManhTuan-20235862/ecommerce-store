import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api, { setAccessToken } from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrating: false,

      register: async (credentials) => {
        set({ isLoading: true });
        try {
          await api.post("/auth/signup", credentials);
          toast.success("Đăng ký thành công! Hãy đăng nhập nhé.");
          set({ isLoading: false });
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Đăng ký thất bại");
          set({ isLoading: false });
          return false;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/auth/signin", {
            identifier:
              credentials?.identifier ??
              credentials?.username ??
              credentials?.email ??
              "",
            password: credentials?.password ?? "",
          });
          const { accessToken, user } = response.data;

          setAccessToken(accessToken);

          set({
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            user,
          });

          toast.success("Đăng nhập thành công!");
          return true;
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Sai thông tin đăng nhập",
          );
          set({ isLoading: false });
          return false;
        }
      },

      hydrateAuth: async () => {
        const token = get().accessToken;
        if (!token) {
          setAccessToken(null);
          return;
        }

        set({ isHydrating: true });
        setAccessToken(token);

        try {
          const response = await api.get("/users/me");
          set({
            user: response.data?.user || null,
            isAuthenticated: Boolean(response.data?.user),
            isHydrating: false,
          });
        } catch {
          setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isHydrating: false,
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post("/auth/signout");
          setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          toast.success("Hẹn gặp lại!");
          return true;
        } catch {
          toast.error("Lỗi khi đăng xuất");
          set({ isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
