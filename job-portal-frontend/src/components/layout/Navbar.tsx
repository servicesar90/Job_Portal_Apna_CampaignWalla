import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { dark, toggle } = useContext(ThemeContext);

  return (
    <nav className="shadow bg-white dark:bg-gray-900 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between p-4">
        <Link to="/" className="font-bold text-xl">
          JobPortal
        </Link>

        <div className="flex items-center gap-4">
          <button onClick={toggle}>{dark ? "Light" : "Dark"}</button>

          {!user && (
            <>
              <Link to="/auth/login">Login</Link>
              <Link to="/auth/register">Register</Link>
            </>
          )}

          {user && (
            <>
              {user.role === "employer" && (
                <Link to="/employer/dashboard">Dashboard</Link>
              )}
              {user.role === "candidate" && (
                <Link to="/candidate/dashboard">Applications</Link>
              )}
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
