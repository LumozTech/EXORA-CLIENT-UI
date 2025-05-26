import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const Products = ({ products = [], loading = false, title = "Our Products" }) => {
  const navigate = useNavigate();

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    return `Rs. ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="mb-12 mt-14">
        <div className="container">
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p data-aos="fade-up" className="text-sm text-primary">
              Top Selling Products for you
            </p>
            <h1 data-aos="fade-up" className="text-3xl font-bold">
              {title}
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
      <div className="mb-12 mt-14">
        <div className="container">
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p data-aos="fade-up" className="text-sm text-primary">
              Top Selling Products for you
            </p>
            <h1 data-aos="fade-up" className="text-3xl font-bold">
              {title}
            </h1>
          </div>
          <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
            No products available at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 mt-14">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            {title}
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Discover our amazing collection of products
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product, index) => (
              <div
                key={product.productId}
                className="flex flex-col items-center overflow-hidden bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
              >
                <div className="relative overflow-hidden h-56 w-full">
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
                <div className="flex flex-col items-center p-4 w-full">
                  <h3 className="mb-2 text-lg font-semibold">{product.productName}</h3>
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
                    className={`px-4 py-2 text-white transition-colors rounded ${
                      product.stock > 0 
                        ? 'bg-primary hover:bg-secondary' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'View Details' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
