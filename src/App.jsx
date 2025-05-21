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
      <Routes>
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
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              orderPopup={orderPopup}
              setOrderPopup={setOrderPopup}
              handleOrderPopup={handleOrderPopup}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
