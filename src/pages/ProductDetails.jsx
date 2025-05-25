import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaHeart, FaRegHeart, FaStar, FaRegSmile, FaRegThumbsUp, FaClock } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const params = useParams();
  const productId = params.productId;
  console.log('URL Parameters:', params);
  console.log('Product ID from URL:', productId);
  
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    productId: "",
    productName: "",
  });
  const [userReviewStatus, setUserReviewStatus] = useState(null);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!productId) {
        console.error('No product ID available');
        toast.error('Product ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${productId}`),
          axios.get(`http://localhost:5000/api/reviews/customer-reviews`)
        ]);

        if (productRes.data) {
          setProduct(productRes.data);
          setReviewForm(prev => ({
            ...prev,
            productId: productRes.data._id,
            productName: productRes.data.productName
          }));

          // Filter reviews for this specific product and not hidden
          console.log('All reviews:', reviewsRes.data.message);
          console.log('Product ID:', productRes.data._id);
          
          const productReviews = reviewsRes.data.message.filter(review => {
            console.log('Comparing:', review.productId, productRes.data._id);
            return review.productId === productRes.data._id && !review.hidden;
          });
          
          console.log('Filtered reviews:', productReviews);
          setReviews(productReviews);

          // Check if user has a review for this product
          const token = localStorage.getItem('token');
          if (token) {
            const userEmail = JSON.parse(atob(token.split('.')[1])).email;
            const userReview = reviewsRes.data.message.find(
              review => review.email === userEmail && review.productId === productRes.data._id
            );
            if (userReview) {
              setUserReviewStatus(userReview.hidden ? 'pending' : 'approved');
            }
          }
        } else {
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Group reviews by rating
  const reviewsByRating = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    return `Rs. ${price.toLocaleString()}`;
  };

  // Handle review submission
  const handleAddReview = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add a review');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          productId: reviewForm.productId,
          productName: reviewForm.productName,
          rating: reviewForm.rating,
          review: reviewForm.comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        toast.success('Review submitted successfully! Waiting for admin approval.');
        setUserReviewStatus('pending');
        setShowReviewModal(false);
        setReviewForm(prev => ({
          ...prev,
          rating: 5,
          comment: ""
        }));

        // Refresh reviews after submission
        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/customer-reviews`);
        const productReviews = reviewsRes.data.message.filter(
          review => review.productId === reviewForm.productId && !review.hidden
        );
        setReviews(productReviews);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-red-500">Product not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen duration-200 bg-white dark:bg-gray-900 dark:text-white">
      <ToastContainer />
      <Navbar />
      <div className="container px-4 py-10 mx-auto">
        {/* Product Main Section */}
        <div className="flex flex-col gap-10 md:flex-row" data-aos="fade-up">
          {/* Images */}
          <div className="flex flex-col gap-4 md:w-1/2">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={product.productName}
              className="object-cover w-full transition-transform duration-500 rounded-lg shadow-xl h-96 hover:scale-105"
              data-aos="zoom-in"
            />
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.productName}-${idx + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition-all duration-300 ${
                      selectedImage === idx
                        ? "border-primary scale-110"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(idx)}
                    data-aos="fade-up"
                    data-aos-delay={idx * 80}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Details */}
          <div className="flex flex-col flex-1 gap-4" data-aos="fade-left">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{product.productName}</h2>
              <button
                onClick={() => setWishlist((w) => !w)}
                className="text-2xl transition-transform duration-300 text-primary hover:scale-125"
                aria-label="Add to wishlist"
                data-aos="zoom-in"
              >
                {wishlist ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-xl font-semibold text-primary" data-aos="fade-right">
                {formatPrice(product.price)}
              </p>
              {product.lastPrice && product.lastPrice > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(product.lastPrice)}
                </p>
              )}
              
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300" data-aos="fade-up">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Stock:</span>
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">Category:</span>
                  <span className="capitalize">{product.category}</span>
                </div>

                {product.soldCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Sold:</span>
                    <span>{product.soldCount} units</span>
                  </div>
                )}

                {product.altNames && product.altNames.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Also known as:</span>
                    <span>{product.altNames.join(', ')}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {product.isBestSelling && (
                    <span className="px-2 py-1 text-sm text-white bg-green-500 rounded">
                      <FaRegThumbsUp className="inline mr-1" />
                      Best Seller
                    </span>
                  )}
                  {product.isTopRated && (
                    <span className="px-2 py-1 text-sm text-white bg-yellow-500 rounded">
                      <FaStar className="inline mr-1" />
                      Top Rated
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button 
                  className={`px-6 py-2 font-semibold text-white transition-all duration-200 rounded shadow-lg ${
                    product.stock > 0 
                      ? 'bg-primary hover:bg-secondary hover:scale-105' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
                <button 
                  className={`px-6 py-2 font-semibold text-white transition-all duration-200 rounded shadow-lg ${
                    product.stock > 0 
                      ? 'bg-secondary hover:bg-primary hover:scale-105' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12" data-aos="fade-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-bold">
                <FaRegSmile className="text-yellow-400" /> Customer Reviews
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{averageRating} out of 5</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
              {/* Rating Distribution */}
              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-12">{rating} stars</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded">
                      <div
                        className="h-full bg-yellow-400 rounded"
                        style={{
                          width: `${(reviewsByRating[rating] || 0) / reviews.length * 100}%`
                        }}
                      />
                    </div>
                    <span className="w-12 text-sm text-gray-500">
                      {reviewsByRating[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {!userReviewStatus && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 text-white transition-colors rounded shadow bg-primary hover:bg-secondary"
                >
                  Write a Review
                </button>
              )}
              {userReviewStatus === 'pending' && (
                <div className="flex items-center gap-2 px-4 py-2 text-yellow-600 bg-yellow-100 rounded dark:bg-yellow-900/30 dark:text-yellow-400">
                  <FaClock />
                  <span>Your review is pending approval</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No approved reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-gray-100 rounded shadow dark:bg-gray-800"
                  data-aos="fade-up"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.email}</span>
                      <span className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900 animate-fadeIn">
              <h4 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <FaRegSmile className="text-yellow-400" /> Write a Review
              </h4>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        type="button"
                        key={r}
                        className={`text-2xl ${
                          reviewForm.rating >= r
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } focus:outline-none transition-colors`}
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: r })
                        }
                        aria-label={`Rate ${r} star${r > 1 ? "s" : ""}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Review</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded bg-primary hover:bg-secondary"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Satisfaction Banner */}
        <div
          className="flex flex-col items-center justify-center py-8 mt-16 rounded-lg shadow bg-gradient-to-r from-primary/10 via-secondary/10 to-yellow-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
          data-aos="fade-up"
        >
          <FaRegSmile className="mb-2 text-4xl text-primary animate-bounce" />
          <h4 className="mb-2 text-xl font-bold">
            100% Satisfaction Guaranteed!
          </h4>
          <p className="max-w-lg text-center text-gray-700 dark:text-gray-300">
            We are committed to providing you with the best quality and service.
            If you have any issues, our support team is here to help!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
