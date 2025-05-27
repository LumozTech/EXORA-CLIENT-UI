import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // Fetch cart data
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your cart');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, size, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/cart/update', 
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      await fetchCart(); // Refresh cart data
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating cart');
      console.error('Error updating cart:', error);
    }
  };

  // Remove item from cart
  const removeItem = async (productId, size) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}/${size}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart(); // Refresh cart data
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing item');
      console.error('Error removing item:', error);
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    return `Rs. ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen duration-200 bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-white">
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <div className="w-16 h-16 border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen duration-200 bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-white">
      <Navbar />
      <ToastContainer />
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <div
          className="w-full max-w-3xl p-8 mx-auto shadow-2xl bg-white/90 dark:bg-gray-900/90 rounded-2xl"
          data-aos="fade-up"
        >
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-primary">
            🛒 My Shopping Cart
          </h2>
          {cart.items.length === 0 ? (
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
                {cart.items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex flex-col items-center gap-6 py-6 sm:flex-row group"
                    data-aos="fade-right"
                    data-aos-delay={idx * 100}
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="object-cover w-24 h-24 transition-all border-2 shadow-md rounded-xl border-primary group-hover:scale-105"
                    />
                    <div className="flex-1 w-full">
                      <h3 className="mb-1 text-xl font-semibold text-primary">
                        {item.productName}
                      </h3>
                      <div className="flex gap-4 mb-2 text-sm text-gray-500">
                        <span>
                          Size: <span className="font-medium">{item.size}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span>Qty:</span>
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, item.size, parseInt(e.target.value))}
                            className="px-2 py-1 bg-gray-100 rounded dark:bg-gray-800"
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-secondary">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
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
                  Total: <span className="text-primary">{formatPrice(cart.totalAmount)}</span>
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
