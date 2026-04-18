import { createBrowserRouter } from "react-router";

import AdminLayout from "../layouts/AdminLayout";
import RootLayout from "../layouts/RootLayout";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Profile from "../pages/Profile";
import Shop from "../pages/Shop";

import AdminIndex from "../pages/Admin";
import AdminCategories from "../pages/Admin/Categories";
import AdminCoupons from "../pages/Admin/Coupons";
import AdminCustomers from "../pages/Admin/Customers";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminOrders from "../pages/Admin/Orders";
import AdminProducts from "../pages/Admin/Products";

import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "products/:slug", element: <Product /> },
      { path: "cart", element: <Cart /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "checkout", element: <Checkout /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            element: <AdminIndex />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "products", element: <AdminProducts /> },
              { path: "categories", element: <AdminCategories /> },
              { path: "orders", element: <AdminOrders /> },
              { path: "customers", element: <AdminCustomers /> },
              { path: "coupons", element: <AdminCoupons /> },
            ],
          },
        ],
      },
    ],
  },
]);
