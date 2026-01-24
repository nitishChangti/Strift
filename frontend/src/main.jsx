import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import {
  Login,
  AuthLayout,
  Signup,
  Products,
  ProductDetail,
  Cart,
  Profile,
  ProfileInfo,
  Wishlist,
  Addresses,
  CheckoutPage,
} from "./components/index";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ContactUs from "./pages/ContactUs.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetailsPage from "./components/MyOrder/OrderDetailsPage.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminAuthLayout from "./components/Admin/AdminLayout.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import AdminCategory from "./components/Admin/AdminCategory.jsx";
import AdminProduct from "./components/Admin/AdminProduct.jsx";
import AdminCreateProduct from "./components/Admin/AdminCreateProduct.jsx";
let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/products",
        element: (
          // <AuthLayout authentication={false}>
          <Products />
          // </AuthLayout >
        ),
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        ),
        children: [
          {
            index: true, // ✅ this is for /profile (default child route)
            element: (
              <AuthLayout authentication={true}>
                <ProfileInfo />
              </AuthLayout>
            ),
          },
          {
            path: "address", // ✅ relative path, becomes /profile/address
            element: (
              <AuthLayout authentication={true}>
                <Addresses />
              </AuthLayout>
            ),
          },
          {
            path: "wishlist", // ✅ relative path, becomes /profile/wishlist
            element: (
              <AuthLayout authentication={true}>
                <Wishlist />
              </AuthLayout>
            ),
          },
          {
            path: "myOrders",
            element: (
              <AuthLayout authentication={true}>
                <MyOrders />
              </AuthLayout>
            ),
          },
          {
            path: "order/:id",
            element: (
              <AuthLayout authentication={true}>
                <OrderDetailsPage />
              </AuthLayout>
            ),
          },
        ],
      },
      {
        path: "/order/checkout",
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <AdminAuthLayout>
        <AdminLayout />
      </AdminAuthLayout>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "category", element: <AdminCategory /> },
      { path: "products", element: <AdminProduct /> },
      { path: "products/create", element: <AdminCreateProduct /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
