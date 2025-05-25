import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { FaRegSmile, FaRegThumbsUp } from "react-icons/fa";
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
    user: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        console.error('No product ID available');
        toast.error('Product ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching product with ID:', productId);
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        console.log('API Response:', response.data);
        
        if (response.data) {
          setProduct(response.data);
          setReviews([]); // Initialize empty reviews since we'll implement this later
        } else {
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
  const handleAddReview = (e) => {
    e.preventDefault();
    const newReview = {
      user: reviewForm.user || "Anonymous",
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };

    setReviews([...reviews, newReview]);
    toast.success('Review added successfully!');
    setShowReviewModal(false);
    setReviewForm({ user: "", rating: 5, comment: "" });
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-2xl font-bold">
              <FaRegSmile className="text-yellow-400" /> Reviews
            </h3>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2 text-white transition-colors rounded shadow bg-primary hover:bg-secondary"
            >
              Add Review
            </button>
          </div>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-100 rounded shadow dark:bg-gray-800"
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.user}</span>
                    <span className="flex text-yellow-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </span>
                  </div>
                  <p>{review.comment}</p>
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
                <FaRegSmile className="text-yellow-400" /> Add a Review
              </h4>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                    value={reviewForm.user}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, user: e.target.value })
                    }
                  />
                </div>
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
                        } focus:outline-none`}
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
                  <label className="block mb-1 font-medium">Comment</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
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
                    Submit
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
