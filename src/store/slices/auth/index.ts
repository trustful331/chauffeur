import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "./types";

const initialState: AuthState = {
  user: "",
  token: "",
  currentRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.currentRole = action.payload; // Role save karlo
    },
  },
});

export const setUser = authSlice.actions.setUser;
export const setToken = authSlice.actions.setToken;
export const setRole = authSlice.actions.setRole;

const AuthSlice = authSlice.reducer;
export default AuthSlice;
