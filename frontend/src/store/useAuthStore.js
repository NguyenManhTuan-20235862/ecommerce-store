import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  register: async (credentials) => {
    set({ isLoading: true });
    try {
      // Backend api: /auth/signup
      await axiosInstance.post("/auth/signup", credentials);
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
      // Backend api: /auth/signin
      const response = await axiosInstance.post("/auth/signin", credentials);
      const { accessToken, user } = response.data;
      
      // Backend giờ đã gán full info (bao gồm role).
      set({ 
        accessToken, 
        isAuthenticated: true, 
        isLoading: false,
        user
      });
      
      toast.success("Đăng nhập thành công!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Sai thông tin đăng nhập");
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/auth/signout");
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      toast.success("Hẹn gặp lại!");
    } catch (error) {
      toast.error("Lỗi khi đăng xuất");
      set({ isLoading: false });
    }
  }
}));
