import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import HomePage from "../src/pages/HomePage";
import Login from "../src/pages/Login";
import Register from "./pages/Register";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
