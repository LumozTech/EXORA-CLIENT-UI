import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Add this import
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPlus,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BORDER = "#CBD5E0";

// Example user data
const initialUsers = [
  {
    id: 1,
    name: "Nimal Perera",
    email: "nimal@example.com",
    phone: "0771234567",
    address: "Colombo, Sri Lanka",
    joined: "2023-01-15",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Kasun Silva",
    email: "kasun@example.com",
    phone: "0719876543",
    address: "Kandy, Sri Lanka",
    joined: "2022-11-22",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    name: "Ayesha Fernando",
    email: "ayesha@example.com",
    phone: "0765551234",
    address: "Galle, Sri Lanka",
    joined: "2023-03-10",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 4,
    name: "Ravi Jayasuriya",
    email: "ravi@example.com",
    phone: "0723219876",
    address: "Negombo, Sri Lanka",
    joined: "2023-02-05",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
  },
  // Add more users for pagination demo
  {
    id: 5,
    name: "Saman Kumara",
    email: "saman@example.com",
    phone: "0751234567",
    address: "Matara, Sri Lanka",
    joined: "2023-04-01",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 6,
    name: "Dilani Perera",
    email: "dilani@example.com",
    phone: "0789876543",
    address: "Kurunegala, Sri Lanka",
    joined: "2023-04-10",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    id: 7,
    name: "Chathura Senanayake",
    email: "chathura@example.com",
    phone: "0745551234",
    address: "Anuradhapura, Sri Lanka",
    joined: "2023-05-10",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    id: 8,
    name: "Ishara Gunasekara",
    email: "ishara@example.com",
    phone: "0733219876",
    address: "Badulla, Sri Lanka",
    joined: "2023-05-15",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const USERS_PER_PAGE = 5;

// Format phone number to +94 XX XXX XXXX
function formatPhone(phone) {
  if (!phone) return "";
  // Remove non-digits
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+94 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null); // For modal
  const navigate = useNavigate(); // <-- Add this line

  // Replace handleAddUser to navigate to add user page
  const handleAddUser = () => {
    navigate("/admin/add-user");
  };

  // Toggle user status
  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  // Filtered and paginated users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.toLowerCase().includes(search.toLowerCase()) ||
      user.address.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Reset to page 1 on search
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  // Modal close handler
  const closeModal = () => setSelectedUser(null);

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(135deg, #E0F2F1 0%, #CBD5E0 100%)",
      }}
    >
      {/* Sidebar */}
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-10 ml-6 mr-6">
          {" "}
          {/* margin top from navbar */}
          <AdminNavbar pageTitle="Users" />
          <div
            className="p-6 mt-8 mb-10 border shadow-md rounded-2xl"
            style={{
              background: CARD_BG,
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold" style={{ color: PRIMARY }}>
                User Information
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    style={{ minWidth: 200 }}
                  />
                  <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                </div>
                {/* Add User Button */}
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg shadow bg-[#00796B] hover:bg-[#005B4F] transition ml-0 sm:ml-4"
                >
                  <FaPlus /> Add User
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Address</th>
                    <th className="px-4 py-2">Joined</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-6 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t cursor-pointer hover:bg-[#E0F2F1]/60 transition"
                        style={{ borderColor: CARD_BORDER }}
                        onClick={() => setSelectedUser(user)}
                      >
                        <td
                          className="px-4 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="inline-block object-cover border border-gray-300 rounded-full w-9 h-9"
                              />
                            ) : (
                              <FaUserCircle className="inline text-2xl text-primary" />
                            )}
                            <span className="font-semibold">{user.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold">{user.name}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400" />
                            <span>{formatPhone(user.phone)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span>{user.address}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">{user.joined}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "Active"
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td
                          className="px-4 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`flex items-center gap-1 px-3 py-1 rounded transition text-xs font-semibold ${
                              user.status === "Active"
                                ? "bg-gray-300 text-gray-700 hover:bg-red-200"
                                : "bg-green-200 text-green-800 hover:bg-green-300"
                            }`}
                            title={
                              user.status === "Active"
                                ? "Set Inactive"
                                : "Set Active"
                            }
                          >
                            {user.status === "Active" ? (
                              <>
                                <FaTimes /> Deactivate
                              </>
                            ) : (
                              <>
                                <FaCheck /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded font-semibold ${
                    page === i + 1
                      ? "bg-[#00796B] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={page === totalPages || totalPages === 0}
                className="px-3 py-1 font-semibold text-gray-700 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
              className="relative w-full max-w-md p-8 bg-white shadow-lg rounded-2xl"
              style={{ border: `2px solid ${CARD_BORDER}` }}
            >
              <button
                className="absolute text-2xl text-gray-500 top-3 right-3 hover:text-red-500"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center gap-3">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="object-cover w-20 h-20 border border-gray-300 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-20 h-20 text-primary" />
                )}
                <h3 className="mt-2 mb-1 text-2xl font-bold">
                  {selectedUser.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope /> <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone /> <span>{formatPhone(selectedUser.phone)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt /> <span>{selectedUser.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">Joined:</span>
                  <span>{selectedUser.joined}</span>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
