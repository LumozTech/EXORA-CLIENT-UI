import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample womens wear products data (with 7 images, description, sizes, reviews, recommended)
const womensProducts = [
  {
    id: 1,
    name: "Designer Saree",
    price: "Rs. 8,200",
    images: [
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
      "https://images.pexels.com/photos/1488461/pexels-photo-1488461.jpeg",
      "https://images.pexels.com/photos/1488460/pexels-photo-1488460.jpeg",
      "https://images.pexels.com/photos/1488459/pexels-photo-1488459.jpeg",
      "https://images.pexels.com/photos/1488458/pexels-photo-1488458.jpeg",
    ],
    description:
      "Elegant designer saree with intricate embroidery. Perfect for weddings and festive occasions.",
    sizes: ["Free Size"],
    reviews: [
      {
        user: "Nadeesha",
        rating: 5,
        comment: "Absolutely beautiful and high quality!",
      },
      {
        user: "Ishara",
        rating: 4,
        comment: "Loved the color and fabric.",
      },
    ],
    recommended: [2, 3, 4],
  },
  {
    id: 2,
    name: "Trendy Maxi Dress",
    price: "Rs. 4,100",
    images: [
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
      "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
      "https://images.pexels.com/photos/1488461/pexels-photo-1488461.jpeg",
      "https://images.pexels.com/photos/1488460/pexels-photo-1488460.jpeg",
      "https://images.pexels.com/photos/1488459/pexels-photo-1488459.jpeg",
      "https://images.pexels.com/photos/1488458/pexels-photo-1488458.jpeg",
    ],
    description:
      "Flowy and fashionable maxi dress, perfect for summer outings and parties.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Dilani",
        rating: 5,
        comment: "Very comfortable and stylish.",
      },
      {
        user: "Harshi",
        rating: 4,
        comment: "Nice fit and color.",
      },
    ],
    recommended: [1, 3, 5],
  },
  {
    id: 3,
    name: "Party Gown",
    price: "Rs. 7,000",
    images: [
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
      "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
      "https://images.pexels.com/photos/1488461/pexels-photo-1488461.jpeg",
      "https://images.pexels.com/photos/1488460/pexels-photo-1488460.jpeg",
      "https://images.pexels.com/photos/1488459/pexels-photo-1488459.jpeg",
    ],
    description:
      "Stunning party gown with sequin work. Make a statement at any event.",
    sizes: ["S", "M", "L"],
    reviews: [
      {
        user: "Ruwani",
        rating: 5,
        comment: "Gorgeous and fits perfectly!",
      },
    ],
    recommended: [1, 2, 4],
  },
  {
    id: 4,
    name: "Casual Kurti",
    price: "Rs. 2,300",
    images: [
      "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
      "https://images.pexels.com/photos/1488461/pexels-photo-1488461.jpeg",
      "https://images.pexels.com/photos/1488460/pexels-photo-1488460.jpeg",
      "https://images.pexels.com/photos/1488459/pexels-photo-1488459.jpeg",
      "https://images.pexels.com/photos/1488458/pexels-photo-1488458.jpeg",
    ],
    description:
      "Comfortable cotton kurti for daily wear. Available in vibrant prints.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Sanduni",
        rating: 4,
        comment: "Very comfortable for work.",
      },
    ],
    recommended: [1, 2, 3],
  },
  {
    id: 5,
    name: "Ethnic Lehenga",
    price: "Rs. 9,500",
    images: [
      "https://images.pexels.com/photos/1488460/pexels-photo-1488460.jpeg",
      "https://images.pexels.com/photos/1488461/pexels-photo-1488461.jpeg",
      "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
      "https://images.pexels.com/photos/1488459/pexels-photo-1488459.jpeg",
      "https://images.pexels.com/photos/1488458/pexels-photo-1488458.jpeg",
    ],
    description:
      "Traditional ethnic lehenga with heavy embroidery. Perfect for weddings.",
    sizes: ["M", "L", "XL"],
    reviews: [
      {
        user: "Nisansala",
        rating: 5,
        comment: "Looks royal and elegant.",
      },
    ],
    recommended: [1, 2, 3],
  },
  {
    id: 6,
    name: "Office Blazer",
    price: "Rs. 5,300",
    images: [
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
      "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
      "https://images.pexels.com/photos/1488461/pexels-photo-1488461.jpeg",
      "https://images.pexels.com/photos/1488460/pexels-photo-1488460.jpeg",
      "https://images.pexels.com/photos/1488459/pexels-photo-1488459.jpeg",
    ],
    description:
      "Smart office blazer for a professional look. Tailored fit and premium fabric.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Sithara",
        rating: 4,
        comment: "Perfect for meetings.",
      },
    ],
    recommended: [1, 2, 5],
  },
  {
    id: 7,
    name: "Printed Skirt",
    price: "Rs. 2,700",
    images: [
      "https://images.pexels.com/photos/1488459/pexels-photo-1488459.jpeg",
      "https://images.pexels.com/photos/1488460/pexels-photo-1488460.jpeg",
      "https://images.pexels.com/photos/1488461/pexels-photo-1488461.jpeg",
      "https://images.pexels.com/photos/1488462/pexels-photo-1488462.jpeg",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg",
      "https://images.pexels.com/photos/1488458/pexels-photo-1488458.jpeg",
    ],
    description:
      "Trendy printed skirt for a chic look. Soft fabric and comfortable fit.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Yasara",
        rating: 5,
        comment: "Love the print and style.",
      },
    ],
    recommended: [1, 2, 6],
  },
];

const PRODUCTS_PER_PAGE = 9;

const WomensWear = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(womensProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = womensProducts.slice(
    startIdx,
    startIdx + PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="duration-200 bg-white dark:bg-gray-900 dark:text-white">
      <Navbar />
      {/* Womens Wear Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-pink-100 via-gray-100 to-pink-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl text-primary"
          data-aos="fade-up"
        >
          Womens Wear Collection
        </h1>
        <p
          className="max-w-xl text-lg text-center text-gray-700 dark:text-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Discover our beautiful and trendy womens wear collection. Elegant
          sarees, stylish dresses, and more for every occasion!
        </p>
      </section>
      {/* Womens Wear Products with Pagination */}
      <div data-aos="fade-up" className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {currentProducts.map((product, idx) => (
            <div
              key={product.id}
              className="flex flex-col items-center overflow-hidden bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-800"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              onClick={() =>
                navigate(`/product/${product.id}`, { state: { product } })
              }
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-56"
              />
              <div className="flex flex-col items-center p-4">
                <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                <p className="mb-2 font-bold text-primary">{product.price}</p>
                <button className="px-4 py-2 text-white transition-colors rounded bg-primary hover:bg-secondary">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === idx + 1
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      {/* Banner Section */}
      <div data-aos="zoom-in">
        <Banner />
      </div>
      {/* Subscribe Section */}
      <div data-aos="fade-up" data-aos-delay="200">
        <Subscribe />
      </div>
      <Footer />
    </div>
  );
};

export default WomensWear;
