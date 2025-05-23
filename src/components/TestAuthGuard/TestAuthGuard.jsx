import { useAuth } from "../../context/AuthContext";

const TestAuthGuard = () => {
  const { isAuthenticated, userRole, userId, logout } = useAuth();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#001F54] mb-6">
        Authentication Status
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Auth State:</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Authentication Status:</span>{" "}
            {isAuthenticated ? (
              <span className="text-green-600 font-bold">Authenticated</span>
            ) : (
              <span className="text-red-600 font-bold">Not Authenticated</span>
            )}
          </p>

          <p>
            <span className="font-medium">User Role:</span>{" "}
            {userRole ? (
              <span className="text-blue-600 font-bold">{userRole}</span>
            ) : (
              <span className="text-gray-500">None</span>
            )}
          </p>

          <p>
            <span className="font-medium">User ID:</span>{" "}
            {userId ? (
              <span className="text-blue-600 font-mono">{userId}</span>
            ) : (
              <span className="text-gray-500">None</span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Protected Routes:</h2>
        <div className="space-y-2">
          <p className="mb-2">Based on your current role, you can access:</p>

          <ul className="list-disc pl-5 space-y-1">
            {!isAuthenticated && (
              <>
                <li>
                  Home Page (public) -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
                <li>
                  Login/Signup Pages -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
                <li>
                  Student Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
                <li>
                  Library Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
                <li>
                  Admin Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
              </>
            )}

            {isAuthenticated && userRole === "student" && (
              <>
                <li>
                  Home Page (public) -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
                <li>
                  Login/Signup Pages -{" "}
                  <span className="text-red-600">Redirects to Home</span>
                </li>
                <li>
                  Student Routes -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
                <li>
                  Library Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
                <li>
                  Admin Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
              </>
            )}

            {isAuthenticated && userRole === "library" && (
              <>
                <li>
                  Home Page (public) -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
                <li>
                  Login/Signup Pages -{" "}
                  <span className="text-red-600">Redirects to Home</span>
                </li>
                <li>
                  Student Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
                <li>
                  Library Routes -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
                <li>
                  Admin Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
              </>
            )}

            {isAuthenticated && userRole === "admin" && (
              <>
                <li>
                  Home Page (public) -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
                <li>
                  Login/Signup Pages -{" "}
                  <span className="text-red-600">Redirects to Home</span>
                </li>
                <li>
                  Student Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
                <li>
                  Library Routes -{" "}
                  <span className="text-red-600">Not Accessible</span>
                </li>
                <li>
                  Admin Routes -{" "}
                  <span className="text-green-600">Accessible</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {isAuthenticated && (
        <div className="mt-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default TestAuthGuard;
