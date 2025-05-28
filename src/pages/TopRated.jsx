import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Subscribe from "../components/Subscribe/Subscribe";
import Testimonials from "../components/Testimonials/Testimonials";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PRODUCTS_PER_PAGE = 9; // 3 rows if each row has 3 products

const TopRated = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        // Filter only top rated products
        const topRatedProducts = response.data.list.filter(product => product.isTopRated);
        setProducts(topRatedProducts);
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format price
  const formatPrice = (price) => `Rs. ${price.toLocaleString()}`;

  return (
    <div className="duration-200 bg-white dark:bg-gray-900 dark:text-white">
      <ToastContainer />
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
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="mb-2 text-2xl font-semibold text-gray-600">No Top Rated Products Found</h2>
            <p className="text-gray-500">Check back later for our top-rated items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
            {currentProducts.map((product, idx) => (
              <div
                key={product.productId}
                className="space-y-3 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
              >
                <div className="relative overflow-hidden h-[220px] w-[150px]">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.productName}
                    className="object-cover w-full h-full rounded-md transition-transform duration-300 hover:scale-110"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-500 text-white rounded">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{product.productName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                    {product.lastPrice && product.lastPrice > product.price && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(product.lastPrice)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2">
                    {product.isBestSelling && (
                      <span className="px-2 py-1 text-xs text-white bg-green-500 rounded">Best Seller</span>
                    )}
                    {product.isTopRated && (
                      <span className="px-2 py-1 text-xs text-white bg-yellow-500 rounded">Top Rated</span>
                    )}
                  </div>
                  <button
                    className={`px-4 py-2 text-white transition-colors rounded-md ${
                      product.stock > 0 
                        ? 'bg-primary hover:bg-secondary' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > PRODUCTS_PER_PAGE && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => handlePageChange(idx + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === idx + 1
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
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
