import React from "react";
import Logo from "../../assets/logo.png";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

// Color theme
const NAVBAR_BG = "#00796B";
const NAVBAR_TEXT = "#F5F5F5";

// Example user data (replace with real user info)
const user = {
  name: "Nimesha Perera",
  email: "nimesha@gmail.com",
  avatar: null, // If you have a user avatar, set the URL here
};

const AdminNavbar = ({ pageTitle = "Dashboard" }) => {
  // Dropdown state
  const [open, setOpen] = React.useState(false);

  return (
    <nav
      className="relative flex items-center justify-between px-6 py-4 mt-6 ml-6 mr-6 shadow-md rounded-2xl"
      style={{
        background: NAVBAR_BG,
        color: NAVBAR_TEXT,
        minHeight: 72,
      }}
    >
      {/* Left: Logo and Page Title */}
      <div className="flex items-center gap-4">
        <img src={Logo} alt="Logo" className="w-10 rounded-full shadow" />
        <span className="text-2xl font-bold tracking-wide drop-shadow-sm">
          {pageTitle}
        </span>
      </div>
      {/* Right: User Info with Dropdown */}
      <div className="relative flex items-center gap-3">
        <button
          className="flex items-center gap-2 focus:outline-none"
          onClick={() => setOpen((o) => !o)}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User"
              className="object-cover w-10 h-10 border-2 border-white rounded-full shadow"
            />
          ) : (
            <FaUserCircle
              className="w-10 h-10"
              style={{ color: NAVBAR_TEXT }}
            />
          )}
          <div className="flex flex-col items-start text-left">
            <span className="font-semibold leading-tight">{user.name}</span>
            <span className="text-xs opacity-80">{user.email}</span>
          </div>
          <FaChevronDown
            className={`ml-1 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 top-14 min-w-[180px] bg-white rounded-xl shadow-lg z-50 py-2"
            style={{ color: "#222" }}
            onMouseLeave={() => setOpen(false)}
          >
            <div className="px-4 py-2 text-sm font-semibold border-b">
              Signed in as
              <br />
              <span className="text-[#00796B]">{user.email}</span>
            </div>
            <button
              className="w-full px-4 py-2 text-left hover:bg-[#E0F2F1] transition text-sm"
              onClick={() => {
                setOpen(false);
                window.location.href = "/profile/edit";
              }}
            >
              Edit Profile
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-[#E0F2F1] transition text-sm"
              onClick={() => {
                setOpen(false);
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
