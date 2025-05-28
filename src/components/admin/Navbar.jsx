import React from "react";
import Logo from "../../assets/logo-removebg-preview.png";
import { FaUserCircle } from "react-icons/fa";

// Color theme
const NAVBAR_BG = "#00796B";
const NAVBAR_TEXT = "#F5F5F5";

const AdminNavbar = ({ pageTitle = "Dashboard" }) => {
  // Get user info from localStorage
  const user = React.useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const u = JSON.parse(userData);
        return {
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          email: u.email || "",
          avatar: u.profilePic || null,
        };
      }
    } catch (e) {}
    // fallback
    return {
      name: "Admin",
      email: "admin@example.com",
      avatar: null,
    };
  }, []);

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
      {/* Right: User Info */}
      <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
};

export default AdminNavbar;