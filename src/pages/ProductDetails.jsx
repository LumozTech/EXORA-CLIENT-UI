import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaHeart, FaRegHeart, FaStar, FaRegSmile, FaRegThumbsUp, FaClock } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from "../context/CartContext";
import { getApiUrl } from '../config/api';

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
  const { addToCart, buyNow } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

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
          axios.get(getApiUrl(`/api/products/${productId}`)),
          axios.get(getApiUrl('/api/reviews/customer-reviews'))
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
        getApiUrl('/api/reviews'),
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
        const reviewsRes = await axios.get(getApiUrl('/api/reviews/customer-reviews'));
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

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.productId, quantity, selectedSize);
  };

  // Buy now handler
  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const buyNowItem = {
      productId: product.productId,
      name: product.productName,
      price: product.price,
      lastPrice: product.lastPrice,
      size: selectedSize,
      image: product.images[0]
    };

    navigate('/checkout', { 
      state: { buyNowItem }
    });
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
    <div className="min-h-screen duration-200 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <ToastContainer />
      <Navbar />
      <div className="container px-4 py-10 mx-auto">
        {/* Product Main Section */}
        <div className="flex flex-col gap-10 md:flex-row" data-aos="fade-up">
          {/* Images */}
          <div className="flex flex-col gap-6 md:w-1/2">
            <div className="relative group">
              <img
                src={product.images?.[selectedImage] || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={product.productName}
                className="object-cover w-full transition-transform duration-500 rounded-2xl shadow-2xl h-[500px] hover:scale-105"
                data-aos="zoom-in"
              />
              {product.isBestSelling && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Best Seller
                </div>
              )}
              {product.isTopRated && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Top Rated
                </div>
              )}
            </div>
            {product.images && product.images.length > 0 && (
              <div className="flex gap-4 px-4 py-4 overflow-x-auto bg-white rounded-xl dark:bg-gray-800 shadow-inner">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.productName}-${idx + 1}`}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedImage === idx
                        ? "ring-4 ring-primary scale-110"
                        : "hover:ring-2 ring-primary/50"
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
          <div className="flex flex-col flex-1 gap-6 md:px-8" data-aos="fade-left">
            <div className="p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {product.productName}
                </h2>
                <button
                  onClick={() => setWishlist((w) => !w)}
                  className={`text-2xl transition-all duration-300 ${
                    wishlist ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500'
                  }`}
                  aria-label="Add to wishlist"
                  data-aos="zoom-in"
                >
                  {wishlist ? <FaHeart className="filter drop-shadow-lg" /> : <FaRegHeart />}
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-baseline gap-4">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                  {product.lastPrice && product.lastPrice > product.price && (
                    <p className="text-lg text-gray-400 line-through">
                      {formatPrice(product.lastPrice)}
                    </p>
                  )}
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Stock Status</span>
                    <span className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Category</span>
                    <span className="text-lg font-semibold capitalize">{product.category}</span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-4">
                  <span className="block text-lg font-semibold">Select Size</span>
                  <div className="flex gap-4">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                          selectedSize === size
                            ? 'bg-primary text-white ring-4 ring-primary/20 scale-110'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-primary/10'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="space-y-4">
                  <span className="block text-lg font-semibold">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-12 text-2xl font-bold transition-all bg-gray-100 rounded-full dark:bg-gray-700 hover:bg-primary/10"
                    >
                      -
                    </button>
                    <span className="w-12 text-2xl font-bold text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product?.stock || 5, q + 1))}
                      className="w-12 h-12 text-2xl font-bold transition-all bg-gray-100 rounded-full dark:bg-gray-700 hover:bg-primary/10"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-8 py-4 text-lg font-bold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50 hover:-translate-y-1"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 px-8 py-4 text-lg font-bold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-secondary to-primary hover:shadow-secondary/50 hover:-translate-y-1"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section with Enhanced UI */}
        <div className="mt-16" data-aos="fade-up">
          <div className="p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="flex items-center gap-3 text-3xl font-bold">
                  <FaRegSmile className="text-yellow-400" />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Customer Reviews
                  </span>
                </h3>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex text-yellow-400 text-2xl">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold">{averageRating} out of 5</span>
                  <span className="text-gray-500">({reviews.length} reviews)</span>
                </div>
              </div>
              <div>
                {!userReviewStatus && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-6 py-3 text-lg font-bold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50 hover:-translate-y-1"
                  >
                    Write a Review
                  </button>
                )}
                {userReviewStatus === 'pending' && (
                  <div className="flex items-center gap-2 px-6 py-3 text-yellow-600 bg-yellow-100 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">
                    <FaClock />
                    <span>Your review is pending approval</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-4">
                    <span className="w-16 text-sm font-medium">{rating} stars</span>
                    <div className="flex-1 h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="h-full transition-all rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                        style={{
                          width: `${(reviewsByRating[rating] || 0) / reviews.length * 100}%`
                        }}
                      />
                    </div>
                    <span className="w-12 text-sm font-medium text-gray-500">
                      {reviewsByRating[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="mt-8 space-y-6">
              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-lg text-gray-500">No approved reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-6 transition-all bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg"
                    data-aos="fade-up"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 overflow-hidden bg-gray-200 rounded-full">
                          {/* You can add user avatar here if available */}
                          <div className="flex items-center justify-center w-full h-full text-xl font-bold text-gray-500 bg-primary/10">
                            {review.email[0].toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">{review.email}</h4>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
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
        </div>

        {/* Satisfaction Banner with Enhanced UI */}
        <div
          className="p-12 mt-16 text-center rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
          data-aos="fade-up"
        >
          <FaRegSmile className="mx-auto mb-6 text-6xl text-primary animate-bounce" />
          <h4 className="mb-4 text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            100% Satisfaction Guaranteed!
          </h4>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
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
