import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegUser,
  FaRegHeart,
  FaCartShopping,
  FaBoxOpen,
  FaEdit,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

// Mock user data (replace with real user data from context or API)
const user = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  profile: "https://randomuser.me/api/portraits/women/44.jpg",
  joined: "2023-01-15",
};

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen px-4 py-10 bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div
          className="relative flex flex-col items-center w-full max-w-2xl p-8 bg-white shadow-2xl dark:bg-gray-900 rounded-2xl"
          data-aos="fade-up"
        >
          <div className="absolute top-4 right-4">
            <button
              className="flex items-center gap-2 px-3 py-1 text-sm font-semibold transition-all border rounded-full text-primary border-primary hover:bg-primary/10"
              onClick={() => navigate("/profile/edit")}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
          <img
            src={user.profile}
            alt="Profile"
            className="mb-4 transition-all duration-300 border-4 rounded-full shadow-lg w-28 h-28 border-primary hover:scale-105"
            data-aos="zoom-in"
          />
          <h2 className="mb-1 text-2xl font-bold text-primary">{user.name}</h2>
          <p className="mb-2 text-gray-600 dark:text-gray-300">{user.email}</p>
          <span className="mb-6 text-xs text-gray-400">
            Joined on {new Date(user.joined).toLocaleDateString()}
          </span>
          <div className="grid w-full grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div
              className="flex flex-col items-center p-6 transition-all shadow cursor-pointer bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl hover:scale-105"
              data-aos="fade-right"
              onClick={() => navigate("/orders")}
            >
              <FaBoxOpen className="mb-2 text-3xl text-primary" />
              <span className="text-lg font-semibold">My Orders</span>
              <span className="text-xs text-gray-500">
                View your order history
              </span>
            </div>
            <div
              className="flex flex-col items-center p-6 transition-all shadow cursor-pointer bg-gradient-to-r from-pink-100/40 to-pink-200/40 dark:from-gray-800 dark:to-gray-900 rounded-xl hover:scale-105"
              data-aos="fade-left"
              onClick={() => navigate("/wishlist")}
            >
              <FaRegHeart className="mb-2 text-3xl text-pink-500" />
              <span className="text-lg font-semibold">Wishlist</span>
              <span className="text-xs text-gray-500">Your saved products</span>
            </div>
            <div
              className="flex flex-col items-center p-6 transition-all shadow cursor-pointer bg-gradient-to-r from-blue-100/40 to-blue-200/40 dark:from-gray-800 dark:to-gray-900 rounded-xl hover:scale-105"
              data-aos="fade-right"
              onClick={() => navigate("/cart")}
            >
              <FaCartShopping className="mb-2 text-3xl text-blue-500" />
              <span className="text-lg font-semibold">Cart</span>
              <span className="text-xs text-gray-500">Items ready to buy</span>
            </div>
            <div
              className="flex flex-col items-center p-6 transition-all shadow cursor-pointer bg-gradient-to-r from-purple-100/40 to-purple-200/40 dark:from-gray-800 dark:to-gray-900 rounded-xl hover:scale-105"
              data-aos="fade-left"
              onClick={() => navigate("/profile")}
            >
              <FaRegUser className="mb-2 text-3xl text-purple-500" />
              <span className="text-lg font-semibold">Account</span>
              <span className="text-xs text-gray-500">Manage your details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
