import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample womens wear products data
const womensProducts = [
  {
    id: 1,
    name: "Floral Summer Dress",
    price: "Rs. 3,200",
    image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
  },
  {
    id: 2,
    name: "Elegant Evening Gown",
    price: "Rs. 7,500",
    image: "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
  },
  {
    id: 3,
    name: "Casual Denim Jacket",
    price: "Rs. 2,800",
    image: "https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg",
  },
  {
    id: 4,
    name: "Classic White Shirt",
    price: "Rs. 1,900",
    image: "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
  },
  {
    id: 5,
    name: "Trendy Skirt",
    price: "Rs. 2,200",
    image: "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg",
  },
  {
    id: 6,
    name: "Winter Coat",
    price: "Rs. 5,600",
    image: "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
  },
  {
    id: 7,
    name: "Party Top",
    price: "Rs. 1,500",
    image: "https://images.pexels.com/photos/1488465/pexels-photo-1488465.jpeg",
  },
  {
    id: 8,
    name: "Formal Blazer",
    price: "Rs. 4,300",
    image: "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
  },
  {
    id: 9,
    name: "Maxi Dress",
    price: "Rs. 3,900",
    image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
  },
  {
    id: 10,
    name: "Printed Kurti",
    price: "Rs. 2,100",
    image: "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg",
  },
  {
    id: 11,
    name: "Ethnic Saree",
    price: "Rs. 6,200",
    image: "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
  },
  {
    id: 12,
    name: "Trendy Jumpsuit",
    price: "Rs. 3,700",
    image: "https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg",
  },
];

const PRODUCTS_PER_PAGE = 9; // 3 rows if each row has 3 products

const WomensWear = () => {
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
  const totalPages = Math.ceil(womensProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = womensProducts.slice(
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
      {/* Womens Wear Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl text-primary"
          data-aos="fade-up"
        >
          Womens Wear Collection
        </h1>
        <p
          className="max-w-xl text-lg text-center text-gray-700 dark:text-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Explore our elegant and trendy womens wear collection, perfect for
          every occasion. Modern styles, vibrant colors, and premium fabrics for
          women!
        </p>
      </section>
      {/* Womens Wear Products with Pagination */}
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

export default WomensWear;
