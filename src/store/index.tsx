import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { Action } from "@reduxjs/toolkit";
// slices
import AuthSlice from "./slices/auth/index";
import type { AuthState } from "./slices/auth/types";

const defaultAuthState: AuthState = {
  user: "",
  token: "",
  currentRole: null,
};

type PreloadedRootState = {
  auth?: AuthState;
};

const loadState = (): PreloadedRootState | undefined => {
  try {
    const serializedState = localStorage.getItem("state");
    const parsed = serializedState
      ? (JSON.parse(serializedState) as PreloadedRootState)
      : undefined;
    const storageToken = localStorage.getItem("STORAGE_TOKEN");

    if (!parsed && !storageToken) {
      return undefined;
    }

    const auth: AuthState = {
      ...defaultAuthState,
      ...parsed?.auth,
      token: parsed?.auth?.token || storageToken || "",
    };

    return {
      ...parsed,
      auth,
    };
  } catch {
    const storageToken = localStorage.getItem("STORAGE_TOKEN");
    if (!storageToken) {
      return undefined;
    }

    return {
      auth: {
        ...defaultAuthState,
        token: storageToken,
      },
    };
  }
};

const peristedState = loadState();

const combinedReducers = combineReducers({
  auth: AuthSlice,
});

// Infer RootState from combined reducers
export type RootState = ReturnType<typeof combinedReducers>;

const rootReducer = (state: RootState | undefined, action: Action) => {
  if (action.type === "signout/logout") {
    localStorage.removeItem("state");
    localStorage.removeItem("STORAGE_TOKEN");
    return combinedReducers(undefined, action);
  }
  return combinedReducers(state, action);
};

export const store = configureStore({
  preloadedState: peristedState as RootState | undefined,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

setupListeners(store.dispatch);

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    console.log("Store Error -->", e);
  }
};

store.subscribe(() => {
  saveState(store.getState());
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

export default store;
