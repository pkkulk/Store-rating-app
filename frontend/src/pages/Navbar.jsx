import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaRegUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "owner"
      ? "/owner"
      : "/user";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        🏪 Store Rating App
      </Link>

      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaRegUserCircle size={34} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white text-black rounded-lg shadow-lg z-50">
                {(user.role === "admin" || user.role === "owner") && (
                  <Link
                    to={dashboardLink}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                )}

                {(user.role === "user" || user.role === "owner") && (
                  <Link
                    to="/stores"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add Store
                  </Link>
                )}

                <Link
                  to="/update-password"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Update Password
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
