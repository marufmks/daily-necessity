import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Dashboard from "./pages/admin/Dashboard";
import ProductsManage from "./pages/admin/ProductsManage";
import OrdersManage from "./pages/admin/OrdersManage";
import UsersManage from "./pages/admin/UsersManage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductsManage />} />
          <Route path="/admin/orders" element={<OrdersManage />} />
          <Route path="/admin/users" element={<UsersManage />} />
        </Route>

        <Route path="*" element={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="mt-2 text-muted-foreground">Page not found</p>
            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
}
