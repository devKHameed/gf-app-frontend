import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuthenticate from "queries/auth/useAuthenticate";
import { getLocalStorage } from "utils";

const SecureLayout = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const token = getLocalStorage("token",false);
  const location = useLocation();

  const { status } = useAuthenticate();

  //const loading = isLoading;

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return token && status !== "error" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default SecureLayout;
