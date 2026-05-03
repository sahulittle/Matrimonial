import {
  FiUsers,
  FiUserCheck,
  FiMail,
  FiSmartphone,
  FiPackage,
  FiHeart,
  FiUserX,
  FiFlag,
} from "react-icons/fi";
import {
  FaMoneyBillWave,
  FaHourglassHalf,
  FaTimesCircle,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from "recharts";
import React, { useEffect, useState } from "react";
import { on, off } from "../../services/socketService";
import { getDashboardStats, getGraphData } from "../../api/adminApi/adminApi";
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`text-3xl p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getDashboardStats();
        const graphRes = await getGraphData();

        setStatsData(statsRes.stats);
        setGraphData(graphRes.data);
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // realtime updates: refresh when backend notifies graph update
    const handleGraphUpdate = async (data) => {
      try {
        // simply refetch stats and graph
        const statsRes = await getDashboardStats();
        const graphRes = await getGraphData();
        setStatsData(statsRes.stats);
        setGraphData(graphRes.data);
      } catch (err) {
        console.error("Error refreshing dashboard on graph update", err);
      }
    };

    on("dashboard:graphUpdated", handleGraphUpdate);
    return () => off("dashboard:graphUpdated", handleGraphUpdate);
  }, []);
  const stats = statsData
    ? [
        {
          title: "Total Users",
          value: statsData.users.total,
          icon: <FiUsers />,
          color: "bg-blue-100 text-blue-600",
        },
        {
          title: "Active Users",
          value: statsData.users.active,
          icon: <FiUserCheck />,
          color: "bg-green-100 text-green-600",
        },
        {
          title: "Banned Users",
          value: statsData.users.banned,
          icon: <FiUserX />,
          color: "bg-red-100 text-red-600",
        },
        {
          title: "Revenue",
          value: `₹${statsData.revenue.total}`,
          icon: <FaMoneyBillWave />,
          color: "bg-teal-100 text-teal-600",
        },
        {
          title: "Pending Tickets",
          value: statsData.support.pendingTickets,
          icon: <FaHourglassHalf />,
          color: "bg-purple-100 text-purple-600",
        },
        {
          title: "Reports",
          value: statsData.reports.pending,
          icon: <FiFlag />,
          color: "bg-amber-100 text-amber-600",
        },
      ]
    : [];
  const usersJoinedData = graphData?.usersJoined || [];
  const revenueData = graphData?.revenue || [];

  const timeseries = graphData?.timeseries || [];

  const revenueByPackage = graphData?.revenueByPackage || [];

  const osData = graphData?.os || [];

  const countryData = graphData?.countries || [];

  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }
  return (
    <div className="space-y-8">
      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login by Browser */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Login By Browser (Last 30 days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersJoinedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Users overview (Total / Active / Banned) + Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Users Overview (Last 30 days)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "revenue") return currencyFormatter.format(value || 0);
                  return value;
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="totalUsers" stroke="#8884d8" dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="activeUsers" stroke="#00C49F" dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="totalBanned" stroke="#FF8042" dot={false} />
              <Bar yAxisId="right" dataKey="revenue" barSize={16} fill="#2563eb" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Login by Country */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Login By Country (Last 30 days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={countryData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend iconType="circle" iconSize={10} />
            <Bar dataKey="logins" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Revenue by Package (Last 30 days) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Revenue by Package (Last 30 days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueByPackage} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis type="number" />
            <YAxis dataKey="packageName" type="category" width={160} />
            <Tooltip formatter={(value) => currencyFormatter.format(value || 0)} />
            <Legend />
            <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
