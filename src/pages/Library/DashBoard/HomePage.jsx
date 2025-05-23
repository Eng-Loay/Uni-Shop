// src/pages/HomePage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Globe, Users2, ChartNoAxesColumn, PanelsTopLeft } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function HomePage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/v1/library/library_dashboard`, {
        withCredentials: true,
      })
      .then((res) => setDashboard(res.data.library_dashboard_data))
      .catch((err) => console.error("Failed to load dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!dashboard)
    return <div className="p-4 text-red-500">Error loading data.</div>;

  const {
    total_orders,
    total_customers,
    total_Revenue,
    total_library_products,
    cancelled_orders_Percentage,
    ondelivered_Orders_Percentage,
    delivered_Orders_Percentage,
    morning_Orders_Percentage,
    afternoon_Orders_Percentage,
    evening_Orders_Percentage,
    thisWeekOrders,
    lastWeekOrders,
    monthlyRevenue,
  } = dashboard;

  const summaryCards = [
    { label: "Total Orders", value: total_orders, icon: <Globe /> },
    { label: "Total Customers", value: total_customers, icon: <Users2 /> },
    {
      label: "Total Revenue",
      value: `$${total_Revenue}`,
      icon: <ChartNoAxesColumn />,
    },
    {
      label: "Total Products",
      value: total_library_products,
      icon: <PanelsTopLeft />,
    },
  ];

  const pieData = [
    {
      name: "On Delivery",
      value: ondelivered_Orders_Percentage,
      color: "#001F54",
    },
    {
      name: "Delivered",
      value: delivered_Orders_Percentage,
      color: "#1964e6",
    },
    {
      name: "Cancelled",
      value: cancelled_orders_Percentage,
      color: "#4f7ac4",
    },
  ];

  // Pie total stays at 100 because we render each slice + grey remainder
  const totalPie = 100;

  const timeData = [
    { name: "Morning", value: morning_Orders_Percentage, color: "#001F54" },
    { name: "Afternoon", value: afternoon_Orders_Percentage, color: "#4f7ac4" },
    { name: "Evening", value: evening_Orders_Percentage, color: "#1964e6" },
  ];
  // compute the actual sum of your three percentages
  const totalTime = timeData.reduce((sum, e) => sum + e.value, 0);

  const barData = thisWeekOrders.map((val, idx) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx],
    thisWeek: val,
    lastWeek: lastWeekOrders[idx] || 0,
  }));

  const lineData = monthlyRevenue.map((rev, idx) => ({
    month: new Date(0, idx).toLocaleString("en-US", { month: "short" }),
    revenue: rev,
  }));

  return (
    <div className="container mx-auto max-w-6xl px-4 py-4">
      {/* Summary cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {summaryCards.map(({ label, value, icon }, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 flex items-center gap-3 w-full sm:w-auto"
          >
            <span className="text-[#001F54] text-3xl">{icon}</span>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary pies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <span>Today</span>
          </div>
          <div className="flex justify-around">
            {pieData.map((entry, idx) => {
              const rem = totalPie - entry.value;
              const pct = (entry.value ?? 0).toFixed(0);
              return (
                <PieChart key={idx} width={200} height={220}>
                  <Pie
                    data={[{ value: entry.value }, { value: rem }]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    <Cell fill={entry.color} />
                    <Cell fill="#f0f0f0" />
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#000"
                  >
                    {pct}%
                  </text>
                  <text
                    x="50%"
                    y="210"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#000"
                  >
                    {entry.name}
                  </text>
                </PieChart>
              );
            })}
          </div>
        </div>

        {/* Time-of-day overview */}
        <div className="bg-white rounded-xl shadow p-6 relative">
          <h3 className="text-lg font-semibold mb-2">Over View</h3>
          <div className="absolute top-6 right-6 text-sm space-y-1">
            {timeData.map((e, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: e.color }}
                />
                <span>
                  {e.name} ({e.value}%)
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-8">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie
                  data={timeData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={false}
                >
                  {timeData.map((_, i) => (
                    <Cell key={i} fill={timeData[i].color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute">
              {/* now shows 48+5+43 = 96% */}
              <p className="text-xl font-bold">{totalTime}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar & Line charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Customer Map</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="thisWeek" name="This Week" fill="#1964e6" />
              <Bar dataKey="lastWeek" name="Last Week" fill="#001F54" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
