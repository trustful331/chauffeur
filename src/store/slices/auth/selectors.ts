import type { RootState } from "../../index";
import type { AuthUser } from "./types";

export const selectAuthToken = (state: RootState) => state.auth.token;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.token);

export const selectAuthDisplayName = (state: RootState) => {
  const user = state.auth.user;
  if (user && typeof user === "object") {
    const authUser = user as AuthUser;
    return authUser.full_name || authUser.email || "Account";
  }
  return "";
};
