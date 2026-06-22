import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession } from "src/api/auth";
import type { AuthState } from "./types";

const initialState: AuthState = {
  user: "",
  token: "",
  currentRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.currentRole = action.payload.user.currentRole;
    },
    clearSession: () => initialState,
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
