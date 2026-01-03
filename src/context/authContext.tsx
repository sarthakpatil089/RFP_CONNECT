import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isVendor: boolean;
  userId: string | null;
  setVendor: (isVendor: boolean) => void;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("auth_token");
  });
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("id")
  );
  const [isVendor, setIsVendor] = useState(true);
  useEffect(() => {
    const role = localStorage.getItem("auth_role");
    setIsVendor(role === "VENDOR");
    setUserId(localStorage.getItem("id"));
  }, []);
  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("id");
    localStorage.removeItem("auth_role");
    setUserId(null);
    setIsLoggedIn(false);
  };
  const setVendor = (isVendor: boolean) => {
    setIsVendor(isVendor);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, setVendor, isVendor, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
