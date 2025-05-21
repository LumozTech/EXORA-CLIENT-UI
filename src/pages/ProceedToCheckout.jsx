import React, { useState } from "react";
import { FaUniversity, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

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

  const navigate = useNavigate();

  React.useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigate("/orders");
    }, 2000);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen px-4 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Change overlay color from white to a soft blue */}
      <div className="absolute inset-0 bg-blue-100/80 dark:bg-gray-900/90 -z-10" />
      <div
        className="w-full max-w-4xl p-8 shadow-2xl bg-blue-50/90 dark:bg-gray-900/90 rounded-3xl"
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
              onChange={(e) => setBilling({ ...billing, city: e.target.value })}
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
              {orderSummary.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between mb-1 text-gray-700 dark:text-gray-300"
                >
                  <span>
                    {item.name}{" "}
                    <span className="text-xs text-gray-400">x{item.qty}</span>
                  </span>
                  <span>Rs. {item.price * item.qty}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-2 mt-2 text-lg font-bold border-t">
              <span>Total</span>
              <span className="text-primary">Rs. {orderSummary.total}</span>
            </div>
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
                    <span className="font-bold">Bank:</span> Commercial Bank of
                    Ceylon PLC
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
                  {/* In production, integrate Stripe Elements here */}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={processing}
              className={`w-full py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg transition-all ${
                processing ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {processing ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProceedToCheckout;
