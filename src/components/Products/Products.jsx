import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const Products = ({ products = [], loading = false, title = "Our Products" }) => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    return `Rs. ${price.toLocaleString()}`;
  };

  // Handle add to cart
  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    if (product.stock === 0) return;
    await addToCart(product.productId, 1, 'M');
  };

  // Handle buy now
  const handleBuyNow = async (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking buy now
    if (product.stock === 0) return;
    await buyNow(product.productId, 1, 'M');
  };

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-primary">{title}</h2>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-primary">{title}</h2>
        </div>
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No products available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="text-center">
        <h2 className="mb-8 text-3xl font-bold text-primary">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
        {products.map((product, idx) => (
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
                onClick={(e) => handleAddToCart(e, product)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
