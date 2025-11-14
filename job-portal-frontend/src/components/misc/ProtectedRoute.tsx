import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: any;
  role?: "candidate" | "employer";
}) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/auth/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}
