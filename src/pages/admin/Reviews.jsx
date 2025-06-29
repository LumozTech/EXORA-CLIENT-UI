import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaCheck,
  FaTimes,
  FaSearch,
  FaSpinner,
  FaFilter,
  FaUser,
  FaBox,
  FaCalendar,
  FaComment,
} from "react-icons/fa";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../../assets/adminBg.jpg";
import { getApiUrl } from '../../config/api';

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

const REVIEWS_PER_PAGE = 5;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [page, setPage] = useState(1);
  const [processing, setProcessing] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch reviews and products from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const [reviewsRes, productsRes] = await Promise.all([
          axios.get(getApiUrl("/api/reviews"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(getApiUrl("/api/products"), {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setReviews(reviewsRes.data.message || []);
        setProducts(productsRes.data.list || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle review visibility update
  const handleUpdateVisibility = async (reviewId, hidden, action) => {
    try {
      setProcessing(reviewId);
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        getApiUrl(`/api/reviews/${reviewId}/visibility`),
        { hidden },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setReviews(reviews.map(review => 
          review._id === reviewId 
            ? { ...review, hidden } 
            : review
        ));
        toast.success(`Review ${action} successfully`);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.response?.data?.message || "Failed to update review status");
    } finally {
      setProcessing(null);
    }
  };

  // Filter reviews by product and search
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.email?.toLowerCase().includes(search.toLowerCase()) ||
      review.productName?.toLowerCase().includes(search.toLowerCase()) ||
      review.review?.toLowerCase().includes(search.toLowerCase());
    
    const matchesProduct = 
      selectedProduct === "all" || 
      review.productId === selectedProduct;

    return matchesSearch && matchesProduct;
  });

  // Group reviews by product
  const reviewsByProduct = filteredReviews.reduce((acc, review) => {
    if (!acc[review.productId]) {
      acc[review.productId] = [];
    }
    acc[review.productId].push(review);
    return acc;
  }, {});

  // Get product details
  const getProductDetails = (productId) => {
    return products.find(p => p._id === productId) || { productName: 'Unknown Product' };
  };

  // Calculate stats for a product
  const getProductStats = (productReviews) => {
    const approvedReviews = productReviews.filter(r => !r.hidden);
    const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / (approvedReviews.length || 1);
    return {
      total: productReviews.length,
      approved: approvedReviews.length,
      pending: productReviews.filter(r => !r.hidden).length,
      avgRating: avgRating.toFixed(1)
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="mt-6 ml-6">
          <SlideBar />
        </div>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="text-4xl text-primary animate-spin" />
          </div>
        </main>
      </div>
    );
  }

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
      <ToastContainer />
      {/* Sidebar */}
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          <AdminNavbar pageTitle="Reviews" />
          <div
            className="p-6 mt-8 mb-10 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30"
            style={{
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            {/* Filters */}
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Review Management
              </h2>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="all">All Products</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName}
                    </option>
                  ))}
                </select>
              </div>
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

            {/* Reviews by Product */}
            {Object.entries(reviewsByProduct).length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No reviews found matching your criteria.
              </div>
            ) : (
              Object.entries(reviewsByProduct).map(([productId, productReviews]) => {
                const product = getProductDetails(productId);
                const stats = getProductStats(productReviews);
                
                return (
                  <div key={productId} className="mb-8">
                    {/* Product Header */}
                    <div className="flex items-center justify-between p-4 mb-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-lg font-semibold">{product.productName}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Total Reviews: {stats.total}</span>
                          <span>Approved: {stats.approved}</span>
                          <span>Average Rating: {stats.avgRating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reviews Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-full text-left align-middle">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-white">User</th>
                    <th className="px-4 py-2 text-white">Rating</th>
                    <th className="px-4 py-2 text-white">Review</th>
                    <th className="px-4 py-2 text-white">Date</th>
                    <th className="px-4 py-2 text-white">Status</th>
                    <th className="px-4 py-2 text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                          {productReviews.map((review) => (
                      <tr
                              key={review._id}
                      className="border-t hover:bg-[#E0F2F1]/60 transition cursor-pointer"
                      onClick={() => setSelectedReview(review)}
                      >
                      <td className="px-4 py-2 text-white">{review.email}</td>
                              <td className="px-4 py-2">
                          <span className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </span>
                        </td>
                      <td className="px-4 py-2 text-white">{review.review}</td>
                      <td className="px-4 py-2 text-white">
                                {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                              <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    !review.hidden
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                                  {!review.hidden ? "Approved" : "Rejected"}
                          </span>
                        </td>
                      <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button
                                    onClick={() => handleUpdateVisibility(review._id, false, "approved")}
                                    disabled={processing === review._id || !review.hidden}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                    {processing === review._id ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <>
                              <FaCheck /> Approve
                                      </>
                                    )}
                            </button>
                            <button
                                    onClick={() => handleUpdateVisibility(review._id, true, "rejected")}
                                    disabled={processing === review._id || review.hidden}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                    {processing === review._id ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <>
                              <FaTimes /> Reject
                                      </>
                                    )}
                            </button>
                          </div>
                        </td>
                      </tr>
                          ))}
                </tbody>
              </table>
            </div>
            </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="relative w-full max-w-3xl p-8 bg-white/30 backdrop-blur-sm shadow-lg rounded-2xl"
            style={{ border: `2px solid ${CARD_BORDER}` }}
          >
            <button
              className="absolute text-2xl text-gray-100 top-3 right-3 hover:text-red-500"
              onClick={() => setSelectedReview(null)}
              aria-label="Close"
            >
              &times;
            </button>

            <h3
              className="mb-6 text-2xl font-bold text-center text-gray-100"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              Review Details
            </h3>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Left Column - User & Product Info */}
              <div className="p-6 border border-white/20 rounded-xl backdrop-blur-sm bg-white/10">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaUser className="text-gray-200" />
                      <h4 className="text-lg font-semibold text-gray-100" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                        User Information
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">Email</p>
                    <p className="font-semibold text-gray-100">{selectedReview.email}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaBox className="text-gray-200" />
                      <h4 className="text-lg font-semibold text-gray-100" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                        Product Information
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300">Product Name</p>
                    <p className="font-semibold text-gray-100">{selectedReview.productName}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaCalendar className="text-gray-200" />
                      <h4 className="text-lg font-semibold text-gray-100" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                        Review Date
                      </h4>
                    </div>
                    <p className="font-semibold text-gray-100">{formatDate(selectedReview.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Review Content */}
              <div className="p-6 border border-white/20 rounded-xl backdrop-blur-sm bg-white/10">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaStar className="text-yellow-400" />
                      <h4 className="text-lg font-semibold text-gray-100" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                        Rating
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-2xl ${
                            i < selectedReview.rating ? "text-yellow-400" : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-lg font-semibold text-gray-100">
                        ({selectedReview.rating}/5)
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaComment className="text-gray-200" />
                      <h4 className="text-lg font-semibold text-gray-100" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                        Review Content
                      </h4>
                    </div>
                    <p className="p-4 text-gray-100 border border-white/20 rounded-lg backdrop-blur-sm bg-white/10">
                      {selectedReview.review}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-4 text-lg font-semibold text-gray-100" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                      Review Status
                    </h4>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          !selectedReview.hidden
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {!selectedReview.hidden ? "Approved" : "Rejected"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleUpdateVisibility(selectedReview._id, false, "approved");
                            setSelectedReview(null);
                          }}
                          disabled={processing === selectedReview._id || !selectedReview.hidden}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-gray-100 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => {
                            handleUpdateVisibility(selectedReview._id, true, "rejected");
                            setSelectedReview(null);
                          }}
                          disabled={processing === selectedReview._id || selectedReview.hidden}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-gray-100 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
