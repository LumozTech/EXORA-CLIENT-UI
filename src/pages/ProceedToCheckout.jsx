import React, { useState, useEffect } from "react";
import {
  FaUniversity,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useCart } from "../context/CartContext";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { getApiUrl } from '../config/api';

// Mock order summary (replace with real cart/total in production)
const orderSummary = {
  items: [
    { name: "Classic Polo Shirt", qty: 2, price: 2000 },
    { name: "Denim Jeans", qty: 1, price: 2800 },
  ],
  total: 6800,
};

const ProceedToCheckout = () => {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [processing, setProcessing] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postal: "",
    country: "",
  });
  const [billing, setBilling] = useState({
    address: "",
    city: "",
    postal: "",
    country: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [buyNowItem, setBuyNowItem] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // Handle direct buy now items
  useEffect(() => {
    if (location.state?.buyNowItem) {
      setBuyNowItem(location.state.buyNowItem);
      setOrderDetails({
        orderedItems: [{
          ...location.state.buyNowItem,
          quantity: 1
        }],
        total: location.state.buyNowItem.price,
        labelTotal: location.state.buyNowItem.lastPrice || location.state.buyNowItem.price
      });
    }
  }, [location.state]);

  // Fetch order details when component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // If it's a buy now item, don't fetch cart details
        if (buyNowItem) return;

        const response = await axios.post(
          getApiUrl('/api/orders/quote'),
          {
            items: cart.items.map(item => ({
              productId: item.productId,
              qty: item.quantity
            })),
            shippingAddress: shipping
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setShowFailed(true);
      }
    };

    if (!buyNowItem && cart.items.length > 0) {
      fetchOrderDetails();
    }
  }, [cart.items, buyNowItem, shipping]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const fullShippingAddress = `${shipping.address}, ${shipping.city}, ${shipping.postal}, ${shipping.country}`;

      // Create order data based on whether it's a buy now item or cart items
      const orderData = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: fullShippingAddress,
        orderedItems: buyNowItem ? 
          [{
            productId: buyNowItem.productId,
            qty: 1,
            price: buyNowItem.price,
            size: buyNowItem.size || 'M'
          }] :
          cart.items.map(item => ({
            productId: item.productId,
            qty: item.quantity
          })),
        paymentMethod: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'processing'
      };

      const response = await axios.post(
        getApiUrl('/api/orders'),
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        setShowSuccess(true);
        // Only clear cart if it wasn't a buy now item
        if (!buyNowItem) {
          await clearCart();
        }
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setShowFailed(true);
    } finally {
      setProcessing(false);
    }
  };

  // Show empty state if no items to checkout
  if (!buyNowItem && cart.items.length === 0) {
    return (
      <div className="min-h-screen duration-200 bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="mb-4 text-2xl font-bold">No items to checkout</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 text-white transition-all rounded-full shadow bg-gradient-to-r from-primary to-secondary hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen duration-200 bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 min-h-screen px-4 py-10">
        <div
          className="w-full max-w-4xl p-8 mx-auto shadow-2xl bg-white/90 dark:bg-gray-900/90 rounded-2xl"
          data-aos="fade-up"
        >
          <h2 className="mb-8 text-4xl font-extrabold tracking-tight text-center text-primary">
            Secure Checkout
          </h2>
          <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-2">
            {/* Customer Details */}
            <div
              className="p-6 shadow bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl"
              data-aos="fade-right"
            >
              <h3 className="mb-4 text-lg font-bold text-primary">
                Customer Details
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            {/* Shipping Details */}
            <div
              className="p-6 shadow bg-gradient-to-br from-blue-100/40 to-blue-200/40 dark:from-gray-800 dark:to-gray-900 rounded-2xl"
              data-aos="fade-left"
            >
              <h3 className="mb-4 text-lg font-bold text-blue-600">
                Shipping Details
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Shipping Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                  value={shipping.address}
                  onChange={(e) =>
                    setShipping({ ...shipping, address: e.target.value })
                  }
                  required
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping({ ...shipping, city: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                    value={shipping.postal}
                    onChange={(e) =>
                      setShipping({ ...shipping, postal: e.target.value })
                    }
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                  value={shipping.country}
                  onChange={(e) =>
                    setShipping({ ...shipping, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          {/* Billing Details */}
          <div
            className="p-6 mb-10 shadow bg-gradient-to-br from-pink-100/40 to-pink-200/40 dark:from-gray-800 dark:to-gray-900 rounded-2xl"
            data-aos="fade-up"
          >
            <h3 className="mb-4 text-lg font-bold text-pink-600">
              Billing Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Billing Address"
                className="col-span-2 px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                value={billing.address}
                onChange={(e) =>
                  setBilling({ ...billing, address: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="City"
                className="px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                value={billing.city}
                onChange={(e) =>
                  setBilling({ ...billing, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                value={billing.postal}
                onChange={(e) =>
                  setBilling({ ...billing, postal: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Country"
                className="px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                value={billing.country}
                onChange={(e) =>
                  setBilling({ ...billing, country: e.target.value })
                }
                required
              />
            </div>
          </div>
          {/* Order Summary & Payment */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Order Summary */}
            <div
              className="p-6 shadow bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl"
              data-aos="fade-right"
            >
              <h3 className="mb-2 text-lg font-semibold text-secondary">
                Order Summary
              </h3>
              <ul className="mb-2">
                {orderDetails?.orderedItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between mb-1 text-gray-700 dark:text-gray-300"
                  >
                    <span>
                      {item.name}{" "}
                      <span className="text-xs text-gray-400">x{item.quantity}</span>
                    </span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between pt-2 mt-2 text-lg font-bold border-t">
                <span>Total</span>
                <span className="text-primary">Rs. {orderDetails?.total}</span>
              </div>
              {orderDetails?.labelTotal > orderDetails?.total && (
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>You Save</span>
                  <span>Rs. {orderDetails.labelTotal - orderDetails.total}</span>
                </div>
              )}
            </div>
            {/* Payment Methods */}
            <form
              onSubmit={handlePayment}
              className="p-6 shadow bg-gradient-to-br from-blue-100/80 to-pink-100/80 dark:from-gray-900 dark:to-gray-800 rounded-2xl"
              data-aos="fade-left"
            >
              <h3 className="mb-3 text-lg font-semibold text-secondary">
                Select Payment Method
              </h3>
              <div className="mb-8 space-y-4">
                <label className="flex items-center gap-3 p-3 transition-all border rounded-lg cursor-pointer hover:border-primary dark:border-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="accent-primary"
                  />
                  <FaUniversity className="text-xl text-primary" />
                  <span>Bank Transfer</span>
                </label>
                {/* Show bank details if bank transfer is selected */}
                {paymentMethod === "bank" && (
                  <div className="p-4 mt-2 mb-4 border border-blue-300 rounded-lg bg-blue-200/60 dark:bg-blue-900/40 dark:border-blue-800 animate-fade-in">
                    <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
                      Bank Details
                    </h4>
                    <div className="mb-1 text-sm text-gray-700 dark:text-gray-200">
                      <span className="font-bold">Account Name:</span> Exora
                      Clothing Pvt Ltd
                    </div>
                    <div className="mb-1 text-sm text-gray-700 dark:text-gray-200">
                      <span className="font-bold">Account Number:</span>{" "}
                      1234567890
                    </div>
                    <div className="mb-1 text-sm text-gray-700 dark:text-gray-200">
                      <span className="font-bold">Bank:</span> Commercial Bank
                      of Ceylon PLC
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-200">
                      <span className="font-bold">Branch:</span> Colombo Main
                      Branch
                    </div>
                  </div>
                )}
                <label className="flex items-center gap-3 p-3 transition-all border rounded-lg cursor-pointer hover:border-primary dark:border-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-primary"
                  />
                  <FaMoneyBillWave className="text-xl text-green-600" />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-3 transition-all border rounded-lg cursor-pointer hover:border-primary dark:border-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="accent-primary"
                  />
                  <FaCreditCard className="text-xl text-blue-600" />
                  <span>Credit/Debit Card (Stripe)</span>
                </label>
              </div>
              {/* Stripe Payment Placeholder */}
              {paymentMethod === "stripe" && (
                <div
                  className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50 dark:bg-gray-800 dark:border-blue-900"
                  data-aos="fade-in"
                >
                  <p className="mb-2 font-semibold text-blue-700 dark:text-blue-300">
                    Stripe Payment
                  </p>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="px-3 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={processing || !customer.name || !customer.email || !customer.phone || !shipping.address}
                className={`w-full py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg transition-all ${
                  processing || !customer.name || !customer.email || !customer.phone || !shipping.address
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                {processing ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center p-8 bg-white shadow-2xl dark:bg-gray-900 rounded-2xl animate-fade-in">
            <FaCheckCircle className="mb-4 text-6xl text-green-500" />
            <h2 className="mb-2 text-2xl font-bold text-green-700 dark:text-green-400">
              Order Placed Successfully!
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              Your order has been placed successfully.
            </p>
            <button
              className="px-6 py-2 font-semibold text-white transition-all rounded-full shadow bg-gradient-to-r from-primary to-secondary hover:scale-105"
              onClick={() => {
                setShowSuccess(false);
                navigate("/orders");
              }}
            >
              Go to My Orders
            </button>
          </div>
        </div>
      )}
      {/* Failed Modal */}
      {showFailed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center p-8 bg-white shadow-2xl dark:bg-gray-900 rounded-2xl animate-fade-in">
            <FaTimesCircle className="mb-4 text-6xl text-red-500" />
            <h2 className="mb-2 text-2xl font-bold text-red-700 dark:text-red-400">
              Order Failed
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              Something went wrong. Please try again.
            </p>
            <button
              className="px-6 py-2 font-semibold text-white transition-all rounded-full shadow bg-gradient-to-r from-primary to-secondary hover:scale-105"
              onClick={() => setShowFailed(false)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProceedToCheckout;
