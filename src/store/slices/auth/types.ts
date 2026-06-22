/**
 * Auth User object structure
 * Based on API response from sign-in/sign-up
 */
export interface AuthUser {
  id: number;
  full_name: string;
  username: string;
  email: string;
  trade_name: string | null;
  profile_status: string | null;
  data_completness_status: string | null;
  currentRole: string;
  token?: string;
  phone_number?: string;
  provider?: string;
  [key: string]: unknown; // Allow for additional properties
}

/**
 * Auth State interface
 */
export interface AuthState {
  token: string;
  user: AuthUser | "";
  currentRole: string | null;
}
