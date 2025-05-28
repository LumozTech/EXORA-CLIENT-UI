import React, { useState } from "react";
import BannerBg from "../../assets/exora images/exora6.jpg";

const Subscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail("");
  };

  const backgroundStyle = {
    backgroundImage: `url(${BannerBg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div
      data-aos="zoom-in"
      className="mb-20 relative text-white overflow-hidden min-h-[400px]"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#4d0506]/90 to-[#4d0506]/70"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 
            className="text-3xl sm:text-4xl font-bold leading-tight"
            data-aos="fade-up"
          >
            Subscribe to Our Newsletter
          </h2>
          <p 
            className="text-base sm:text-lg text-gray-200"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Stay updated with our latest collections, exclusive offers, and fashion insights.
          </p>
          
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm 
                        text-white placeholder-gray-300 focus:outline-none focus:border-white 
                        transition-colors duration-300"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-full bg-white text-[#4d0506] font-semibold 
                       hover:bg-[#4d0506] hover:text-white border border-white
                       transition-all duration-300 transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>

          <p 
            className="text-sm text-gray-300"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            By subscribing, you agree to receive marketing communications from Exora.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
