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
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/Checkout/Success";
import Home from "./pages/Home";
import Lookbook from "./pages/Lookbook";
import NewDrops from "./pages/NewDrops";
import Product from "./pages/Product";
import Sale from "./pages/Sale";
import Shop from "./pages/Shop";

// Wishlist Page
import Wishlist from "./pages/Wishlist";

// Profile Pages
import Addresses from "./pages/Profile/Addresses";
import ChangePassword from "./pages/Profile/ChangePassword";
import OrderDetail from "./pages/Profile/OrderDetail";
import OrderHistory from "./pages/Profile/OrderHistory";
import ProfileInfo from "./pages/Profile/ProfileInfo";
import ProfileLayout from "./pages/Profile/ProfileLayout";

// Admin Pages
import AdminCategoriesPage from "./pages/Admin/Categories";
import AdminCouponsPage from "./pages/Admin/Coupons";
import AdminCustomersPage from "./pages/Admin/Customers";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminLookbookPage from "./pages/Admin/Lookbook";
import AdminSalePage from "./pages/Admin/Sale";
import AdminOrdersPage from "./pages/Admin/Orders";
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
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="lookbook" element={<AdminLookbookPage />} />
          <Route path="sale" element={<AdminSalePage />} />
        </Route>

        {/* ====== CUSTOMER PAGES (có Header, Footer) ====== */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/new-drops" element={<NewDrops />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/checkout/success/:orderNumber"
            element={<CheckoutSuccess />}
          />
          {/* Profile Pages */}
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<Navigate to="/profile/info" replace />} />
            <Route path="info" element={<ProfileInfo />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
