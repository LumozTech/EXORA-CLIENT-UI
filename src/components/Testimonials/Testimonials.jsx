import React from "react";
import Slider from "react-slick";
import { FaQuoteRight } from "react-icons/fa";

const TestimonialData = [
  {
    id: 1,
    name: "Victor",
    role: "Regular Customer",
    text: "The quality of their clothing is exceptional. Each piece I've purchased has exceeded my expectations in terms of both style and comfort.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Satya Nadella",
    role: "Fashion Enthusiast",
    text: "Exora's attention to detail and premium craftsmanship sets them apart. Their collection perfectly balances modern trends with timeless elegance.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Virat Kohli",
    role: "Loyal Customer",
    text: "I'm impressed by their consistent quality and excellent customer service. The clothes are not just fashionable but also incredibly comfortable.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4,
    name: "Sachin Tendulkar",
    role: "Style Connoisseur",
    text: "Exora has redefined luxury fashion for me. Their attention to detail and commitment to quality is evident in every piece they create.",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-16 mb-10 bg-gradient-to-b from-[#d9cfd0]/20 to-transparent">
      <div className="container">
        {/* header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-[#4d0708] font-medium">
            Customer Testimonials
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold text-[#4d0708] mt-2">
            What Our Clients Say
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Discover why our customers love shopping with us. Read their experiences and stories.
          </p>
        </div>

        {/* Testimonial cards */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div className="my-6" key={data.id}>
                <div
                  className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl 
                           bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300
                           border border-[#4d0708]/10 relative overflow-hidden group"
                >
                  {/* Decorative elements */}
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 bg-[#4d0708]/5 
                             transition-transform duration-300 group-hover:scale-110"
                    style={{
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)"
                    }}
                  ></div>

                  <div className="flex items-center gap-4">
                    <img
                      src={data.img}
                      alt={data.name}
                      className="rounded-full w-16 h-16 object-cover border-2 border-[#4d0708]/20 
                               transition-transform duration-300 group-hover:scale-105"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#4d0708]">
                        {data.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 relative">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {data.text}
                    </p>
                    <div className="absolute -right-2 -top-4 text-[#4d0708]/10 
                                  transition-transform duration-300 group-hover:scale-110">
                      <FaQuoteRight size={40} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
