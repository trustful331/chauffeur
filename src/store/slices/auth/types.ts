export type AuthUser = {
  id: number;
  full_name: string;
  email: string;
  currentRole: string;
  phone_number?: string;
};

export type AuthState = {
  token: string;
  user: AuthUser | "";
  currentRole: string | null;
};
