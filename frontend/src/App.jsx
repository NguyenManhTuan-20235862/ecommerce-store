import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/authStore";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import RootLayout from "./layouts/RootLayout";

// Route Guards
import AdminRoute from "./routes/AdminRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Landing from "./pages/Landing";

// Customer Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Shop from "./pages/Shop";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProductsPage from "./pages/Admin/Products";
import ProductForm from "./pages/Admin/Products/ProductForm";

function App() {
  useEffect(() => {
    useAuthStore.getState().hydrateAuth();
  }, []);

  return (
    <BrowserRouter>
      {/* Cấu hình Toast Component (Sonner) */}
      <Toaster position="top-right" richColors />

      <Routes>
        {/* Auth Pages đi một mình (Không Header Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ====== ADMIN PANEL ====== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          {/* Placeholder cho các trang admin chưa làm */}
          <Route
            path="categories"
            element={
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Quản lý danh mục
                </h1>
                <p className="mt-2 text-neutral-500">
                  Tính năng đang phát triển...
                </p>
              </div>
            }
          />
          <Route
            path="orders"
            element={
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Quản lý đơn hàng
                </h1>
                <p className="mt-2 text-neutral-500">
                  Tính năng đang phát triển...
                </p>
              </div>
            }
          />
          <Route
            path="customers"
            element={
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Quản lý khách hàng
                </h1>
                <p className="mt-2 text-neutral-500">
                  Tính năng đang phát triển...
                </p>
              </div>
            }
          />
          <Route
            path="coupons"
            element={
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Quản lý mã giảm giá
                </h1>
                <p className="mt-2 text-neutral-500">
                  Tính năng đang phát triển...
                </p>
              </div>
            }
          />
        </Route>

        {/* ====== CUSTOMER PAGES (có Header, Footer) ====== */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/profile"
            element={
              <div className="min-h-[50vh] flex items-center justify-center">
                <h1 className="text-2xl pt-32">Customer Profile (Bản nháp)</h1>
              </div>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
