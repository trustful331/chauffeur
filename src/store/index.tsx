import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice, { clearSession } from "./slices/auth/index";
import type { AuthState } from "./slices/auth/types";

const AUTH_STORAGE_KEY = "auth";

function loadAuthState(): AuthState | undefined {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as AuthState) : undefined;
  } catch {
    return undefined;
  }
}

const combinedReducers = combineReducers({
  auth: AuthSlice,
});

export type RootState = ReturnType<typeof combinedReducers>;

const rootReducer = (
  state: RootState | undefined,
  action: { type: string },
) => {
  if (action.type === clearSession.type) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return combinedReducers(undefined, action);
  }

  return combinedReducers(state, action);
};

export const store = configureStore({
  preloadedState: (() => {
    const auth = loadAuthState();
    return auth ? { auth } : undefined;
  })(),
  reducer: rootReducer,
});

store.subscribe(() => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(store.getState().auth));
  } catch {
    // Ignore storage errors.
  }
});

export type AppDispatch = typeof store.dispatch;
export default store;
