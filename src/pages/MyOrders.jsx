import React, { useEffect } from "react";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
} from "react-icons/fa";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

// Mock orders data (replace with real API data)
const orders = [
  {
    id: "ORD123456",
    date: "2025-05-20",
    status: "Shipped",
    total: 4800,
    tracking: "In Transit",
    items: [
      {
        name: "Classic Polo Shirt",
        qty: 2,
        price: 2000,
        image:
          "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      },
      {
        name: "Denim Jeans",
        qty: 1,
        price: 2800,
        image:
          "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      },
    ],
    timeline: [
      {
        label: "Order Placed",
        date: "2025-05-20",
        icon: <FaBoxOpen />,
        done: true,
      },
      { label: "Shipped", date: "2025-05-21", icon: <FaTruck />, done: true },
      {
        label: "Out for Delivery",
        date: "2025-05-22",
        icon: <FaTruck />,
        done: false,
      },
      { label: "Delivered", date: "", icon: <FaCheckCircle />, done: false },
    ],
  },
  {
    id: "ORD123457",
    date: "2025-05-10",
    status: "Delivered",
    total: 3200,
    tracking: "Delivered",
    items: [
      {
        name: "Kids T-shirt",
        qty: 2,
        price: 1600,
        image:
          "https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg",
      },
    ],
    timeline: [
      {
        label: "Order Placed",
        date: "2025-05-10",
        icon: <FaBoxOpen />,
        done: true,
      },
      { label: "Shipped", date: "2025-05-11", icon: <FaTruck />, done: true },
      {
        label: "Out for Delivery",
        date: "2025-05-12",
        icon: <FaTruck />,
        done: true,
      },
      {
        label: "Delivered",
        date: "2025-05-13",
        icon: <FaCheckCircle />,
        done: true,
      },
    ],
  },
];

const statusColors = {
  Delivered: "text-green-600",
  "In Transit": "text-blue-600",
  Shipped: "text-yellow-600",
  Cancelled: "text-red-600",
};

const MyOrders = () => {
  const [expanded, setExpanded] = React.useState(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

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
          {orders.length === 0 ? (
            <div className="py-20 text-center">
              <FaBoxOpen className="mx-auto mb-4 text-6xl text-gray-300" />
              <p className="mb-4 text-lg text-gray-500">
                You have no orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, idx) => (
                <div
                  key={order.id}
                  className="rounded-xl shadow-lg bg-white/80 dark:bg-gray-800/80 border border-primary/10 p-6 transition-all hover:scale-[1.01] relative"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-primary">
                          Order #{order.id}
                        </span>
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-opacity-20 ${
                            statusColors[order.status] ||
                            "text-gray-600 bg-gray-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="mb-2 text-xs text-gray-500">
                        Placed on {order.date}
                      </div>
                      <div className="font-semibold text-secondary">
                        Total: Rs. {order.total}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          statusColors[order.tracking] || "text-gray-600"
                        }`}
                      >
                        {order.tracking}
                      </span>
                      <button
                        className="flex items-center gap-1 px-3 py-1 ml-2 text-sm font-semibold transition-all border rounded-full text-primary border-primary hover:bg-primary/10"
                        onClick={() =>
                          setExpanded(expanded === idx ? null : idx)
                        }
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
                            {order.items.map((item, i) => (
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
                                    Qty: {item.qty}
                                  </div>
                                  <div className="font-bold text-secondary">
                                    Rs. {item.price}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 font-bold text-primary">
                            Order Tracking
                          </h4>
                          <ul className="space-y-2">
                            {order.timeline.map((step, j) => (
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
                                  {step.date}
                                </span>
                                {step.done && (
                                  <FaCheckCircle className="ml-2 text-green-400" />
                                )}
                                {!step.done && (
                                  <FaTimesCircle className="ml-2 text-gray-300" />
                                )}
                              </li>
                            ))}
                          </ul>
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
