import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";

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
        background: "linear-gradient(135deg, #E0F2F1 0%, #CBD5E0 100%)",
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
            className="p-6 mt-8 mb-10 border shadow-md rounded-2xl"
            style={{
              background: CARD_BG,
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold" style={{ color: PRIMARY }}>
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
              className="relative w-full max-w-md p-8 bg-white shadow-lg rounded-2xl"
              style={{ border: `2px solid ${CARD_BORDER}` }}
            >
              <button
                className="absolute text-2xl text-gray-500 top-3 right-3 hover:text-red-500"
                onClick={() => setModalOrder(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3
                className="mb-4 text-xl font-bold text-center"
                style={{ color: PRIMARY }}
              >
                Order Details
              </h3>
              <div className="mb-2">
                <span className="font-semibold">Order ID:</span> {modalOrder.orderId}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Customer:</span> {modalOrder.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Email:</span> {modalOrder.email}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Phone:</span> {modalOrder.phone}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Address:</span> {modalOrder.address}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Payment Method:</span>{" "}
                {modalOrder.paymentMethod.toUpperCase()}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Payment Status:</span>{" "}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  modalOrder.paymentStatus === "completed"
                    ? "bg-green-200 text-green-800"
                    : modalOrder.paymentStatus === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}>
                  {modalOrder.paymentStatus.charAt(0).toUpperCase() + modalOrder.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Items:</span>
                <ul className="mt-2 ml-4 space-y-1">
                  {modalOrder.orderedItems.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity}x (Size: {item.size}) - Rs. {item.price * item.quantity}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-right font-semibold">
                  Total: Rs. {calculateOrderTotal(modalOrder.orderedItems).toLocaleString()}
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Status:</span>
                <select
                  className="px-2 py-1 ml-2 border rounded"
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
              <button
                className="w-full py-2 mt-2 font-semibold text-white rounded-lg bg-[#00796B] hover:bg-[#005B4F] transition"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
