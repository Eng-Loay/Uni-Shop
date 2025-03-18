// import React, { useState } from "react";
// import axios from "axios"; // Import Axios
// import { BarChart, FileText, Layers } from "lucide-react";
// import {
//   FaHome,
//   FaShoppingCart,
//   FaBoxOpen,
//   FaInfoCircle,
//   FaSignOutAlt,
// } from "react-icons/fa"; // Import icons
// import Login from "../../Auth/Student/Login/Login";

// // Class-based components for each page
// class HomePage extends React.Component {
//   render() {
//     return (
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-900 mb-6">Home</h1>
//         <p>Welcome to the Home page! This is your starting point.</p>
//       </div>
//     );
//   }
// }

// class LogoutPage extends React.Component {
//   render() {
//     return (
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-900 mb-6">Logout</h1>
//         <p>You have been logged out successfully.</p>
//       </div>
//     );
//   }
// }

// const NAVIGATION = [
//   {
//     title: "Main items",
//     items: [
//       {
//         title: "Home",
//         icon: <FaHome size={20} />, // Home icon
//         path: "/home",
//       },
//       {
//         title: "Items",
//         icon: <FaBoxOpen size={20} />, // Items icon
//         path: "/items",
//       },
//       {
//         title: "Orders",
//         icon: <FaShoppingCart size={20} />, // Order icon
//         path: "/orders",
//       },
//       {
//         title: "Information",
//         icon: <FaInfoCircle size={20} />, // Information icon
//         path: "/information",
//       },
//       {
//         title: "Logout",
//         icon: <FaSignOutAlt size={20} />, // Logout icon
//         path: "/logout",
//       },
//     ],
//   },
//   {
//     title: "Analytics",
//     items: [
//       {
//         title: "Reports",
//         icon: <BarChart size={20} />,
//         path: "/reports",
//         children: [
//           {
//             title: "Sales",
//             icon: <FileText size={20} />,
//             path: "/reports/sales",
//           },
//           {
//             title: "Traffic",
//             icon: <FileText size={20} />,
//             path: "/reports/traffic",
//           },
//         ],
//       },
//       {
//         title: "Integrations",
//         icon: <Layers size={20} />,
//         path: "/integrations",
//       },
//     ],
//   },
// ];

// function Dashboard() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [activeItem, setActiveItem] = useState("/home");
//   const [isReportsExpanded, setIsReportsExpanded] = useState(false); // State for Reports dropdown
//   const [, setIsLoggedIn] = useState(true);

//   // Get API base URL from environment variables
//   const API_BASE_URL = import.meta.env.VITE_API_URL;

//   // Logout function
//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}api/v1/auth/logout`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         setIsLoggedIn(false);
//         localStorage.removeItem("isLoggedIn"); // Clear login state
//         setTimeout(() => {
//           window.location.href = "/"; // Redirect to home page after a delay
//         }, 1000); // 1 second delay
//       }
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   // Function to render content based on the activeItem
//   const renderContent = () => {
//     switch (activeItem) {
//       case "/home":
//         return <Login />;
//       case "/orders":
//         return <Login />;
//       case "/items":
//         return <Login />;
//       case "/information":
//         return <Login />;
//       case "/logout":
//         handleLogout(); // Call logout function
//         return <LogoutPage />;
//       case "/reports/sales":
//         return <Login />;
//       case "/reports/traffic":
//         return <Login />;
//       case "/integrations":
//         return <Login />;
//       default:
//         return <HomePage />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside
//         className={`shadow-lg transition-all duration-300 ${
//           isOpen ? "w-64" : "w-20"
//         } relative`}
//         style={{ backgroundColor: "#001F54" }}
//         onMouseEnter={() => setIsOpen(true)} // Expand on hover
//         onMouseLeave={() => setIsOpen(false)} // Collapse on hover out
//       >
//         {/* Navigation */}
//         <nav className="p-4 space-y-6">
//           {NAVIGATION.map((section, idx) => (
//             <div key={idx} className="space-y-2">
//               {isOpen && (
//                 <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
//                   {section.title}
//                 </h2>
//               )}
//               <div className="space-y-1">
//                 {section.items.map((item, itemIdx) => (
//                   <div key={itemIdx}>
//                     <button
//                       onClick={() => {
//                         if (item.children) {
//                           // Toggle the Reports dropdown
//                           setIsReportsExpanded(!isReportsExpanded);
//                         } else {
//                           setActiveItem(item.path);
//                         }
//                       }}
//                       className={`w-full flex items-center ${
//                         isOpen ? "px-3" : "justify-center"
//                       } py-2 text-sm rounded-md transition-colors ${
//                         activeItem === item.path
//                           ? "bg-blue-800 text-white"
//                           : "text-gray-300 hover:bg-blue-700 hover:text-white"
//                       }`}
//                     >
//                       <span className="flex-shrink-0">{item.icon}</span>
//                       {isOpen && <span className="ml-3">{item.title}</span>}
//                       {isOpen && item.children && (
//                         <span className="ml-auto">
//                           {isReportsExpanded ? "▲" : "▼"}
//                         </span>
//                       )}
//                     </button>
//                     {isOpen && item.children && isReportsExpanded && (
//                       <div className="ml-8 mt-1 space-y-1">
//                         {item.children.map((child, childIdx) => (
//                           <button
//                             key={childIdx}
//                             onClick={() => setActiveItem(child.path)}
//                             className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
//                               activeItem === child.path
//                                 ? "bg-blue-800 text-white"
//                                 : "text-gray-300 hover:bg-blue-700 hover:text-white"
//                             }`}
//                           >
//                             <span className="flex-shrink-0">{child.icon}</span>
//                             <span className="ml-3">{child.title}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 ">
//         {/* Render content dynamically based on activeItem */}
//         {renderContent()}
//       </main>
//     </div>
//   );
// }

// export default Dashboard;
