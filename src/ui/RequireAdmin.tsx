import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "src/store/hooks";
import { selectIsAuthenticated, selectAuthUser } from "src/store/slices/auth/selectors";
import type { AuthUser } from "src/store/slices/auth/types";

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser) as AuthUser | "";

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  const role = user ? user.currentRole : "";
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
