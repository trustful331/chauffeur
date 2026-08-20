export type AuthUser = {
  id: number | string;
  full_name: string;
  email: string;
  currentRole: string;
  phone_number?: string;
  profile_image_url?: string;
};

export type AuthState = {
  token: string;
  user: AuthUser | "";
  currentRole: string | null;
};
