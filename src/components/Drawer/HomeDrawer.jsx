import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const FACULTIES = [
  {
    title: "Medicine",
    items: [
      { title: "Anatomy", path: "/medicine/anatomy" },
      { title: "Pharmacology", path: "/medicine/pharmacology" },
    ],
  },
  {
    title: "Engineering",
    items: [
      { title: "Civil Engineering", path: "/engineering/civil" },
      { title: "Mechanical Engineering", path: "/engineering/mechanical" },
    ],
  },
  {
    title: "Business",
    items: [
      { title: "Marketing", path: "/business/marketing" },
      { title: "Finance", path: "/business/finance" },
    ],
  },
  {
    title: "Arts",
    items: [
      { title: "Literature", path: "/arts/literature" },
      { title: "History", path: "/arts/history" },
    ],
  },
];

function HomeDrawer() {
  const [isOpen, setIsOpen] = useState(false); // Initially closed
  const [expandedFaculty, setExpandedFaculty] = useState(null);

  const toggleFaculty = (index) => {
    if (expandedFaculty === index) {
      setExpandedFaculty(null); // Collapse if already expanded
    } else {
      setExpandedFaculty(index); // Expand the clicked faculty
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Hamburger Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-7 left-4 z-50 p-2 text-white rounded-md shadow-lg cursor-pointer focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Aside Bar */}
      <aside
        className={`bg-[#001F54] shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        } relative`}
      >
        <nav className="p-4 space-y-6 ">
          {/* Categories Title */}
          {isOpen && (
            <h2 className="text-center text-lg font-semibold text-white mt-4">
              Categories
            </h2>
          )}

          {/* Faculties Dropdowns */}
          <div className="space-y-2">
            {FACULTIES.map((faculty, index) => (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => toggleFaculty(index)}
                  className={`w-full flex items-center ${
                    isOpen ? "px-3" : "justify-center"
                  } py-2 text-sm rounded-md transition-colors text-white hover:bg-gray-100 hover:text-gray-900`}
                >
                  {isOpen && (
                    <>
                      <span className="flex-shrink-0">{faculty.title}</span>
                      <span className="ml-auto">
                        {expandedFaculty === index ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    </>
                  )}
                </button>
                {isOpen && expandedFaculty === index && (
                  <div className="ml-4 mt-1 space-y-1">
                    {faculty.items.map((item, itemIdx) => (
                      <NavLink
                        key={itemIdx}
                        to={item.path}
                        className="w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors text-white hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span>{item.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default HomeDrawer;
