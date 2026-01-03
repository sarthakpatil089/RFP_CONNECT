import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoggedIn, userId } = useAuth();
  const [loader, setLoader] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoader(false);
    } else {
      const timer = setTimeout(() => {
        setLoader(false);
        setShouldRedirect(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  if (shouldRedirect) return <Navigate to="/login" replace />;
  if (loader)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (isLoggedIn) return <>{children}</>;

  return null;
}
