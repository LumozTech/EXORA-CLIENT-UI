import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { useLocation, Link } from "react-router-dom";

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
  { id: 2, name: "Best Selling", link: "/#" },
  { id: 3, name: "Top Rated", link: "/top-rated" },
];

// Simulate authentication state and user info
const mockUser = {
  isLoggedIn: true, // set to false to test logged-out state
  name: "Jane Doe",
  profile: "https://randomuser.me/api/portraits/women/44.jpg", // or use placeholderProfile
};

const Navbar = ({ handleOrderPopup }) => {
  const location = useLocation();
  const [profileDropdown, setProfileDropdown] = useState(false);

  // Helper to check if menu item is active
  const isActive = (link) => {
    if (link.startsWith("/#")) {
      return (
        location.pathname === "/" && location.hash === link.replace("/", "")
      );
    }
    return location.pathname === link;
  };

  // Handle dropdown toggle
  const toggleProfileDropdown = () => {
    setProfileDropdown((prev) => !prev);
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-dropdown")) setProfileDropdown(false);
    };
    if (profileDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileDropdown]);

  return (
    <div className="relative z-40 duration-200 bg-white shadow-md dark:bg-gray-900 dark:text-white">
      {/* upper Navbar */}
      <div className="py-2 bg-primary/40">
        <div className="container flex items-center justify-between">
          <div>
            <Link to="/" className="flex gap-2 text-2xl font-bold sm:text-3xl">
              <img src={Logo} alt="Logo" className="w-10" />
              Shopsy
            </Link>
          </div>

          {/* search bar and right controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative hidden group sm:block">
              <input
                type="text"
                placeholder="search"
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
              />
              <IoMdSearch className="absolute text-gray-500 -translate-y-1/2 group-hover:text-primary top-1/2 right-3" />
            </div>

            {/* order button */}
            <button
              onClick={() => handleOrderPopup()}
              className="flex items-center gap-3 px-4 py-1 text-white transition-all duration-200 rounded-full bg-gradient-to-r from-primary to-secondary group"
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
              {!mockUser.isLoggedIn ? (
                <Link
                  to="/login"
                  className="px-5 py-2 ml-2 font-semibold text-white transition-all duration-200 rounded-full shadow-md bg-gradient-to-r from-primary to-secondary hover:scale-105"
                >
                  Login
                </Link>
              ) : (
                <div>
                  <button
                    className="flex items-center gap-2 px-2 py-1 transition-all duration-200 rounded-full hover:bg-primary/10 focus:outline-none"
                    onClick={toggleProfileDropdown}
                  >
                    <img
                      src={mockUser.profile || placeholderProfile}
                      alt="Profile"
                      className="w-10 h-10 transition-all duration-200 border-2 rounded-full shadow-md border-primary hover:scale-105"
                    />
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
                      <Link
                        to="/profile"
                        className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/wishlist"
                        className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      >
                        Wishlist
                      </Link>
                      <Link
                        to="/cart"
                        className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      >
                        Cart
                      </Link>
                      <Link
                        to="/orders"
                        className="px-4 py-2 text-gray-700 transition-all dark:text-gray-200 hover:bg-primary/10"
                      >
                        My Orders
                      </Link>
                      <button
                        className="px-4 py-2 text-left text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/30"
                        // onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* lower Navbar */}
      <div data-aos="zoom-in" className="flex justify-center">
        <ul className="items-center hidden gap-4 sm:flex">
          {Menu.map((data) => (
            <li key={data.id}>
              <Link
                to={data.link}
                className={`inline-block px-4 duration-200 hover:text-primary ${
                  isActive(data.link)
                    ? "text-primary font-bold underline underline-offset-8"
                    : ""
                }`}
              >
                {data.name}
              </Link>
            </li>
          ))}
          {/* Simple Dropdown and Links */}
          <li className="relative cursor-pointer group">
            <a href="#" className="flex items-center gap-[2px] py-2">
              Trending Products
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </a>
            <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-block w-full p-2 rounded-md hover:bg-primary/20 "
                    >
                      {data.name}
                    </a>
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
