import { createContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken } from "../utils/storage";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "candidate" | "employer";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loginUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(getToken());

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setTokenState(parsed.token);
    }
  }, []);

  const loginUser = (u: User, t: string) => {
    setUser(u);
    setTokenState(t);
    setToken(t);
    localStorage.setItem("auth", JSON.stringify({ user: u, token: t }));
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    clearToken();
    localStorage.removeItem("auth");
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, token: tokenState, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
