import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const user = localStorage.getItem("auth");

  const lastVisited = localStorage.getItem("lastVisited")  ;

  if (user) {
    return <Navigate to={lastVisited!} replace />;
  }

  return <>{children}</>;
}
