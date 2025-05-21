import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Subscribe from "../components/Subscribe/Subscribe";
import Testimonials from "../components/Testimonials/Testimonials";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample top rated products data
const topRatedProducts = [
  {
    id: 1,
    name: "Premium Leather Jacket",
    price: "Rs. 7,500",
    image: "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
  },
  {
    id: 2,
    name: "Designer Saree",
    price: "Rs. 8,200",
    image: "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
  },
  {
    id: 3,
    name: "Kids Party Dress",
    price: "Rs. 2,900",
    image: "https://images.pexels.com/photos/3661355/pexels-photo-3661355.jpeg",
  },
  {
    id: 4,
    name: "Classic Blue Jeans",
    price: "Rs. 2,400",
    image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
  },
  {
    id: 5,
    name: "Formal Blazer",
    price: "Rs. 5,300",
    image: "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
  },
  {
    id: 6,
    name: "Trendy Maxi Dress",
    price: "Rs. 4,100",
    image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
  },
  {
    id: 7,
    name: "Men's Polo Shirt",
    price: "Rs. 2,200",
    image: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
  },
  {
    id: 8,
    name: "Ethnic Kurta",
    price: "Rs. 3,000",
    image: "https://images.pexels.com/photos/3661353/pexels-photo-3661353.jpeg",
  },
  {
    id: 9,
    name: "Winter Coat",
    price: "Rs. 6,800",
    image: "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
  },
  {
    id: 10,
    name: "Kids Hoodie",
    price: "Rs. 1,900",
    image: "https://images.pexels.com/photos/3661352/pexels-photo-3661352.jpeg",
  },
  {
    id: 11,
    name: "Party Gown",
    price: "Rs. 7,000",
    image: "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
  },
  {
    id: 12,
    name: "Sports Tracksuit",
    price: "Rs. 3,500",
    image: "https://images.pexels.com/photos/3661356/pexels-photo-3661356.jpeg",
  },
];

const PRODUCTS_PER_PAGE = 9; // 3 rows if each row has 3 products

const TopRated = () => {
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
  const totalPages = Math.ceil(topRatedProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = topRatedProducts.slice(
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
      {/* Top Rated Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl text-primary"
          data-aos="fade-up"
        >
          Top Rated Products
        </h1>
        <p
          className="max-w-xl text-lg text-center text-gray-700 dark:text-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Discover our most loved and highly rated products, chosen by our
          customers for their quality and style!
        </p>
      </section>
      {/* Top Rated Products with Pagination */}
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
      {/* Testimonials Section */}
      <div data-aos="zoom-in">
        <Testimonials />
      </div>
      {/* Featured Brands Section */}
      <section
        className="flex flex-col items-center justify-center py-12 bg-gradient-to-r from-orange-50 via-yellow-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h2 className="mb-4 text-2xl font-bold text-primary">
          Featured Brands
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
            alt="Nike"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png"
            alt="Adidas"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Puma_logo.svg"
            alt="Puma"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Levis-logo.png"
            alt="Levis"
            className="h-10"
          />
        </div>
      </section>
      {/* Subscribe Section */}
      <div data-aos="fade-up" data-aos-delay="300">
        <Subscribe />
      </div>
      <Footer />
    </div>
  );
};

export default TopRated;
