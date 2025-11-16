import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserDropdown = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const isActive = (path: any) => location.pathname.startsWith(path);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-semibold text-lg shadow-md">
          {initial}
        </div>
        <span className="text-gray-800 dark:text-white font-medium hidden sm:block">
          {user?.name || "User"}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 p-4 w-64 bg-white dark:bg-gray-800  rounded-lg shadow-xl z-50 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="font-bold text-gray-900 dark:text-white truncate">
              {user?.name || "Guest User"}
            </p>
            <p className="text-sm text-[#4F46E5] mt-1 capitalize">
              {user?.role || "No Role"}
            </p>
          </div>

          <div className="py-2">
            {" "}
            
            {user.role === "employer" && (
              <Link
                to="/employer/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm transition ${
                  isActive("/employer/dashboard")
                    ? "bg-gray-200 dark:bg-gray-700 font-semibold text-[#4F46E5]"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Employer Dashboard
              </Link>
            )}
            {user.role === "candidate" && (
              <Link
                to="/candidate/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm transition ${
                  isActive("/candidate/dashboard")
                    ? "bg-gray-200 dark:bg-gray-700 font-semibold text-[#4F46E5]"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                My Applications
              </Link>
            )}
            {/* Logout Option with increased py-3 padding */}
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: any) => location.pathname.startsWith(path);

  return (
    <nav className="shadow-lg bg-white dark:bg-gray-900 h-20 flex items-center">
      <div className="w-full mx-auto flex justify-between items-center px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-[#4F46E5] dark:text-[#6D63F4]"
          >
            <span className="text-3xl">✨</span>
            HireFlow
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-4">
              {user.role === "employer" && (
                <div className="flex items-center gap-6">
                  <Link
                    to="/"
                    className={`relative pb-1 transition duration-150  ${
    location.pathname === "/"
                        ? 'font-semibold text-[#4F46E5] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5]'
                        : "text-gray-600 dark:text-gray-300 hover:text-[#4F46E5]"
                    }`}
                  >
                    Home
                  </Link>

                  <Link
                    to="/employer/dashboard"
                    className={`relative pb-1 transition duration-150 ${
                      isActive("/employer/dashboard")
                        ? 'font-semibold text-[#4F46E5] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5]'
                        : "text-gray-600 dark:text-gray-300 hover:text-[#4F46E5]"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/employer/transactions"
                    className={`relative pb-1 transition duration-150 ${
                      isActive("/employer/transactions")
                        ? 'font-semibold text-[#4F46E5] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5]'
                        : "text-gray-600 dark:text-gray-300 hover:text-[#4F46E5]"
                    }`}
                  >
                    Transactions
                  </Link>
                </div>
              )}

              {user.role === "candidate" && (
                <Link
                  to="/candidate/dashboard"
                  className={`relative pb-1 transition duration-150 ${
                    isActive("/candidate/dashboard")
                      ? 'font-semibold text-[#4F46E5] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5]'
                      : "text-gray-600 dark:text-gray-300 hover:text-[#4F46E5]"
                  }`}
                >
                  Applications
                </Link>
              )}
            </div>
          )}

          {!user && (
            <>
              <Link
                to="/auth/login"
                className={`relative pb-1 transition duration-150 ${
                  isActive("/auth/login")
                    ? 'font-semibold text-[#4F46E5] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5]'
                    : "text-gray-600 dark:text-gray-300 hover:text-[#4F46E5]"
                }`}
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className={`relative pb-1 transition duration-150 ${
                  isActive("/auth/register")
                    ? 'font-semibold text-[#4F46E5] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4F46E5]'
                    : "text-gray-600 dark:text-gray-300 hover:text-[#4F46E5]"
                }`}
              >
                Register
              </Link>
            </>
          )}

          {user && <UserDropdown user={user} logout={logout} />}
        </div>
      </div>
    </nav>
  );
}
