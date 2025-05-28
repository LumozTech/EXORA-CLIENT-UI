import React from "react";
import SlideBar from "../../components/admin/SlideBar";
import AdminNavbar from "../../components/admin/Navbar";
import adminBg from "../../assets/adminBg.jpg";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";

// Chart.js for graphs
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const PRIMARY = "#00796B";
const CARD_BG = "#fff";
const CARD_BG_DARK = "#1a202c";
const CARD_BORDER = "#CBD5E0";

const stats = [
  {
    label: "Total Users",
    value: 1240,
    icon: <FaUsers className="text-3xl" style={{ color: PRIMARY }} />,
    bg: "bg-[#E0F2F1] dark:bg-[#134E4A]",
  },
  {
    label: "Products",
    value: 320,
    icon: <FaBoxOpen className="text-3xl" style={{ color: PRIMARY }} />,
    bg: "bg-[#E0F7FA] dark:bg-[#134E4A]",
  },
  {
    label: "Orders",
    value: 870,
    icon: <FaShoppingCart className="text-3xl" style={{ color: PRIMARY }} />,
    bg: "bg-[#E8F5E9] dark:bg-[#134E4A]",
  },
  {
    label: "Revenue",
    value: "Rs. 1,200,000",
    icon: <FaMoneyBillWave className="text-3xl" style={{ color: PRIMARY }} />,
    bg: "bg-[#FFFDE7] dark:bg-[#134E4A]",
  },
];

const recentOrders = [
  {
    id: 1,
    user: "Nimal",
    product: "Classic Polo Shirt",
    amount: "Rs. 2,000",
    status: "Delivered",
  },
  {
    id: 2,
    user: "Kasun",
    product: "Denim Jeans",
    amount: "Rs. 2,800",
    status: "Pending",
  },
  {
    id: 3,
    user: "Sahan",
    product: "Formal Suit",
    amount: "Rs. 8,500",
    status: "Shipped",
  },
  {
    id: 4,
    user: "Amal",
    product: "Casual T-Shirt",
    amount: "Rs. 1,200",
    status: "Delivered",
  },
];

const topProducts = [
  { id: 1, name: "Classic Polo Shirt", sold: 120, stock: 30 },
  { id: 2, name: "Denim Jeans", sold: 95, stock: 15 },
  { id: 3, name: "Formal Suit", sold: 80, stock: 10 },
  { id: 4, name: "Casual T-Shirt", sold: 75, stock: 25 },
];

const userGrowthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "New Users",
      data: [120, 150, 180, 200, 170, 210],
      backgroundColor: PRIMARY,
      borderRadius: 8,
    },
  ],
};

const orderStatusData = {
  labels: ["Delivered", "Pending", "Shipped"],
  datasets: [
    {
      label: "Orders",
      data: [540, 210, 120],
      backgroundColor: ["#4CAF50", "#FFD600", "#2196F3"],
      borderWidth: 0,
    },
  ],
};

const Dashboard = () => {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${adminBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Sidebar */}
      <div className="mt-6 ml-6">
        <SlideBar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-0 md:p-0">
        <div className="mt-6 ml-6 mr-6">
          <AdminNavbar pageTitle="Dashboard" />
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mt-8 mb-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl shadow-md p-6 flex items-center gap-4 border backdrop-blur-sm bg-white/30 dark:bg-gray-800/30`}
                style={{
                  borderColor: CARD_BORDER,
                  borderWidth: 1.5,
                }}
              >
                <div>{stat.icon}</div>
                <div>
                  <div
                    className="text-2xl font-bold text-white"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-100">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Graphs */}
          <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-2">
            <div
              className="flex flex-col items-center w-full p-6 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30 dark:bg-gray-800/30"
              style={{
                borderColor: CARD_BORDER,
                borderWidth: 1.5,
                minHeight: 280,
                maxWidth: "100%",
              }}
            >
              <h2
                className="mb-4 text-lg font-semibold text-white"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                User Growth (Last 6 Months)
              </h2>
              <div style={{ width: 260, height: 180 }}>
                <Bar
                  data={userGrowthData}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: { 
                      y: { 
                        beginAtZero: true,
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                      },
                      x: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                      }
                    },
                    responsive: false,
                    maintainAspectRatio: false,
                  }}
                  width={260}
                  height={180}
                />
              </div>
            </div>
            <div
              className="flex flex-col items-center w-full p-6 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30 dark:bg-gray-800/30"
              style={{
                borderColor: CARD_BORDER,
                borderWidth: 1.5,
                minHeight: 280,
                maxWidth: "100%",
              }}
            >
              <h2
                className="mb-4 text-lg font-semibold text-white"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              >
                Order Status Distribution
              </h2>
              <div style={{ width: 220, height: 180 }}>
                <Doughnut
                  data={orderStatusData}
                  options={{
                    plugins: { 
                      legend: { 
                        position: "bottom",
                        labels: { color: '#fff' }
                      }
                    },
                    cutout: "70%",
                    responsive: false,
                    maintainAspectRatio: false,
                  }}
                  width={220}
                  height={180}
                />
              </div>
            </div>
          </div>
          {/* Top Products Table */}
          <div
            className="p-6 mb-10 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30 dark:bg-gray-800/30"
            style={{
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <h2
              className="mb-4 text-xl font-semibold text-white"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              Top Selling Products
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Sold</th>
                    <th className="px-4 py-2">Stock Left</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-white/10"
                    >
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.sold}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Recent Orders Table */}
          <div
            className="p-6 border shadow-md rounded-2xl backdrop-blur-sm bg-white/30 dark:bg-gray-800/30"
            style={{
              borderColor: CARD_BORDER,
              borderWidth: 1.5,
            }}
          >
            <h2
              className="mb-4 text-xl font-semibold text-white"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              Recent Orders
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-white/10"
                    >
                      <td className="px-4 py-2">{order.id}</td>
                      <td className="px-4 py-2">{order.user}</td>
                      <td className="px-4 py-2">{order.product}</td>
                      <td className="px-4 py-2">{order.amount}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-200 text-green-800"
                              : order.status === "Pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
