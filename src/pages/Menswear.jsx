import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample mens wear products data (now with 7 images, description, sizes, reviews, recommended)
const mensProducts = [
  {
    id: 1,
    name: "Classic Polo Shirt",
    price: "Rs. 2,000",
    images: [
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "A timeless classic polo shirt made from premium cotton. Perfect for casual and semi-formal occasions. Breathable, comfortable, and stylish.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Nimal",
        rating: 5,
        comment: "Very comfortable and fits perfectly!",
      },
      {
        user: "Kasun",
        rating: 4,
        comment: "Good quality, nice color.",
      },
    ],
    recommended: [2, 3, 4],
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: "Rs. 2,800",
    images: [
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Slim fit denim jeans with a modern cut. Durable fabric and stylish wash. Suitable for all-day wear.",
    sizes: ["28", "30", "32", "34", "36"],
    reviews: [
      {
        user: "Sahan",
        rating: 5,
        comment: "Best jeans I have ever bought!",
      },
      {
        user: "Ruwan",
        rating: 4,
        comment: "Nice fit and comfortable.",
      },
    ],
    recommended: [1, 3, 5],
  },
  {
    id: 3,
    name: "Formal Suit",
    price: "Rs. 8,500",
    images: [
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Elegant formal suit for special occasions. Includes blazer and trousers. Tailored fit and premium fabric.",
    sizes: ["M", "L", "XL"],
    reviews: [
      {
        user: "Dilshan",
        rating: 5,
        comment: "Looks very professional and sharp.",
      },
      {
        user: "Tharindu",
        rating: 4,
        comment: "Great for office meetings.",
      },
    ],
    recommended: [1, 2, 4],
  },
  {
    id: 4,
    name: "Casual T-Shirt",
    price: "Rs. 1,200",
    images: [
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Soft cotton casual t-shirt, perfect for everyday wear. Available in multiple colors.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Amal",
        rating: 5,
        comment: "Very soft and comfortable.",
      },
    ],
    recommended: [1, 2, 3],
  },
  {
    id: 5,
    name: "Leather Jacket",
    price: "Rs. 6,000",
    images: [
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Premium leather jacket with a modern fit. Stylish and durable for all seasons.",
    sizes: ["M", "L", "XL"],
    reviews: [
      {
        user: "Ramesh",
        rating: 5,
        comment: "Looks awesome and feels premium.",
      },
    ],
    recommended: [1, 2, 3],
  },
  {
    id: 6,
    name: "Hoodie",
    price: "Rs. 2,500",
    images: [
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
    ],
    description:
      "Comfortable hoodie for casual wear. Soft fabric and stylish design.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Suresh",
        rating: 4,
        comment: "Warm and cozy.",
      },
    ],
    recommended: [1, 2, 5],
  },
  {
    id: 7,
    name: "Checked Shirt",
    price: "Rs. 1,800",
    images: [
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Trendy checked shirt for a smart casual look. Breathable and comfortable.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Janith",
        rating: 5,
        comment: "Love the pattern and fit.",
      },
    ],
    recommended: [1, 2, 6],
  },
  {
    id: 8,
    name: "Chinos",
    price: "Rs. 2,400",
    images: [
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Classic chinos with a modern fit. Perfect for both office and casual wear.",
    sizes: ["30", "32", "34", "36"],
    reviews: [
      {
        user: "Nuwan",
        rating: 4,
        comment: "Very comfortable and stylish.",
      },
    ],
    recommended: [1, 2, 7],
  },
  {
    id: 9,
    name: "Sweatshirt",
    price: "Rs. 2,100",
    images: [
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Soft and warm sweatshirt for chilly days. Available in multiple colors.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Ravindu",
        rating: 5,
        comment: "Keeps me warm and looks good.",
      },
    ],
    recommended: [1, 2, 8],
  },
  {
    id: 10,
    name: "Kurta Pajama",
    price: "Rs. 2,900",
    images: [
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Traditional kurta pajama set for festive occasions. Comfortable and elegant.",
    sizes: ["M", "L", "XL"],
    reviews: [
      {
        user: "Harsha",
        rating: 4,
        comment: "Great for cultural events.",
      },
    ],
    recommended: [1, 2, 9],
  },
  {
    id: 11,
    name: "Blazer",
    price: "Rs. 5,500",
    images: [
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
    ],
    description:
      "Smart blazer for formal and semi-formal occasions. Tailored fit and stylish design.",
    sizes: ["M", "L", "XL"],
    reviews: [
      {
        user: "Sajith",
        rating: 5,
        comment: "Perfect for office and parties.",
      },
    ],
    recommended: [1, 2, 10],
  },
  {
    id: 12,
    name: "Track Pants",
    price: "Rs. 1,600",
    images: [
      "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/1707827/pexels-photo-1707827.jpeg",
      "https://images.pexels.com/photos/1707826/pexels-photo-1707826.jpeg",
      "https://images.pexels.com/photos/532221/pexels-photo-532221.jpeg",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg",
    ],
    description:
      "Comfortable track pants for workouts and casual wear. Breathable and flexible.",
    sizes: ["S", "M", "L", "XL"],
    reviews: [
      {
        user: "Kavindu",
        rating: 4,
        comment: "Great for jogging and gym.",
      },
    ],
    recommended: [1, 2, 11],
  },
];

const PRODUCTS_PER_PAGE = 9; // 3 rows if each row has 3 products

const MensWear = () => {
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
  const totalPages = Math.ceil(mensProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = mensProducts.slice(
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
      {/* Mens Wear Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-blue-100 via-gray-100 to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
        data-aos="fade-down"
      >
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl text-primary"
          data-aos="fade-up"
        >
          Mens Wear Collection
        </h1>
        <p
          className="max-w-xl text-lg text-center text-gray-700 dark:text-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Explore our stylish and comfortable mens wear collection, perfect for
          every occasion. Modern designs, premium fabrics, and the latest trends
          for men!
        </p>
      </section>
      {/* Mens Wear Products with Pagination */}
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

export default MensWear;
