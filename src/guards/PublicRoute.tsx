import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isVendor, userId } = useAuth();
  const [loader, setLoader] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (userId) {
      const timer = setTimeout(() => {
        setLoader(false);
        setShouldRedirect(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setLoader(false);
    }
  }, [userId]);

  if (shouldRedirect) {
    if (isVendor) return <Navigate to="/buyers" replace />;
    else return <Navigate to="/vendors" replace />;
  }
  
  if (loader) return <div><LoadingSpinner/></div>;
  
  return <>{children}</>;
}
