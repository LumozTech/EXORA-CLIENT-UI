import React from "react";
import Image1 from "../../assets/exora images/exora1.jpg";
import Image2 from "../../assets/exora images/exora2.jpg";
import Image3 from "../../assets/exora images/exora3.jpg";
import Slider from "react-slick";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Premium Collection",
    description:
      "Discover our exclusive collection of premium clothing that embodies elegance and sophistication.",
  },
  {
    id: 2,
    img: Image2,
    title: "Luxury Fashion",
    description:
      "Experience the perfect blend of contemporary style and timeless craftsmanship in every piece.",
  },
  {
    id: 3,
    img: Image3,
    title: "Elegant Design",
    description:
      "Each garment is meticulously crafted to bring out your unique style and confidence.",
  },
];

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-50 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      {/* background pattern */}
      <div className="h-[700px] w-[700px] bg-[#4d0506]/20 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-6 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#4d0506]"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-base text-gray-700 dark:text-gray-300 leading-7"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                    className="space-x-4"
                  >
                    <button
                      onClick={handleOrderPopup}
                      className="bg-[#4d0506] hover:bg-[#4d0506]/90 transition-colors duration-200 text-white py-3 px-8 rounded-full font-semibold"
                    >
                      Shop Now
                    </button>
                    <button
                      onClick={handleOrderPopup}
                      className="border-2 border-[#4d0506] text-[#4d0506] hover:bg-[#4d0506]/10 transition-colors duration-200 py-3 px-8 rounded-full font-semibold"
                    >
                      View Collection
                    </button>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-cover mx-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;


