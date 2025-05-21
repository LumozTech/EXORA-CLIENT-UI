import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HomePage from "../src/pages/HomePage";

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
    <HomePage
      orderPopup={orderPopup}
      setOrderPopup={setOrderPopup}
      handleOrderPopup={handleOrderPopup}
    />
  );
};

export default App;
