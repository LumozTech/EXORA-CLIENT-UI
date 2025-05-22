import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Subscribe from "../components/Subscribe/Subscribe";
import Testimonials from "../components/Testimonials/Testimonials"; // Import Testimonials
import { FaStar } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample bestselling products (replace with real API data)
const bestsellingProducts = [
  {
    id: 1,
    name: "Classic Polo Shirt",
    price: "Rs. 2,000",
    images: [
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
    ],
    description: "A classic polo shirt for men.",
    category: "Men",
    rating: 5.0,
    color: "White",
    aosDelay: "0",
  },
  {
    id: 3,
    name: "Floral Summer Dress",
    price: "Rs. 3,200",
    images: [
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
    ],
    description: "Lightweight floral dress perfect for summer outings.",
    category: "Women",
    rating: 4.8,
    color: "Pink",
    aosDelay: "200",
  },
  {
    id: 5,
    name: "Kids Cartoon Tee",
    price: "Rs. 1,200",
    images: [
      "https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg",
    ],
    description: "Fun cartoon t-shirt for kids.",
    category: "Kids",
    rating: 4.7,
    color: "Blue",
    aosDelay: "400",
  },
  {
    id: 7,
    name: "Men's Slim Fit Shirt",
    price: "Rs. 2,200",
    images: [
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    ],
    description: "Trendy slim fit shirt for men.",
    category: "Men",
    rating: 4.9,
    color: "Red",
    aosDelay: "600",
  },
  {
    id: 8,
    name: "Elegant Evening Gown",
    price: "Rs. 7,500",
    images: [
      "https://images.pexels.com/photos/1488465/pexels-photo-1488465.jpeg",
    ],
    description: "Elegant gown for special occasions.",
    category: "Women",
    rating: 5.0,
    color: "Purple",
    aosDelay: "800",
  },
  // Add more bestselling products as needed...
];

const PRODUCTS_PER_PAGE = 9;

const Bestselling = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Filter logic
  const filteredProducts =
    filter === "All"
      ? bestsellingProducts
      : bestsellingProducts.filter((p) => p.category === filter);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
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
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-yellow-100 via-white to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl text-primary"
          data-aos="fade-up"
        >
          Bestselling Products
        </h1>
        <p
          className="max-w-xl text-lg text-center text-gray-700 dark:text-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Discover our most popular picks loved by customers!
        </p>
      </section>
      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mt-6 mb-8">
        {["All", "Men", "Women", "Kids"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === cat
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Products Grid */}
      <div data-aos="fade-up" className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
          {currentProducts.map((data) => (
            <div
              data-aos="fade-up"
              data-aos-delay={data.aosDelay}
              key={data.id}
              className="space-y-3"
            >
              <img
                src={data.images[0]}
                alt={data.name}
                className="h-[220px] w-[150px] object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold">{data.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {data.color}
                </p>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span>{data.rating}</span>
                </div>
                <p className="mb-2 font-bold text-primary">{data.price}</p>
                <button
                  className="px-4 py-2 text-white transition-colors rounded-md bg-primary hover:bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic here
                  }}
                >
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
      {/* Testimonials Section (like TopRated) */}
      <div data-aos="zoom-in">
        <Testimonials />
      </div>
      {/* Subscribe Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <Subscribe />
      </div>
      <Footer />
    </div>
  );
};

export default Bestselling;
