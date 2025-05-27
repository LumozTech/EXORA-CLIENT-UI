import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
  FaTruck,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import adminBg from "../../assets/adminBg.jpg";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const ORDERS_PER_PAGE = 5;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOrder, setModalOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState("");

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and paginate orders
  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.orderId.toLowerCase().includes(search.toLowerCase()) ||
      order.orderedItems.some(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      )
  );
  
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Open modal and set status
  const handleViewDetails = (order) => {
    setModalOrder(order);
    setModalStatus(order.status);
  };

  // Update order status
  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/orders/status',
        {
          orderId: modalOrder.orderId,
          status: modalStatus
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      setOrders(prev =>
        prev.map(o =>
          o.orderId === modalOrder.orderId ? { ...o, status: modalStatus } : o
        )
      );

      toast.success('Order status updated successfully');
      setModalOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Calculate total amount for an order
  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${adminBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Sidebar */}
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          <AdminNavbar pageTitle="Orders" />
          <div
            className="p-6 mt-8 mb-10 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30"
            style={{
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Order Management
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  style={{ minWidth: 200 }}
                />
                <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full text-left align-middle">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Items</th>
                    <th className="px-4 py-2">Total Amount</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Payment</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr
                        key={order.orderId}
                        className="border-t hover:bg-[#E0F2F1]/60 transition"
                        style={{ borderColor: CARD_BORDER }}
                      >
                        <td className="px-4 py-2 align-middle">{order.orderId}</td>
                        <td className="px-4 py-2 align-middle">{order.name}</td>
                        <td className="px-4 py-2 align-middle">
                          {order.orderedItems.map(item => item.name).join(", ")}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          Rs. {calculateOrderTotal(order.orderedItems).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          {formatDate(order.date)}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "completed"
                              ? "bg-green-200 text-green-800"
                              : order.paymentStatus === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-middle">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-200 text-green-800"
                              : order.status === "Preparing"
                              ? "bg-yellow-200 text-yellow-800"
                              : order.status === "Shipped"
                              ? "bg-blue-200 text-blue-800"
                              : order.status === "Cancelled"
                              ? "bg-red-200 text-red-800"
                              : "bg-gray-200 text-gray-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-middle">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            title="View Details"
                            onClick={() => handleViewDetails(order)}
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded font-semibold ${
                    page === i + 1
                      ? "bg-[#00796B] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={page === totalPages || totalPages === 0}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* Order Details Modal */}
        {modalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
              className="relative w-full max-w-5xl p-8 bg-white/30 backdrop-blur-sm shadow-lg rounded-2xl"
              style={{ border: `2px solid ${CARD_BORDER}` }}
            >
              <button
                className="absolute text-2xl text-white top-3 right-3 hover:text-red-500"
                onClick={() => setModalOrder(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3
                className="mb-6 text-2xl font-bold text-center text-white"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                Order Details
              </h3>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column - Customer Info */}
                <div className="p-6 border border-white/20 rounded-xl backdrop-blur-sm bg-white/10">
                  <h4 className="mb-4 text-lg font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    Customer Information
                  </h4>
                  <div className="space-y-4 text-white">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Name</p>
                        <p className="font-semibold">{modalOrder.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Email</p>
                        <p className="font-semibold">{modalOrder.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Phone</p>
                        <p className="font-semibold">{modalOrder.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="mt-1 text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Shipping Address</p>
                        <p className="font-semibold">{modalOrder.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Order Info */}
                <div className="p-6 border border-white/20 rounded-xl backdrop-blur-sm bg-white/10">
                  <h4 className="mb-4 text-lg font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    Order Information
                  </h4>
                  <div className="space-y-4 text-white">
                    <div className="flex items-center gap-3">
                      <FaBox className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Order ID</p>
                        <p className="font-semibold">{modalOrder.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaTruck className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Order Status</p>
                        <select
                          className="px-3 py-1 mt-1 text-sm font-semibold bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:border-white/50"
                          value={modalStatus}
                          onChange={(e) => setModalStatus(e.target.value)}
                        >
                          <option value="Preparing">Preparing</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCreditCard className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Payment Method</p>
                        <p className="font-semibold">{modalOrder.paymentMethod.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMoneyBillWave className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Payment Status</p>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          modalOrder.paymentStatus === "completed"
                            ? "bg-green-200 text-green-800"
                            : modalOrder.paymentStatus === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}>
                          {modalOrder.paymentStatus.charAt(0).toUpperCase() + modalOrder.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Items */}
                <div className="p-6 border border-white/20 rounded-xl backdrop-blur-sm bg-white/10">
                  <h4 className="mb-4 text-lg font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    Order Items
                  </h4>
                  <div className="space-y-4">
                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                      {modalOrder.orderedItems.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 border border-white/20 rounded-lg backdrop-blur-sm bg-white/10"
                        >
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-white/70">
                                Size: {item.size} | Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/20">
                      <div className="flex items-center justify-between text-white">
                        <p className="text-lg font-semibold">Total Amount</p>
                        <p className="text-xl font-bold">
                          Rs. {calculateOrderTotal(modalOrder.orderedItems).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  className="px-6 py-2 font-semibold text-white transition rounded-lg bg-[#00796B] hover:bg-[#005B4F]"
                  onClick={handleUpdateStatus}
                >
                  Update Order Status
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
