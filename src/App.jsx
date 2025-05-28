import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import HomePage from "../src/pages/HomePage";
import Login from "../src/pages/Login";
import Register from "./pages/Register";
import KidsWear from "./pages/KidsWear";
import MensWear from "./pages/MensWear";
import WomensWear from "./pages/WomensWear";
import TopRated from "./pages/TopRated";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ProceedToCheckout from "./pages/ProceedToCheckout";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import AllProduct from "./pages/AllProduct";
import Bestselling from "./pages/Bestselling";
import Profile from "./pages/Profile";
import AdminDashboard from "../src/pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AddUser from "./pages/admin/AddUser";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import Reviews from "./pages/admin/Reviews";
import Orders from "./pages/admin/Orders";
import Settings from "./pages/admin/Settings";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <CartProvider>
        <ToastContainer />
        <Routes>
          {/* All routes are now public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <HomePage
                orderPopup={orderPopup}
                setOrderPopup={setOrderPopup}
                handleOrderPopup={handleOrderPopup}
              />
            }
          />
          <Route path="/kids-wear" element={<KidsWear />} />
          <Route path="/mens-wear" element={<MensWear />} />
          <Route path="/womens-wear" element={<WomensWear />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/all-products" element={<AllProduct />} />
          <Route path="/bestselling" element={<Bestselling />} />
          <Route
            path="/product/:productId"
            element={
              <ProductDetails
                orderPopup={orderPopup}
                setOrderPopup={setOrderPopup}
                handleOrderPopup={handleOrderPopup}
              />
            }
          />

          {/* Former user protected routes - now public */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProceedToCheckout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile/edit" element={<Profile />} />

          {/* Former admin protected routes - now public */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/add-user" element={<AddUser />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="admin/reviews" element={<Reviews />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;
