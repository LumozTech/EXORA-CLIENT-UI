import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaBox,
  FaCog,
  FaStar,
  FaSignOutAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTruck,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo-removebg-preview.png";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, link: "/admin/dashboard" },
  { name: "Users", icon: <FaUser />, link: "/admin/users" },
  { name: "Products", icon: <FaBox />, link: "/admin/products" },
  { name: "Orders", icon: <FaTruck />, link: "/admin/orders" },
  { name: "Reviews", icon: <FaStar />, link: "/admin/reviews" },
  { name: "Settings", icon: <FaCog />, link: "/admin/settings" },
];

const SIDEBAR_BG = "linear-gradient(135deg, #00796B 60%, #43cea2 100%)";
const SIDEBAR_BORDER = "#CBD5E0";

const SlideBar = () => {
  const [open, setOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop
  const location = useLocation();
  const navigate = useNavigate();

  // Track selected tab by current route
  const [selected, setSelected] = useState(location.pathname);

  useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <div
        className="flex items-center p-4 md:hidden"
        style={{ background: "#00796B", color: "#fff" }}
      >
        <button onClick={() => setOpen(true)}>
          <FaBars className="text-2xl" />
        </button>
        <img src={Logo} alt="Logo" className="w-10 ml-4 rounded-full" />
        <span className="ml-2 text-xl font-bold">Admin</span>
      </div>
      {/* Sidebar */}
      <div
        className={`fixed top-8 left-6 mt-4 rounded-2xl shadow-xl z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block`}
        style={{
          width: collapsed ? 80 : 260,
          background: SIDEBAR_BG,
          color: "#fff",
          border: `1.5px solid ${SIDEBAR_BORDER}`,
          minHeight: "calc(100vh - 4rem)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Collapse Button */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="w-10 rounded-full shadow" />
            {!collapsed && (
              <span
                className="text-xl font-bold tracking-wide"
                style={{ color: "#fff" }}
              >
                Admin Panel
              </span>
            )}
          </div>
          <button
            className="hidden ml-auto md:block"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Collapse sidebar"
          >
            {collapsed ? (
              <FaAngleDoubleRight className="text-xl" />
            ) : (
              <FaAngleDoubleLeft className="text-xl" />
            )}
          </button>
          <button
            className="ml-2 md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
        {/* Menu */}
        <nav className="flex flex-col gap-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setSelected(item.link);
                navigate(item.link);
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-6 py-3 font-medium rounded-xl transition-all duration-200 w-full
                ${
                  selected === item.link
                    ? "bg-white/90 text-[#00796B] shadow font-bold"
                    : "hover:bg-white/20 hover:shadow"
                }`}
              style={{
                color: selected === item.link ? "#00796B" : "#fff",
                justifyContent: collapsed ? "center" : "flex-start",
                boxShadow:
                  selected === item.link
                    ? "0 2px 8px 0 rgba(67,206,162,0.10)"
                    : "none",
              }}
            >
              <span
                className={`text-xl ${
                  selected === item.link ? "text-[#00796B]" : ""
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
        {/* Logout Button */}
        <div
          className="px-4 mt-auto mb-4"
          style={{
            paddingTop: "1.5rem",
          }}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 font-medium rounded-xl transition
              bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg
              justify-${collapsed ? "center" : "start"}`}
          >
            <FaSignOutAlt className="text-xl" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default SlideBar;
