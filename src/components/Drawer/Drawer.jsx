import  { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, FileText, Layers } from "lucide-react";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Outlet, NavLink, useLocation } from "react-router-dom";


// Class-based components for each page
// class LogoutPage extends React.Component {
//   render() {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
//           <div className="text-center">
//             <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
//               Logout
//             </h1>
//             <p className="text-gray-600">
//               You have been logged out successfully.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

const NAVIGATION = [
  {
    title: "Main items",
    items: [
      {
        title: "Home",
        icon: <FaHome size={20} />,
        path: "/minidrawer/home",
      },
      {
        title: "Items",
        icon: <FaBoxOpen size={20} />,
        path: "/minidrawer/items",
      },
      {
        title: "Orders",
        icon: <FaShoppingCart size={20} />,
        path: "/minidrawer/orders",
      },
      {
        title: "Information",
        icon: <FaInfoCircle size={20} />,
        path: "/minidrawer/information",
      },
      {
        title: "Logout",
        icon: <FaSignOutAlt size={20} />,
        path: "/logout",
        action: true,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        icon: <BarChart size={20} />,
        path: "/reports",
        children: [
          {
            title: "Sales",
            icon: <FileText size={20} />,
            path: "/reports/sales",
          },
          {
            title: "Traffic",
            icon: <FileText size={20} />,
            path: "/reports/traffic",
          },
        ],
      },
      {
        title: "Integrations",
        icon: <Layers size={20} />,
        path: "/integrations",
      },
    ],
  },
];

function MiniDrawer() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("/home");
  const [isReportsExpanded, setIsReportsExpanded] = useState(false);
  const [, setIsLoggedIn] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [setActivePage] = useState("home");
  const location = useLocation();
  // const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    if (activeItem === "/logout") {
      handleLogout();
    }
  }, [activeItem]);

  useEffect(() => {
    // Extract the current active page from the URL path
    const path = location.pathname.split("/");
    if (path.length >= 3) {
      setActivePage(path[2]);
    } else {
      setActivePage("home");
    }
  }, [location]);

  // const renderContent = useMemo(() => {
  //   switch (activeItem) {
  //     case "/home":
  //       return <HomePage />;
  //     case "/orders":
  //       return <div>Orders Page</div>;
  //     case "/items":
  //       return <ItemsLibrary />;
  //     case "/information":
  //       return <div>Information Page</div>;
  //     case "/logout":
  //       return <LogoutPage />;
  //     case "/reports/sales":
  //       return <div>Sales Reports</div>;
  //     case "/reports/traffic":
  //       return <div>Traffic Reports</div>;
  //     case "/integrations":
  //       return <div>Integrations</div>;
  //     default:
  //       return <HomePage />;
  //   }
  // }, [activeItem]);

  const handleNavigationClick = (path) => {
    if (activeItem !== path) {
      setActiveItem(path);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } relative`}
        style={{ backgroundColor: "#001F54" }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <nav className="p-4 space-y-6">
          {NAVIGATION.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {isOpen && (
                <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {section.title}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    {item.action ? (
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${
                          isOpen ? "px-3" : "justify-center"
                        } py-2 text-sm rounded-md transition-colors 
                          text-gray-300 hover:bg-blue-700 hover:text-white`}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {isOpen && <span className="ml-3">{item.title}</span>}
                      </button>
                    ) : item.children ? (
                      <button
                        onClick={() => {
                          setIsReportsExpanded(!isReportsExpanded);
                        }}
                        className={`w-full flex items-center ${
                          isOpen ? "px-3" : "justify-center"
                        } py-2 text-sm rounded-md transition-colors ${
                          activeItem === item.path
                            ? "bg-blue-800 text-white"
                            : "text-gray-300 hover:bg-blue-700 hover:text-white"
                        }`}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {isOpen && <span className="ml-3">{item.title}</span>}
                        {isOpen && item.children && (
                          <span className="ml-auto">
                            {isReportsExpanded ? "▲" : "▼"}
                          </span>
                        )}
                      </button>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `w-full flex items-center ${
                            isOpen ? "px-3" : "justify-center"
                          } py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? "bg-blue-800 text-white"
                              : "text-gray-300 hover:bg-blue-700 hover:text-white"
                          }`
                        }
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {isOpen && <span className="ml-3">{item.title}</span>}
                      </NavLink>
                    )}

                    {isOpen && item.children && isReportsExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child, childIdx) => (
                          <button
                            key={childIdx}
                            onClick={() => handleNavigationClick(child.path)}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              activeItem === child.path
                                ? "bg-blue-800 text-white"
                                : "text-gray-300 hover:bg-blue-700 hover:text-white"
                            }`}
                          >
                            <span className="flex-shrink-0">{child.icon}</span>
                            <span className="ml-3">{child.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MiniDrawer;
