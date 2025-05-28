import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../config/api';

const PRODUCTS_PER_PAGE = 9;

const WomensWear = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl('/api/products'));
        // Filter for women's category and active products
        const womensProducts = response.data.list.filter(
          product => product.category === 'women' && product.status === 'active'
        );
        setProducts(womensProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
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
  const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    return `Rs. ${price.toLocaleString()}`;
  };

  return (
    <div className="duration-200 bg-white dark:bg-gray-900 dark:text-white">
      <Navbar />
      <ToastContainer />
      
      {/* Womens Wear Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-[#4d0708]/5 via-white to-[#4d0708]/5 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl text-[#4d0708]"
          data-aos="fade-up"
        >
          Womens Wear Collection
        </h1>
        <p
          className="max-w-xl text-lg text-center text-[#4d0708]/80 dark:text-[#d9cfd0]"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Discover our beautiful and trendy womens wear collection. Elegant
          sarees, stylish dresses, and more for every occasion!
        </p>
      </section>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-t-4 rounded-full border-[#4d0708] border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
      {/* Womens Wear Products with Pagination */}
      <div data-aos="fade-up" className="container px-4 py-8 mx-auto">
            {products.length === 0 ? (
              <div className="text-center">
                <p className="text-xl text-[#4d0708]/60 dark:text-[#d9cfd0]/60">
                  No womens wear products available at the moment.
                </p>
              </div>
            ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
          {currentProducts.map((product, idx) => (
            <div
              key={product.productId}
              className="space-y-3 cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              onClick={() =>
                navigate(`/product/${product.productId}`, { state: { product } })
              }
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
                <h3 className="font-semibold text-[#4d0708] dark:text-[#d9cfd0]">{product.productName}</h3>
                <p className="text-sm text-[#4d0708]/60 dark:text-[#d9cfd0]/60">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold text-[#4d0708]">{formatPrice(product.price)}</p>
                  {product.lastPrice && product.lastPrice > product.price && (
                    <p className="text-sm text-[#4d0708]/40 line-through">
                      {formatPrice(product.lastPrice)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mb-2">
                  {product.isBestSelling && (
                    <span className="px-2 py-1 text-xs text-[#d9cfd0] bg-[#4d0708] rounded">Best Seller</span>
                  )}
                  {product.isTopRated && (
                    <span className="px-2 py-1 text-xs text-[#d9cfd0] bg-[#4d0708] rounded">Top Rated</span>
                  )}
                </div>
                <button
                  className={`px-4 py-2 text-[#d9cfd0] transition-colors rounded-md ${
                    product.stock > 0 
                      ? 'bg-[#4d0708] hover:bg-[#4d0708]/90' 
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
            {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
                    className={`px-4 py-2 rounded transition-colors duration-200 ${
                currentPage === idx + 1
                  ? "bg-[#4d0708] text-[#d9cfd0]"
                        : "bg-[#4d0708]/5 text-[#4d0708] hover:bg-[#4d0708]/10 dark:text-[#d9cfd0]"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
            )}
      </div>

      {/* Banner Section */}
      <div data-aos="zoom-in">
        <Banner />
      </div>

      {/* Subscribe Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <Subscribe />
      </div>
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default WomensWear;
