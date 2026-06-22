import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "src/store/slices/auth/selectors";
import { useAppSelector } from "src/store/hooks";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}
