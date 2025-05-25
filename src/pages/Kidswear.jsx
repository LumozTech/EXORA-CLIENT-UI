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

const PRODUCTS_PER_PAGE = 9; // 3 rows if each row has 3 products

const KidsWear = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        // Filter for kids category and active products
        const kidsProducts = response.data.list.filter(
          product => product.category === 'kids' && product.status === 'active'
        );
        setProducts(kidsProducts);
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Kids Wear Products with Pagination */}
          <div data-aos="fade-up" className="container px-4 py-8 mx-auto">
            {products.length === 0 ? (
              <div className="text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No kids wear products available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                {currentProducts.map((product, idx) => (
                  <div
                    key={product.productId}
                    className="flex flex-col overflow-hidden bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
                    data-aos="zoom-in"
                    data-aos-delay={idx * 100}
                    onClick={() =>
                      navigate(`/product/${product.productId}`, { state: { product } })
                    }
                  >
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={product.productName}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                      />
                      {product.stock === 0 && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                          <span className="px-4 py-2 bg-red-500 text-white rounded">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center p-4">
                      <h3 className="mb-2 text-lg font-semibold">{product.productName}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                        {product.lastPrice && product.lastPrice > product.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.lastPrice)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {product.isBestSelling && (
                          <span className="px-2 py-1 text-xs text-white bg-green-500 rounded">Best Seller</span>
                        )}
                        {product.isTopRated && (
                          <span className="px-2 py-1 text-xs text-white bg-yellow-500 rounded">Top Rated</span>
                        )}
                      </div>
                      <button 
                        className={`px-4 py-2 mt-2 text-white transition-colors rounded ${
                          product.stock > 0 
                            ? 'bg-primary hover:bg-secondary' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
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

export default KidsWear;
