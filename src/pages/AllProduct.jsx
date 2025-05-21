import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample data for all products (combine mens, womens, kids)
const allProducts = [
  // Mens
  {
    id: 1,
    name: "Classic Polo Shirt",
    price: "Rs. 2,000",
    images: [
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
    ],
    description: "A classic polo shirt for men.",
    category: "Men",
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: "Rs. 2,800",
    images: [
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    ],
    description: "Comfortable denim jeans.",
    category: "Men",
  },
  // Womens
  {
    id: 3,
    name: "Floral Summer Dress",
    price: "Rs. 3,200",
    images: [
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
    ],
    description: "Lightweight floral dress perfect for summer outings.",
    category: "Women",
  },
  {
    id: 4,
    name: "Elegant Evening Gown",
    price: "Rs. 7,500",
    images: [
      "https://images.pexels.com/photos/1488465/pexels-photo-1488465.jpeg",
    ],
    description: "Elegant gown for special occasions.",
    category: "Women",
  },
  // Kids
  {
    id: 5,
    name: "Kids Cartoon Tee",
    price: "Rs. 1,200",
    images: [
      "https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg",
    ],
    description: "Fun cartoon t-shirt for kids.",
    category: "Kids",
  },
  {
    id: 6,
    name: "Kids Shorts",
    price: "Rs. 900",
    images: [
      "https://images.pexels.com/photos/936076/pexels-photo-936076.jpeg",
    ],
    description: "Lightweight shorts for active kids.",
    category: "Kids",
  },
  // Add more products as needed...
];

const PRODUCTS_PER_PAGE = 9;

const AllProduct = () => {
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
      ? allProducts
      : allProducts.filter((p) => p.category === filter);

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
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-blue-100 via-white to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1 className="mb-4 text-4xl font-bold md:text-5xl text-primary" data-aos="fade-up">
          All Products
        </h1>
        <p
          className="max-w-xl text-lg text-center text-gray-700 dark:text-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Browse our complete collection for Men, Women, and Kids. Find your style!
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {currentProducts.map((product, idx) => (
            <div
              key={product.id}
              className="flex flex-col items-center overflow-hidden bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-800"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              onClick={() =>
                navigate(`/product/${product.id}`, { state: { product } })
              }
            >
              <img
                src={product.images[0]}
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

export default AllProduct;