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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
            {/* card section */}
            {products.map((product, index) => (
              <div
                data-aos="fade-up"
                data-aos-delay={index * 100}
                key={product.productId}
                className="space-y-3 cursor-pointer"
                onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
              >
                <div className="relative h-[220px] w-[150px]">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/150x220?text=No+Image'}
                    alt={product.productName}
                    className="h-full w-full object-cover rounded-md hover:scale-105 duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                      <span className="px-2 py-1 bg-red-500 text-white text-sm rounded">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{product.productName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{product.isTopRated ? "5.0" : "4.5"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-primary font-bold">{formatPrice(product.price)}</p>
                    {product.lastPrice && product.lastPrice > product.price && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(product.lastPrice)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {product.isBestSelling && (
                      <span className="px-2 py-1 text-[10px] text-white bg-green-500 rounded">Best Seller</span>
                    )}
                    {product.isTopRated && (
                      <span className="px-2 py-1 text-[10px] text-white bg-yellow-500 rounded">Top Rated</span>
                    )}
                  </div>
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
