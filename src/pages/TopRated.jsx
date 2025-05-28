import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Subscribe from "../components/Subscribe/Subscribe";
import Testimonials from "../components/Testimonials/Testimonials";
import { FaStar } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../config/api';

const TopRated = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const productsPerPage = 8;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl('/api/products'));
        const topRatedProducts = response.data.list.filter(product => product.isTopRated);
        setProducts(topRatedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
    });
  }, []);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format price
  const formatPrice = (price) => {
    return `Rs. ${price?.toLocaleString() || '0'}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <ToastContainer />

      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-b from-[#4d0708] to-[#4d0708]/90">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 
              className="text-4xl md:text-5xl font-bold text-[#d9cfd0] mb-4"
              data-aos="fade-up"
            >
              Top Rated Products
            </h1>
            <p 
              className="text-lg text-[#d9cfd0]/90 mb-8"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Discover our most loved and highly rated products, chosen by our customers for their exceptional quality and style.
            </p>
            <div 
              className="w-24 h-1 bg-[#d9cfd0] mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-[#4d0708] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-[#4d0708] mb-2">
              No Top Rated Products Found
            </h2>
            <p className="text-gray-600 dark:text-[#d9cfd0]/80">
              Check back later for our top-rated items!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product, idx) => (
                <div
                  key={product.productId}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-[#4d0708]/5"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden group">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-[#4d0708]" />
                      ))}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-[#4d0708] dark:text-[#d9cfd0] mb-2 line-clamp-2">
                      {product.productName}
                    </h3>

                    {/* Category */}
                    <p className="text-sm text-gray-600 dark:text-[#d9cfd0]/80 mb-2">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-[#4d0708] dark:text-[#d9cfd0]">
                        {formatPrice(product.price)}
                      </span>
                      {product.lastPrice && product.lastPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.lastPrice)}
                        </span>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.isBestSelling && (
                        <span className="px-3 py-1 text-xs text-white bg-[#4d0708] rounded-full shadow-md">
                          Best Seller
                        </span>
                      )}
                      {product.isTopRated && (
                        <span className="px-3 py-1 text-xs text-white bg-[#4d0708] rounded-full shadow-md">
                          Top Rated
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className={`w-full px-4 py-2 rounded-lg transition-all duration-300 ${
                        product.stock > 0
                          ? 'bg-[#4d0708] text-white hover:bg-[#4d0708]/90 hover:shadow-lg active:scale-95'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.stock > 0) {
                          // Add to cart logic here
                          toast.success('Added to cart');
                        }
                      }}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === idx + 1
                        ? 'bg-[#4d0708] text-white shadow-md'
                        : 'bg-[#d9cfd0]/20 text-[#4d0708] hover:bg-[#d9cfd0]/40 dark:bg-gray-700 dark:text-[#d9cfd0] dark:hover:bg-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Testimonials Section */}
      <div data-aos="fade-up">
        <Testimonials />
      </div>

      {/* Subscribe Section */}
      <div data-aos="fade-up">
        <Subscribe />
      </div>

      <Footer />
    </div>
  );
};

export default TopRated;
