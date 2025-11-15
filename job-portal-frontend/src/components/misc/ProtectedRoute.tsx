import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate} from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: any;
  role?: "candidate" | "employer";
}) {
  const { user, loading } = useContext(AuthContext);
 
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" />;
  if (role && user.role !== role) {
    return (
      <Navigate
        to={
          user.role === "employer"
            ? "/employer/dashboard"
            : "/candidate/dashboard"
        }
        replace
      />
    );
  }
  // localStorage.setItem("lastVisited", location.pathname);
  if (role && user.role == 'employer') {
    localStorage.setItem("lastVisited", "/");
  } else if (role && user.role == 'candidate') {
    localStorage.setItem("lastVisited", "/");

  }

  return children;
}
