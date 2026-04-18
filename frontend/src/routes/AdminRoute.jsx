import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

/**
 * HOC bảo vệ route dành cho Admin.
 * - Chưa đăng nhập → redirect /login
 * - Đăng nhập nhưng không phải admin → redirect /
 * - Là admin → render children
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, isHydrating } = useAuthStore();

  // Đang kiểm tra token → hiển thị loading
  if (isHydrating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  // Chưa đăng nhập → về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Không phải admin → về trang chủ
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
