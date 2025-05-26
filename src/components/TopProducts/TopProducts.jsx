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
      <div>
        <div className="container">
          <div className="text-left mb-24">
            <p data-aos="fade-up" className="text-sm text-primary">
              Top Rated Products for you
            </p>
            <h1 data-aos="fade-up" className="text-3xl font-bold">
              Best Products
            </h1>
          </div>
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-16 h-16 border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div>
        <div className="container">
          <div className="text-left mb-24">
            <p data-aos="fade-up" className="text-sm text-primary">
              Top Rated Products for you
            </p>
            <h1 data-aos="fade-up" className="text-3xl font-bold">
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
    <div>
      <div className="container">
        {/* Header section */}
        <div className="text-left mb-24">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Rated Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Best Products
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Discover our highest rated and most loved products
          </p>
        </div>
        {/* Body section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center">
          {products.map((product, index) => (
            <div
              key={product.productId}
              data-aos="zoom-in"
              className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
              onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
            >
              {/* image section */}
              <div className="h-[100px]">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/140x140?text=No+Image'}
                  alt={product.productName}
                  className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                />
              </div>
              {/* details section */}
              <div className="p-4 text-center">
                {/* star rating */}
                <div className="w-full flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>
                <h1 className="text-xl font-bold">{product.productName}</h1>
                <div className="flex justify-center items-center gap-2 my-2">
                  <p className="font-bold group-hover:text-white duration-300">{formatPrice(product.price)}</p>
                  {product.lastPrice && product.lastPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through group-hover:text-white/70">
                      {formatPrice(product.lastPrice)}
                    </p>
                  )}
                </div>
                <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                  {product.description || "Experience premium quality and style with this amazing product"}
                </p>
                <button
                  className={`bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary ${
                    product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
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
