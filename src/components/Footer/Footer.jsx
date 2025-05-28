import React from "react";
import footerLogo from "../../assets/logo-removebg-preview.png";
import qrCode from "../../assets/qr-code.png";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `linear-gradient(to bottom, rgba(77, 7, 8, 0.95), rgba(77, 7, 8, 0.9)), url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  {
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
];

const Footer = () => {
  return (
    <div style={BannerImg} className="text-[#d9cfd0]">
      <div className="container">
        <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-20 pt-5">
          {/* company details */}
          <div className="py-8 px-4">
            <h1 className="flex items-center gap-3 text-xl font-bold sm:text-3xl sm:text-left text-justify mb-3">
              <div className="bg-[#d9cfd0] p-2 rounded-lg">
                <img src={footerLogo} alt="Exora Clothing" className="max-w-[100px]" />
              </div>
              <span className="text-white">Exora</span>
            </h1>
            <p className="text-[#d9cfd0]/90 leading-relaxed">
              Discover fashion that defines you. Quality clothing for every style and occasion.
            </p>
            
            {/* QR Code Section */}
            <div className="mt-6">
              <p className="text-white font-semibold mb-2">Scan to Visit Us</p>
              <div className="bg-white p-2 rounded-lg inline-block hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={qrCode} 
                  alt="Scan QR Code to visit Exora" 
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3 text-white">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li
                      className="cursor-pointer hover:text-white hover:translate-x-1 duration-300 text-[#d9cfd0]/80"
                      key={link.title}
                    >
                      <span>{link.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3 text-white">
                  Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li
                      className="cursor-pointer hover:text-white hover:translate-x-1 duration-300 text-[#d9cfd0]/80"
                      key={link.title}
                    >
                      <span>{link.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* social links */}
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3 text-white">
                  Connect With Us
                </h1>
                <div className="flex items-center gap-3 mt-6">
                  <a href="#" className="hover:text-white text-[#d9cfd0]/80 transition-colors duration-300 hover:scale-110 transform">
                    <FaInstagram className="text-3xl" />
                  </a>
                  <a href="#" className="hover:text-white text-[#d9cfd0]/80 transition-colors duration-300 hover:scale-110 transform">
                    <FaFacebook className="text-3xl" />
                  </a>
                  <a href="#" className="hover:text-white text-[#d9cfd0]/80 transition-colors duration-300 hover:scale-110 transform">
                    <FaLinkedin className="text-3xl" />
                  </a>
                </div>
                <div className="mt-6">
                  <div className="flex items-center gap-3 text-[#d9cfd0]/80 hover:text-white transition-colors duration-300">
                    <FaLocationArrow />
                    <p>12/1, Kandy Road, Kandy</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-[#d9cfd0]/80 hover:text-white transition-colors duration-300">
                    <FaMobileAlt />
                    <p>+94 776479026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="text-center py-4 border-t border-[#d9cfd0]/10">
          <p className="text-[#d9cfd0]/70 text-sm">
            © {new Date().getFullYear()} Exora. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
