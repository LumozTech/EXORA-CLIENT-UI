import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo-removebg-preview.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { useLocation, Link, useNavigate } from "react-router-dom";

// Placeholder profile image
const placeholderProfile =
  "https://ui-avatars.com/api/?name=User&background=random&size=128";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Top Rated", link: "/top-rated" },
  { id: 3, name: "Kids Wear", link: "/kids-wear" },
  { id: 4, name: "Mens Wear", link: "/mens-wear" },
  { id: 5, name: "Womens Wear", link: "/womens-wear" },
];

const DropdownLinks = [
  { id: 1, name: "All Products", link: "/all-products" },
  { id: 2, name: "Best Selling", link: "/bestselling" },
  { id: 3, name: "Top Rated", link: "/top-rated" },
];

const Navbar = ({ handleOrderPopup }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status and get user info
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            isLoggedIn: true,
            name: `${parsedUser.firstName || ""} ${parsedUser.lastName || ""}`.trim(),
            profile: parsedUser.profilePic || placeholderProfile,
            role: parsedUser.type || "user"
          });
        } else {
          setUser({
            isLoggedIn: false,
            name: "",
            profile: placeholderProfile,
            role: null
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser({
          isLoggedIn: false,
          name: "",
          profile: placeholderProfile,
          role: null
        });
      }
    };

    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Helper to check if menu item is active
  const isActive = (link) => {
    if (link.startsWith("/#")) {
      return location.pathname === "/" && location.hash === link.replace("/", "");
    }
    return location.pathname === link;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser({
      isLoggedIn: false,
      name: "",
      profile: placeholderProfile,
      role: null
    });
    navigate("/login");
  };

  // Handle dropdown toggle
  const toggleProfileDropdown = () => {
    setProfileDropdown((prev) => !prev);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setProfileDropdown(false);
      }
    };
    
    if (profileDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileDropdown]);

  return (
    <div className="relative z-40 duration-200 bg-white shadow-md dark:bg-gray-900 dark:text-white">
      {/* upper Navbar */}
      <div className="py-2" style={{ backgroundColor: '#d9cfd0' }}>
        <div className="container flex items-center justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <img src={Logo} alt="Exora Clothing" className="w-24 h-auto" />
            </Link>
          </div>

          {/* search bar and right controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative hidden group sm:block">
              <input
                type="text"
                placeholder="search"
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-[#4d0708] dark:border-gray-500 dark:bg-gray-800"
              />
              <IoMdSearch className="absolute text-gray-500 -translate-y-1/2 group-hover:text-[#4d0708] top-1/2 right-3" />
            </div>

            {/* order button */}
            <button
              onClick={() => handleOrderPopup()}
              className="flex items-center gap-3 px-4 py-1 text-white transition-all duration-200 rounded-full bg-[#4d0708] hover:bg-[#4d0708]/90 group"
            >
              <span className="hidden transition-all duration-200 group-hover:block">
                Order
              </span>
              <FaCartShopping className="text-xl text-white cursor-pointer drop-shadow-sm" />
            </button>

            {/* Darkmode Switch */}
            <div>
              <DarkMode />
            </div>

            {/* Auth/Profile section */}
            <div className="relative profile-dropdown">
              <div>
                <button
                  className="flex items-center gap-2 px-2 py-1 transition-all duration-200 rounded-full hover:bg-[#4d0708]/10 focus:outline-none"
                  onClick={toggleProfileDropdown}
                >
                  <img
                    src={user?.profile || placeholderProfile}
                    alt="Profile"
                    className="w-10 h-10 transition-all duration-200 border-2 rounded-full shadow-md border-[#4d0708] hover:scale-105"
                    onError={(e) => {
                      e.target.src = placeholderProfile;
                    }}
                  />
                  <span className="font-medium">{user?.name || "User"}</span>
                  <FaCaretDown
                    className={`transition-transform duration-200 ${
                      profileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 transition-all duration-200 origin-top-right ${
                    profileDropdown
                      ? "scale-100 opacity-100 pointer-events-auto"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                  style={{ zIndex: 9999 }}
                >
                  <div className="flex flex-col py-2">
                    <div className="px-4 py-2 font-semibold text-[#4d0708] border-b border-gray-100 dark:border-gray-700">
                      {user?.name || "User"}
                    </div>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                        onClick={() => setProfileDropdown(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile/edit"
                      className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      onClick={() => setProfileDropdown(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/cart"
                      className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Cart
                    </Link>
                    <Link
                      to="/orders"
                      className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      onClick={() => setProfileDropdown(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-left text-blue-500 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 border-t border-gray-100 dark:border-gray-700"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Login
                    </Link>
                    {user?.isLoggedIn && (
                      <button
                        className="px-4 py-2 text-left text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/30 border-t border-gray-100 dark:border-gray-700"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* lower Navbar */}
      <div data-aos="zoom-in" className="flex justify-center bg-[#d9cfd0]/70">
        <ul className="items-center hidden gap-4 sm:flex">
          {Menu.map((data) => (
            <li key={data.id}>
              <Link
                to={data.link}
                className={`inline-block px-4 py-2 duration-200 hover:text-[#4d0708] ${
                  isActive(data.link)
                    ? "text-[#4d0708] font-bold underline underline-offset-8"
                    : ""
                }`}
              >
                {data.name}
              </Link>
            </li>
          ))}
          {/* Simple Dropdown and Links */}
          <li className="relative cursor-pointer group">
            <a className="flex items-center gap-[2px] py-2">
              All Products
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </a>
            <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <Link
                      to={data.link}
                      className="inline-block w-full p-2 rounded-md hover:bg-[#4d0708]/20"
                    >
                      {data.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
