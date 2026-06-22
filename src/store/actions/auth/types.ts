// Auth Action Types and Interfaces

export interface LoginParams {
  email: string;
  password: string;
  is_remembered?: string;
}

export interface SignUpParams {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface ApiAuthEnvelope {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    access_token?: string;
    user?: Record<string, unknown>;
  };
}

export interface AuthSession {
  token: string;
  user: import("src/store/slices/auth/types").AuthUser;
}

export interface LoginResponse {
  success?: boolean;
  token: string;
  user?: Record<string, unknown>;
  data?: {
    token: string;
    user?: Record<string, unknown>;
  };
  [key: string]: unknown;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  phone?: string;
  company?: string;
  [key: string]: unknown;
}

export interface AuthState {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignInAsyncAction {
  type: string;
  payload: LoginParams;
}

export interface SetTokenAction {
  type: string;
  payload: string;
}

export interface SetUserAction {
  type: string;
  payload: UserInfo;
}

export interface ClearAuthAction {
  type: string;
}

// Redux Thunk Return Types
export type SignInAsyncThunk = (
  params: LoginParams
) => Promise<LoginResponse>;

export type AuthDispatch = (action: unknown) => void;
export type AuthGetState = () => unknown;

// Error Types
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
  success?: boolean;
}