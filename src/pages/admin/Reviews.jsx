import React, { useState } from "react";
import {
  FaStar,
  FaCheck,
  FaTimes,
  FaSearch,
  FaUserCircle,
  FaBoxOpen,
} from "react-icons/fa";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

// Example review data
const initialReviews = [
  {
    id: 1,
    user: { name: "Nimal", avatar: "" },
    product: { name: "Classic Polo Shirt", image: "" },
    rating: 5,
    comment: "Great quality and fast delivery!",
    status: "Approved",
    date: "2025-05-20",
  },
  {
    id: 2,
    user: { name: "Kasun", avatar: "" },
    product: { name: "Denim Jeans", image: "" },
    rating: 4,
    comment: "Good fit, but color is a bit different.",
    status: "Pending",
    date: "2025-05-19",
  },
  {
    id: 3,
    user: { name: "Sahan", avatar: "" },
    product: { name: "Formal Suit", image: "" },
    rating: 2,
    comment: "Not satisfied with the material.",
    status: "Rejected",
    date: "2025-05-18",
  },
];

const REVIEWS_PER_PAGE = 5;

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Pagination and search
  const filteredReviews = reviews.filter(
    (review) =>
      review.user.name.toLowerCase().includes(search.toLowerCase()) ||
      review.product.name.toLowerCase().includes(search.toLowerCase()) ||
      review.comment.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  // Approve/Reject handlers
  const handleApprove = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };
  const handleReject = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
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
          <AdminNavbar pageTitle="Reviews" />
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
                Review Management
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reviews..."
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
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Rating</th>
                    <th className="px-4 py-2">Comment</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReviews.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-gray-500"
                      >
                        No reviews found.
                      </td>
                    </tr>
                  ) : (
                    paginatedReviews.map((review) => (
                      <tr
                        key={review.id}
                        className="border-t hover:bg-[#E0F2F1]/60 transition"
                        style={{ borderColor: CARD_BORDER }}
                      >
                        <td className="px-4 py-2 align-middle">
                          {review.user.name}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          {review.product.name}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          <span className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-middle">
                          {review.comment}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          {review.date}
                        </td>
                        <td className="px-4 py-2 align-middle">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              review.status === "Approved"
                                ? "bg-green-200 text-green-800"
                                : review.status === "Pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {review.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-middle">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(review.id)}
                              disabled={review.status === "Approved"}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                              title="Approve"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(review.id)}
                              disabled={review.status === "Rejected"}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                              title="Reject"
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
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
      </main>
    </div>
  );
};

export default Reviews;
