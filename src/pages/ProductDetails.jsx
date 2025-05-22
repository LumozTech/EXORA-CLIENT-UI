import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { FaRegSmile, FaRegThumbsUp } from "react-icons/fa"; // For extra icons
import AOS from "aos";
import "aos/dist/aos.css";

// Sample product data (replace with API or context in real app)
const sampleProducts = [
  {
    id: 1,
    name: "Premium Leather Jacket",
    price: "Rs. 7,500",
    images: [
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
    ],
    description:
      "A stylish premium leather jacket for all occasions. Crafted from high-quality leather for comfort and durability.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Ayesha",
        rating: 5,
        comment: "Amazing quality and fit!",
      },
      {
        user: "Ravi",
        rating: 4,
        comment: "Looks great, feels premium.",
      },
    ],
    recommended: [2, 3, 4],
  },
  // ...add more products as needed
];

const ProductDetails = ({ orderPopup, setOrderPopup, handleOrderPopup }) => {
  const { id } = useParams();
  const location = useLocation();

  // Use product from navigation state if available, else fallback to sampleProducts
  const product =
    location.state?.product || sampleProducts.find((p) => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [wishlist, setWishlist] = useState(false);
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    user: "",
    rating: 5,
    comment: "",
  });

  React.useEffect(() => {
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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500">Product not found</h2>
      </div>
    );
  }

  // Add Review Handler
  const handleAddReview = (e) => {
    e.preventDefault();
    setReviews([
      ...reviews,
      {
        user: reviewForm.user || "Anonymous",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      },
    ]);
    setShowReviewModal(false);
    setReviewForm({ user: "", rating: 5, comment: "" });
  };

  return (
    <div className="duration-200 bg-white dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="container px-4 py-10 mx-auto">
        {/* Product Main Section */}
        <div className="flex flex-col gap-10 md:flex-row" data-aos="fade-up">
          {/* Images */}
          <div className="flex flex-col gap-4 md:w-1/2">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="object-cover w-full transition-transform duration-500 rounded-lg shadow-xl h-96 hover:scale-105"
              data-aos="zoom-in"
            />
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
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
          </div>
          {/* Details */}
          <div className="flex flex-col flex-1 gap-4" data-aos="fade-left">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{product.name}</h2>
              <button
                onClick={() => setWishlist((w) => !w)}
                className="text-2xl transition-transform duration-300 text-primary hover:scale-125"
                aria-label="Add to wishlist"
                data-aos="zoom-in"
              >
                {wishlist ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <p
              className="text-xl font-semibold text-primary"
              data-aos="fade-right"
            >
              {product.price}
            </p>
            <p className="text-gray-700 dark:text-gray-300" data-aos="fade-up">
              {product.description}
            </p>
            {/* Size Selector */}
            <div>
              <span className="font-semibold">Size: </span>
              <div className="flex gap-2 mt-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    // Only update selectedSize, do not remove or hide any size
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-primary text-white border-primary scale-110"
                        : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    }`}
                    data-aos="fade-up"
                  >
                    {size}
                  </button>
                ))}
              </div>
              {/* Show selected size below */}
              <div className="mt-2 font-semibold text-primary">
                Selected Size: <span className="ml-1">{selectedSize}</span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button className="px-6 py-2 font-semibold text-white transition-colors duration-200 rounded shadow-lg bg-primary hover:bg-secondary hover:scale-105">
                Add to Cart
              </button>
              <button className="px-6 py-2 font-semibold text-white transition-colors duration-200 rounded shadow-lg bg-secondary hover:bg-primary hover:scale-105">
                Buy Now
              </button>
            </div>
            {/* Extra: Social Proof */}
            <div
              className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400"
              data-aos="fade-up"
            >
              <FaRegThumbsUp className="text-xl" />
              <span>Trusted by 500+ happy customers!</span>
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
            {reviews.map((review, idx) => (
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
            ))}
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
        {/* Recommended Section */}
        <div className="mt-12" data-aos="fade-up">
          <h3 className="flex items-center gap-2 mb-4 text-2xl font-bold">
            <FaStar className="text-yellow-400" /> Recommended for you
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {sampleProducts
              .filter((p) => product.recommended.includes(p.id))
              .map((rec, idx) => (
                <div
                  key={rec.id}
                  className="flex flex-col items-center p-4 transition-transform duration-300 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:scale-105"
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                >
                  <img
                    src={rec.images[0]}
                    alt={rec.name}
                    className="object-cover w-full h-40 mb-2 rounded"
                  />
                  <h4 className="font-semibold">{rec.name}</h4>
                  <p className="font-bold text-primary">{rec.price}</p>
                  <button className="px-4 py-2 mt-2 text-white transition-colors rounded bg-primary hover:bg-secondary">
                    View Product
                  </button>
                </div>
              ))}
          </div>
        </div>
        {/* Extra: Satisfaction Banner */}
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
