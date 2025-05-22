import React, { useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

// Mock cart data (replace with context or API in real app)
const cartItems = [
  {
    id: 1,
    name: "Classic Polo Shirt",
    price: 2000,
    image: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
    qty: 2,
    size: "M",
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: 2800,
    image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    qty: 1,
    size: "32",
  },
];

const Cart = () => {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="flex flex-col min-h-screen duration-200 bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 min-h-screen px-4 py-10">
        <div
          className="w-full max-w-3xl p-8 mx-auto shadow-2xl bg-white/90 dark:bg-gray-900/90 rounded-2xl"
          data-aos="fade-up"
        >
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-primary">
            🛒 My Shopping Cart
          </h2>
          {cartItems.length === 0 ? (
            <div className="py-20 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                alt="Empty Cart"
                className="w-32 mx-auto mb-6 opacity-70"
                data-aos="zoom-in"
              />
              <p className="mb-4 text-lg text-gray-500">Your cart is empty.</p>
              <Link
                to="/"
                className="px-8 py-3 font-semibold text-white transition-all rounded-full shadow bg-gradient-to-r from-primary to-secondary hover:scale-105"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-6 py-6 sm:flex-row group"
                    data-aos="fade-right"
                    data-aos-delay={idx * 100}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-24 h-24 transition-all border-2 shadow-md rounded-xl border-primary group-hover:scale-105"
                    />
                    <div className="flex-1 w-full">
                      <h3 className="mb-1 text-xl font-semibold text-primary">
                        {item.name}
                      </h3>
                      <div className="flex gap-4 mb-2 text-sm text-gray-500">
                        <span>
                          Size: <span className="font-medium">{item.size}</span>
                        </span>
                        <span>
                          Qty: <span className="font-medium">{item.qty}</span>
                        </span>
                      </div>
                      <div className="text-lg font-bold text-secondary">
                        Rs. {item.price * item.qty}
                      </div>
                    </div>
                    <button
                      className="p-3 text-red-500 transition-all rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                      title="Remove"
                    >
                      <FaTrashAlt className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-end mt-10">
                <div className="mb-4 text-2xl font-extrabold">
                  Total: <span className="text-primary">Rs. {total}</span>
                </div>
                <Link
                  to="/checkout"
                  className="px-10 py-3 text-lg font-bold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-primary to-secondary hover:scale-105"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/"
                  className="mt-4 underline transition-all text-primary hover:text-secondary"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
