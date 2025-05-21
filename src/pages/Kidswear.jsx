import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample kids wear products data
const kidsProducts = [
  {
    id: 1,
    name: "Cartoon T-Shirt",
    price: "Rs. 1,200",
    image: "https://images.pexels.com/photos/1648376/pexels-photo-1648376.jpeg",
  },
  {
    id: 2,
    name: "Denim Shorts",
    price: "Rs. 1,000",
    image: "https://images.pexels.com/photos/3661350/pexels-photo-3661350.jpeg",
  },
  {
    id: 3,
    name: "Summer Dress",
    price: "Rs. 1,500",
    image: "https://images.pexels.com/photos/3661351/pexels-photo-3661351.jpeg",
  },
  {
    id: 4,
    name: "Hooded Jacket",
    price: "Rs. 2,000",
    image: "https://images.pexels.com/photos/3661352/pexels-photo-3661352.jpeg",
  },
  {
    id: 5,
    name: "Printed Kurta",
    price: "Rs. 1,400",
    image: "https://images.pexels.com/photos/3661353/pexels-photo-3661353.jpeg",
  },
  {
    id: 6,
    name: "Dungaree Set",
    price: "Rs. 1,800",
    image: "https://images.pexels.com/photos/3661354/pexels-photo-3661354.jpeg",
  },
  {
    id: 7,
    name: "Party Frock",
    price: "Rs. 2,200",
    image: "https://images.pexels.com/photos/3661355/pexels-photo-3661355.jpeg",
  },
  {
    id: 8,
    name: "Sports Tracksuit",
    price: "Rs. 2,500",
    image: "https://images.pexels.com/photos/3661356/pexels-photo-3661356.jpeg",
  },
  {
    id: 9,
    name: "Winter Sweater",
    price: "Rs. 1,900",
    image: "https://images.pexels.com/photos/3661357/pexels-photo-3661357.jpeg",
  },
  {
    id: 10,
    name: "Printed Leggings",
    price: "Rs. 900",
    image: "https://images.pexels.com/photos/3661358/pexels-photo-3661358.jpeg",
  },
  {
    id: 11,
    name: "Ethnic Sherwani",
    price: "Rs. 2,800",
    image: "https://images.pexels.com/photos/3661359/pexels-photo-3661359.jpeg",
  },
  {
    id: 12,
    name: "Casual Shorts",
    price: "Rs. 1,100",
    image: "https://images.pexels.com/photos/3661360/pexels-photo-3661360.jpeg",
  },
];

const PRODUCTS_PER_PAGE = 9; // 3 rows if each row has 3 products

const KidsWear = () => {
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(kidsProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = kidsProducts.slice(
    startIdx,
    startIdx + PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="duration-200 bg-white dark:bg-gray-900 dark:text-white">
      <Navbar />
      {/* Kids Wear Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl text-primary"
          data-aos="fade-up"
        >
          Kids Wear Collection
        </h1>
        <p
          className="max-w-xl text-lg text-center text-gray-700 dark:text-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Discover our adorable and comfortable kids wear collection, perfect
          for every occasion. Bright colors, playful designs, and soft fabrics
          for your little ones!
        </p>
      </section>
      {/* Kids Wear Products with Pagination */}
      <div data-aos="fade-up" className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {currentProducts.map((product, idx) => (
            <div
              key={product.id}
              className="flex flex-col items-center overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-56"
              />
              <div className="flex flex-col items-center p-4">
                <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                <p className="mb-2 font-bold text-primary">{product.price}</p>
                <button className="px-4 py-2 text-white transition-colors rounded bg-primary hover:bg-secondary">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === idx + 1
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      {/* Banner Section */}
      <div data-aos="zoom-in">
        <Banner />
      </div>
      {/* Subscribe Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <Subscribe />
      </div>
      <Footer />
    </div>
  );
};

export default KidsWear;
