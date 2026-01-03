import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface VendorRouteProps {
  children: ReactNode;
}

export default function VendorRoute({ children }: VendorRouteProps) {
  const { isVendor } = useAuth();
  if (!isVendor) {
    return <Navigate to="/vendors" replace />;
  }
  return <>{children}</>;
}
