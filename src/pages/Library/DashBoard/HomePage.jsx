import React from 'react'
import { Globe , Users2 , ChartNoAxesColumn ,PanelsTopLeft ,User } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";

function HomePage() {

  const summaryCards = [
    { label: "Total Orders", value: 450, icon:<Globe/> },
    { label: "Total Customers", value: 955, icon: <Users2/> },
    { label: "Total Revenue", value: "$50K", icon: < ChartNoAxesColumn /> },
    { label: "Total Menu", value: 250, icon: <PanelsTopLeft/> },
    { label: "Total Workers", value: 30, icon: <User/> },
  ];
  const pieData = [
    { name: "On Delivery", value: 20, color: "#001F54" },
    { name: "Delivered", value: 75, color: "#001F54" },
    { name: "Cancelled", value: 5, color: "#001F54" },
  ];
  const totalValue = pieData.reduce((acc, cur) => acc + cur.value, 0);
  const timeData = [
    { name: 'Morning', value: 20, color: '#001F54' },
    { name: 'Afternoon', value: 40, color: '#4f7ac4' },
    { name: 'Evening', value: 30, color: '#1964e6' },
  ];

  const barData = [
    { day: "Sun", thisWeek: 600, lastWeek: 400 },
    { day: "Mon", thisWeek: 800, lastWeek: 600 },
    { day: "Tue", thisWeek: 750, lastWeek: 500 },
    { day: "Wed", thisWeek: 650, lastWeek: 700 },
    { day: "Thu", thisWeek: 700, lastWeek: 600 },
    { day: "Fri", thisWeek: 900, lastWeek: 850 },
    { day: "Sat", thisWeek: 100, lastWeek: 750 },
  ];

  const lineData = [
    { month: "Jan", revenue: 400 },
    { month: "Feb", revenue: 600 },
    { month: "Mar", revenue: 500 },
    { month: "Apr", revenue: 350 },
    { month: "May", revenue: 450 },
    { month: "Jun", revenue: 700 },
  ];

  return (
    <>
  
     <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 overflow-x-hidden">
    

<div className="flex flex-wrap items-center justify-center text-gray-900 dark:text-white p-2 gap-4">
{summaryCards.map(({ label, value, icon }, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[#001F54] text-3xl">{icon}</span>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
</div>
<div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <div className='flex justify-between'>
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
         <h3>Today</h3>
          </div>
           <div className="flex justify-around">
  {pieData.map((entry, index) => {
    const percentage = ((entry.value / totalValue) * 100).toFixed(0);
    const remainingValue = totalValue - entry.value;
    return (
      <PieChart key={index} width={200} height={220}> {/* Increased height for space to display name */}
        {/* Uncolored part */}
        <Pie
          data={[{ name: 'Remaining', value: remainingValue }]}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={90 + (remainingValue / totalValue) * 360}
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          labelLine={false}
        >
          <Cell fill="#f0f0f0" /> {/* Different color for uncolored part */}
        </Pie>

        {/* Colored part */}
        <Pie
          data={[{ name: entry.name, value: entry.value }]}
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={90 + (entry.value / totalValue) * 360}
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          label={({ cx, cy }) => (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#000">
              {percentage}%
            </text>
          )}
          labelLine={false}
        >
          <Cell fill={entry.color} />
        </Pie>

        {/* Name below the pie */}
        <text x="50%" y="210" textAnchor="middle" fill="#000" fontSize="12">
          {entry.name}
        </text>
      </PieChart>
    );
  })}
</div>
 </div>

<div className="bg-white rounded-xl shadow p-6 relative">
 
    <h3 className="text-lg font-semibold mb-2 text-left">Over View</h3>
    <div className="absolute top-6 right-6 space-y-1 text-sm">
    {timeData.map((entry, index) => {
      const total = timeData.reduce((acc, cur) => acc + cur.value, 0);
      const percent = ((entry.value / total) * 100).toFixed(0);
      return (
        <div key={index} className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name} ({percent}%)</span>
        </div>
      );
    })}
  </div>
    <div className='relative flex justify-center items-center mt-8'>
    <PieChart width={220} height={220}>
      <Pie
       data={timeData}
       cx="50%"
       cy="50%"
       innerRadius={60}
       outerRadius={80}
       fill="#8884d8"
       paddingAngle={2}
       dataKey="value"
      >
        {timeData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    
    </PieChart>
    <div className="absolute">
      <p className="text-xl font-bold text-center">{timeData.reduce((acc, cur) => acc + cur.value, 0)}%</p>
    </div>
    </div>
  
  </div>
  
        </div>
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Customer Map</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="thisWeek" fill="#001F54" name="This Week" />
              <Bar dataKey="lastWeek" fill="#4f7ac4" name="Last Week" />
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
              <Line type="monotone" dataKey="revenue" stroke="#1964e6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
     
    </>
  )
}

export default HomePage