import React, { useState } from "react";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaTruck,
  FaEllipsisV,
  FaEye,
} from "react-icons/fa";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

// Example order data
const initialOrders = [
  {
    id: "ORD-001",
    user: "Nimal",
    product: "Classic Polo Shirt",
    amount: "Rs. 2,000",
    status: "Delivered",
    date: "2025-05-20",
    address: "123 Main St, Colombo",
    phone: "0771234567",
    note: "Please deliver after 5pm.",
  },
  {
    id: "ORD-002",
    user: "Kasun",
    product: "Denim Jeans",
    amount: "Rs. 2,800",
    status: "Pending",
    date: "2025-05-19",
    address: "456 Lake Rd, Kandy",
    phone: "0779876543",
    note: "",
  },
  {
    id: "ORD-003",
    user: "Sahan",
    product: "Formal Suit",
    amount: "Rs. 8,500",
    status: "Shipped",
    date: "2025-05-18",
    address: "789 Hill St, Galle",
    phone: "0712345678",
    note: "Gift wrap, please.",
  },
];

const ORDERS_PER_PAGE = 5;

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOrder, setModalOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState("");

  // Pagination and search
  const filteredOrders = orders.filter(
    (order) =>
      order.user.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  // Open modal and set status
  const handleViewDetails = (order) => {
    setModalOrder(order);
    setModalStatus(order.status);
  };

  // Update order status from modal
  const handleUpdateStatus = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === modalOrder.id ? { ...o, status: modalStatus } : o
      )
    );
    setModalOrder(null);
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
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t hover:bg-[#E0F2F1]/60 transition"
                        style={{ borderColor: CARD_BORDER }}
                      >
                        <td className="px-4 py-2 align-middle">{order.id}</td>
                        <td className="px-4 py-2 align-middle">{order.user}</td>
                        <td className="px-4 py-2 align-middle">
                          {order.product}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          {order.amount}
                        </td>
                        <td className="px-4 py-2 align-middle">{order.date}</td>
                        <td className="px-4 py-2 align-middle">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "Delivered"
                                ? "bg-green-200 text-green-800"
                                : order.status === "Pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : order.status === "Shipped"
                                ? "bg-blue-200 text-blue-800"
                                : order.status === "Cancelled"
                                ? "bg-red-200 text-red-800"
                                : ""
                            }`}
                          >
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
                <span className="font-semibold">Order ID:</span> {modalOrder.id}
              </div>
              <div className="mb-2">
                <span className="font-semibold">User:</span> {modalOrder.user}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Product:</span>{" "}
                {modalOrder.product}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Amount:</span>{" "}
                {modalOrder.amount}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Date:</span> {modalOrder.date}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Address:</span>{" "}
                {modalOrder.address}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Phone:</span> {modalOrder.phone}
              </div>
              {modalOrder.note && (
                <div className="mb-2">
                  <span className="font-semibold">Note:</span> {modalOrder.note}
                </div>
              )}
              <div className="mb-4">
                <span className="font-semibold">Status:</span>
                <select
                  className="px-2 py-1 ml-2 border rounded"
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
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
