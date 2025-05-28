import React, { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaSpinner,
  FaBox,
  FaShoppingBag
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { getApiUrl } from '../config/api';

const statusColors = {
  Delivered: "text-green-600",
  Processing: "text-blue-600",
  Shipped: "text-yellow-600",
  Cancelled: "text-red-600",
  Preparing: "text-orange-600"
};

const statusBgColors = {
  Delivered: "bg-green-200",
  Processing: "bg-blue-200",
  Shipped: "bg-yellow-200",
  Cancelled: "bg-red-200",
  Preparing: "bg-orange-200"
};

const getOrderTimeline = (status, date) => {
  const timeline = [
    {
      label: "Order Placed",
      icon: <FaShoppingBag />,
      done: true,
      date: new Date(date).toLocaleDateString()
    },
    {
      label: "Preparing",
      icon: <FaBox />,
      done: ["Processing", "Shipped", "Delivered"].includes(status)
    },
    {
      label: "Shipped",
      icon: <FaTruck />,
      done: ["Shipped", "Delivered"].includes(status)
    },
    {
      label: "Delivered",
      icon: <FaCheckCircle />,
      done: status === "Delivered"
    }
  ];

  if (status === "Cancelled") {
    return [
      timeline[0],
      {
        label: "Cancelled",
        icon: <FaTimesCircle />,
        done: true,
        date: new Date(date).toLocaleDateString()
      }
    ];
  }

  return timeline;
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(getApiUrl('/api/orders'), {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Calculate order total
  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen duration-200 bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-start flex-1 min-h-screen px-4 py-10">
        <div
          className="w-full max-w-4xl p-8 mx-auto shadow-2xl bg-white/90 dark:bg-gray-900/90 rounded-2xl"
          data-aos="fade-up"
        >
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-primary">
            My Orders
          </h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="mb-4 text-4xl animate-spin text-primary" />
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <FaBoxOpen className="mx-auto mb-4 text-6xl text-gray-300" />
              <p className="mb-4 text-lg text-gray-500">
                You have no orders yet.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 font-semibold text-white transition-all rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, idx) => (
                <div
                  key={order.orderId}
                  className="rounded-xl shadow-lg bg-white/80 dark:bg-gray-800/80 border border-primary/10 p-6 transition-all hover:scale-[1.01] relative"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-primary">
                          Order #{order.orderId}
                        </span>
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            statusBgColors[order.status]
                          } ${statusColors[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="mb-2 text-xs text-gray-500">
                        Placed on {formatDate(order.date)}
                      </div>
                      <div className="font-semibold text-secondary">
                        Total: Rs. {calculateOrderTotal(order.orderedItems).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${statusColors[order.status]}`}>
                        {order.paymentStatus === 'completed' ? 'Payment Completed' : 'Payment Pending'}
                      </span>
                      <button
                        className="flex items-center gap-1 px-3 py-1 ml-2 text-sm font-semibold transition-all border rounded-full text-primary border-primary hover:bg-primary/10"
                        onClick={() => setExpanded(expanded === idx ? null : idx)}
                      >
                        <FaChevronDown
                          className={`transition-transform ${
                            expanded === idx ? "rotate-180" : ""
                          }`}
                        />
                        {expanded === idx ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>
                  {/* Expandable Order Details */}
                  {expanded === idx && (
                    <div className="mt-6 animate-fade-in">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-bold text-primary">Items</h4>
                          <ul className="space-y-3">
                            {order.orderedItems.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-4 p-3 rounded-lg shadow bg-gray-50 dark:bg-gray-900"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="object-cover w-16 h-16 border-2 rounded-lg border-primary"
                                />
                                <div>
                                  <div className="font-semibold">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Qty: {item.quantity} | Size: {item.size}
                                  </div>
                                  <div className="font-bold text-secondary">
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="p-4 mt-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                              <span>Rs. {calculateOrderTotal(order.orderedItems).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                              <span className="uppercase">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between pt-2 mt-2 border-t">
                              <span className="font-bold">Total:</span>
                              <span className="font-bold text-primary">
                                Rs. {calculateOrderTotal(order.orderedItems).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-2 font-bold text-primary">
                            Order Tracking
                          </h4>
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <ul className="space-y-4">
                              {getOrderTimeline(order.status, order.date).map((step, j) => (
                                <li key={j} className="flex items-center gap-3">
                                  <span
                                    className={`text-xl ${
                                      step.done
                                        ? "text-green-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step.icon}
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      step.done
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                  <span className="ml-auto text-xs text-gray-400">
                                    {step.date || ""}
                                  </span>
                                  {step.done ? (
                                    <FaCheckCircle className="ml-2 text-green-400" />
                                  ) : (
                                    <FaTimesCircle className="ml-2 text-gray-300" />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 mt-4 space-y-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                            <h4 className="font-bold text-primary">Shipping Details</h4>
                            <div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Name:</div>
                              <div className="font-semibold">{order.name}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Phone:</div>
                              <div className="font-semibold">{order.phone}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Address:</div>
                              <div className="font-semibold">{order.address}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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

export default MyOrders;
