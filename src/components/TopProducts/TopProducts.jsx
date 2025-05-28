import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const TopProducts = ({ products = [], loading = false, handleOrderPopup }) => {
  const navigate = useNavigate();

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    return `Rs. ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="mb-12 mt-14 bg-gradient-to-b from-[#d9cfd0]/10 to-transparent">
        <div className="container">
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p data-aos="fade-up" className="text-sm text-[#4d0708] font-medium">
              Top Rated Products for you
            </p>
            <h1 data-aos="fade-up" className="text-3xl font-bold text-[#4d0708]">
              Best Products
            </h1>
          </div>
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-16 h-16 border-4 border-t-4 rounded-full border-[#4d0708] border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="mb-12 mt-14 bg-gradient-to-b from-[#d9cfd0]/10 to-transparent">
        <div className="container">
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p data-aos="fade-up" className="text-sm text-[#4d0708] font-medium">
              Top Rated Products for you
            </p>
            <h1 data-aos="fade-up" className="text-3xl font-bold text-[#4d0708]">
              Best Products
            </h1>
          </div>
          <div className="text-center text-gray-600 dark:text-gray-400">
            No top rated products available at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 mt-14 bg-gradient-to-b from-[#d9cfd0]/10 to-transparent">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-[#4d0708] font-medium">
            Top Rated Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold text-[#4d0708]">
            Best Products
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-600 dark:text-gray-400">
            Discover our highest rated and most loved products
          </p>
        </div>
        {/* Body section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={product.productId}
              className="flex flex-col items-center overflow-hidden bg-white rounded-xl shadow-md cursor-pointer dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#4d0708]/5"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
            >
              <div className="relative overflow-hidden h-56 w-full group">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={product.productName}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                {product.stock === 0 && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center p-6 w-full bg-gradient-to-b from-white to-[#d9cfd0]/10 dark:from-gray-800 dark:to-gray-800/90">
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-[#4d0708]" />
                  ))}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#4d0708] text-center hover:text-[#4d0708]/80 transition-colors">
                  {product.productName}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-bold text-[#4d0708]">{formatPrice(product.price)}</p>
                  {product.lastPrice && product.lastPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(product.lastPrice)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mb-4">
                  {product.isBestSelling && (
                    <span className="px-3 py-1 text-xs text-white bg-[#4d0708] rounded-full shadow-md">Best Seller</span>
                  )}
                  {product.isTopRated && (
                    <span className="px-3 py-1 text-xs text-white bg-[#4d0708] rounded-full shadow-md">Top Rated</span>
                  )}
                </div>
                <button 
                  className={`w-full px-6 py-2.5 text-white rounded-lg transition-all duration-300 transform hover:shadow-lg ${
                    product.stock > 0 
                      ? 'bg-[#4d0708] hover:bg-[#4d0708]/90 active:scale-95' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.stock > 0) {
                      handleOrderPopup();
                    }
                  }}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
