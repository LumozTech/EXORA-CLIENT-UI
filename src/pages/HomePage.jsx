import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Products from "../components/Products/Products";
import TopProducts from "../components/TopProducts/TopProducts";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import Testimonials from "../components/Testimonials/Testimonials";
import Footer from "../components/Footer/Footer";
import Popup from "../components/Popup/Popup";

const HomePage = ({ orderPopup, setOrderPopup, handleOrderPopup }) => (
  <div className="duration-200 bg-white dark:bg-gray-900 dark:text-white">
    <Navbar handleOrderPopup={handleOrderPopup} />
    <Hero handleOrderPopup={handleOrderPopup} />
    <Products />
    <TopProducts handleOrderPopup={handleOrderPopup} />
    <Banner />
    <Subscribe />
    <Products />
    <Testimonials />
    <Footer />
    <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
  </div>
);

export default HomePage;
