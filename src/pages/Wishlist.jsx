import React, { useEffect, useState } from "react";
import { FaHeart, FaTrashAlt, FaCartPlus } from "react-icons/fa";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";

// Mock wishlist data (replace with real API/context)
const initialWishlist = [
  {
    id: 1,
    name: "Summer Floral Dress",
    price: 3500,
    image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
    inStock: true,
  },
  {
    id: 2,
    name: "Men's Slim Fit Shirt",
    price: 2200,
    image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    inStock: false,
  },
  {
    id: 3,
    name: "Kids Cartoon Tee",
    price: 1200,
    image: "https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg",
    inStock: true,
  },
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [cart, setCart] = useState([]); // For demo, not persisted
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // Remove item from wishlist
  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // Add item to cart and remove from wishlist
  const handleAddToCart = (item) => {
    if (!item.inStock) return;
    setCart((prev) => [...prev, item]);
    setWishlist((prev) => prev.filter((w) => w.id !== item.id));
    // Optionally navigate to cart
    // navigate("/cart");
  };

  // Go to product details (if you have product page)
  const handleGoToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen duration-200 bg-gradient-to-br from-pink-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-start flex-1 min-h-screen px-4 py-10">
        <div
          className="w-full max-w-5xl p-8 mx-auto shadow-2xl bg-white/95 dark:bg-gray-900/95 rounded-3xl"
          data-aos="fade-up"
        >
          <h2 className="flex items-center justify-center gap-3 mb-10 text-4xl font-extrabold tracking-tight text-center text-pink-600">
            <FaHeart className="text-pink-500 animate-bounce" /> My Wishlist
          </h2>
          {wishlist.length === 0 ? (
            <div className="py-20 text-center">
              <FaHeart className="mx-auto mb-4 text-6xl text-pink-300 animate-pulse" />
              <p className="mb-4 text-lg text-gray-500">
                Your wishlist is empty.
              </p>
              <Link
                to="/"
                className="px-8 py-3 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-primary to-secondary hover:scale-105"
                style={{ borderRadius: 8 }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-800 hover:shadow-2xl group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  style={{ minHeight: 370 }}
                >
                  <div
                    className="relative cursor-pointer"
                    onClick={() => handleGoToProduct(item.id)}
                    title="View Product"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-48 transition-transform duration-300 rounded-t-2xl group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <FaHeart className="text-2xl text-pink-400 drop-shadow" />
                    </div>
                    <div className="absolute top-3 right-3">
                      {item.inStock ? (
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded shadow">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded shadow">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="mb-1 text-lg font-bold text-gray-800 dark:text-pink-200 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="mb-2 text-xl font-extrabold text-primary">
                      Rs. {item.price}
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-2 mt-4">
                      <button
                        className={`flex-1 flex items-center justify-center gap-2 px-0 py-2 font-semibold shadow transition-all text-base border ${
                          item.inStock
                            ? "bg-gradient-to-r from-primary to-secondary text-white border-primary hover:scale-105"
                            : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!item.inStock}
                        title={
                          item.inStock
                            ? "Add to Cart"
                            : "This item is currently out of stock"
                        }
                        style={{ borderRadius: 8 }}
                        onClick={() => handleAddToCart(item)}
                      >
                        <FaCartPlus />
                        Add to Cart
                      </button>
                      <button
                        className="flex items-center justify-center flex-1 gap-2 px-0 py-2 font-semibold text-red-600 transition-all bg-red-100 border border-red-200 shadow hover:bg-red-200"
                        title="Remove from Wishlist"
                        style={{ borderRadius: 8 }}
                        onClick={() => handleRemove(item.id)}
                      >
                        <FaTrashAlt />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
