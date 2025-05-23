// src/components/HomeDrawer.jsx
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import axios from "axios";

export default function HomeDrawer() {
  const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3000/";
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFaculty, setExpandedFaculty] = useState(null);
  const [faculties, setFaculties] = useState([]);

  /* --------------------------------------------------
   * Fetch faculties once on mount
   * -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_ROOT}api/v1/Faculties`);
        // sort levels inside each faculty for consistent order
        const sorted = (data || []).map((f) => ({
          ...f,
          levels: [...f.levels].sort((a, b) => a.level_number - b.level_number),
        }));
        setFaculties(sorted);
      } catch (err) {
        console.error("Failed to load faculties:", err);
      }
    })();
  }, [API_ROOT]);

  const toggleFaculty = (index) =>
    setExpandedFaculty((prev) => (prev === index ? null : index));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-7 left-4 z-50 p-2 text-white rounded-md shadow-lg focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-[#001F54] shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        } relative`}
      >
        <nav className="p-4 space-y-6">
          {isOpen && (
            <h2 className="text-center text-lg font-semibold text-white mt-4">
              Faculties
            </h2>
          )}

          {/* Faculties list */}
          <div className="space-y-2">
            {faculties.map((faculty, idx) => (
              <div key={faculty._id} className="space-y-1">
                {/* Faculty header */}
                <button
                  onClick={() => toggleFaculty(idx)}
                  className={`w-full flex items-center ${
                    isOpen ? "px-3" : "justify-center"
                  } py-2 text-sm rounded-md text-white hover:bg-gray-100 hover:text-gray-900`}
                >
                  {isOpen && (
                    <>
                      <span className="flex-shrink-0">{faculty.name}</span>
                      <span className="ml-auto">
                        {expandedFaculty === idx ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    </>
                  )}
                </button>

                {/* Levels */}
                {isOpen && expandedFaculty === idx && (
                  <div className="ml-4 mt-1 space-y-1">
                    {faculty.levels.map(({ level_number }) => (
                      <NavLink
                        key={level_number}
                        to={`/faculty/${encodeURIComponent(faculty.name)}/level/${level_number}`}
                        className="block px-3 py-2 text-sm rounded-md text-white hover:bg-gray-100 hover:text-gray-900"
                      >
                        Level&nbsp;{level_number}
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
