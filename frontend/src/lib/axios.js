import axios from "axios";

// Đảm bảo BASE_URL trỏ đúng tới backend
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Quan trọng để gửi nhận HttpOnly Cookies (refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
