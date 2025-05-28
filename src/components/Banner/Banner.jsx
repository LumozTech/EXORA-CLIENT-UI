import React from "react";
import BannerImg from "../../assets/exora images/exora5.jpg";
import { FaCrown, FaShippingFast, FaCreditCard, FaGift } from "react-icons/fa";

const Banner = () => {
  return (
    <div className="min-h-[550px] flex justify-center items-center py-12 sm:py-0 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          {/* image section */}
          <div data-aos="zoom-in">
            <img
              src={BannerImg}
              alt="Exora Premium Collection"
              className="max-w-[500px] h-[400px] w-full mx-auto rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* text details section */}
          <div className="flex flex-col justify-center gap-6 sm:pt-0">
            <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold text-[#4d0506]">
              Exclusive Collection 2024
            </h1>
            <p
              data-aos="fade-up"
              className="text-base text-gray-700 dark:text-gray-300 tracking-wide leading-7"
            >
              Discover our premium collection of handcrafted clothing that combines elegance with comfort. 
              Each piece is designed to make you stand out with sophistication and style.
            </p>
            <div className="flex flex-col gap-4">
              <div data-aos="fade-up" className="flex items-center gap-4 p-4 hover:bg-[#4d0506]/5 rounded-lg transition-colors">
                <div className="bg-[#4d0506]/10 p-3 rounded-full">
                  <FaCrown className="text-2xl text-[#4d0506]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4d0506]">Premium Quality</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Finest materials and craftsmanship</p>
                </div>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4 p-4 hover:bg-[#4d0506]/5 rounded-lg transition-colors">
                <div className="bg-[#4d0506]/10 p-3 rounded-full">
                  <FaShippingFast className="text-2xl text-[#4d0506]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4d0506]">Express Delivery</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fast and secure shipping</p>
                </div>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4 p-4 hover:bg-[#4d0506]/5 rounded-lg transition-colors">
                <div className="bg-[#4d0506]/10 p-3 rounded-full">
                  <FaCreditCard className="text-2xl text-[#4d0506]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4d0506]">Secure Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Multiple payment options</p>
                </div>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4 p-4 hover:bg-[#4d0506]/5 rounded-lg transition-colors">
                <div className="bg-[#4d0506]/10 p-3 rounded-full">
                  <FaGift className="text-2xl text-[#4d0506]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4d0506]">Special Offers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exclusive deals for members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
