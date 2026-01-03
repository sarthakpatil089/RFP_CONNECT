import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface BuyerRouteProps {
  children: ReactNode;
}

export default function BuyerRoute({ children }: BuyerRouteProps) {
  const { isVendor } = useAuth();
  if (isVendor) {
    return <Navigate to="/buyers" replace />;
  }
  return <>{children}</>;
}
