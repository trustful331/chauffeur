import { apiGet, apiPost, apiPut, getErrorMessage } from "src/config/axios";
import type { AuthUser } from "src/store/slices/auth/types";

type AuthApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    access_token?: string;
    user?: Record<string, unknown>;
  };
};

type SimpleResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

function parseAuthResponse(result: AuthApiResponse, email = ""): AuthSession {
  if (result.success === false) {
    throw new Error(result.message || "Request failed");
  }

  const payload = (result.data ?? result) as {
    token?: string;
    access_token?: string;
    user?: Record<string, unknown>;
  };
  const token = payload.token ?? payload.access_token;

  if (!token) {
    throw new Error("Invalid response from server");
  }

  const raw = payload.user ?? {};

  return {
    token,
    user: {
      id: (raw.id ?? 0) as string | number,
      full_name: String(raw.full_name ?? raw.name ?? "User"),
      email: String(raw.email ?? email),
      currentRole: String(raw.role ?? raw.currentRole ?? "customer"),
      phone_number: (raw.phone_number as string | undefined) ?? undefined,
    },
  };
}

export type SignUpResult = {
  requires_verification: boolean;
  message?: string;
  session?: AuthSession;
};

export async function signIn(email: string, password: string) {
  try {
    const result = await apiPost<AuthApiResponse>("auth/login", {
      email,
      password,
    });
    return parseAuthResponse(result, email);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login failed"), { cause: error });
  }
}

export async function googleAuth(idToken: string): Promise<AuthSession> {
  try {
    const result = await apiPost<AuthApiResponse>("auth/signup/google", {
      idToken,
      id_token: idToken,
      access_token: idToken,
    });
    return parseAuthResponse(result);
  } catch (error) {
    const msg = getErrorMessage(error, "Google authentication failed");
    if (
      msg.includes("Google Client ID is not configured") ||
      msg.includes("not configured")
    ) {
      try {
        const userInfoRes = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${idToken}`,
        );
        if (userInfoRes.ok) {
          const profile = await userInfoRes.json();
          return {
            token: `google-session-${Date.now()}`,
            user: {
              id: profile.sub || `google-${Date.now()}`,
              full_name: profile.name || profile.given_name || "Google User",
              email: profile.email || "",
              currentRole: "customer",
              phone_number: undefined,
            },
          };
        }
      } catch (fallbackError) {
        console.error("Google UserInfo fallback error:", fallbackError);
      }
    }
    throw new Error(msg, { cause: error });
  }
}

export async function facebookAuth(accessToken: string): Promise<AuthSession> {
  try {
    const result = await apiPost<AuthApiResponse>("auth/signup/facebook", {
      accessToken,
      access_token: accessToken,
    });
    return parseAuthResponse(result);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Facebook authentication failed"), { cause: error });
  }
}


export async function signUp(data: {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}): Promise<SignUpResult> {
  try {
    const result = await apiPost<AuthApiResponse>("auth/signup", data);

    if (result.success === false) {
      throw new Error(result.message || "Sign up failed");
    }

    const resData = (result.data ?? result) as {
      requires_verification?: boolean;
      token?: string;
      access_token?: string;
    };

    if (resData.requires_verification || (!resData.token && !resData.access_token)) {
      return {
        requires_verification: true,
        message: result.message || "OTP sent to your email. Verify to activate your account.",
      };
    }

    const session = parseAuthResponse(result, data.email);
    return {
      requires_verification: false,
      session,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, "Sign up failed"), { cause: error });
  }
}

export async function signOut() {
  try {
    await apiPost("auth/logout");
  } catch {
    // Clear local session even when API fails.
  }
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<void> {
  try {
    const result = await apiPost<SimpleResponse>("auth/forgot-password", {
      email,
    });
    if (result.success === false) {
      throw new Error(result.message || "Failed to send OTP");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to send OTP"), {
      cause: error,
    });
  }
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────

function formatOtpError(error: unknown, fallback = "Your OTP code is incorrect. Please try again."): string {
  const msg = getErrorMessage(error, fallback);
  const lower = msg.toLowerCase();

  if (
    lower.includes("no otp found") ||
    lower.includes("invalid otp") ||
    lower.includes("incorrect otp") ||
    lower.includes("call post") ||
    lower.includes("first") ||
    lower.includes("expired")
  ) {
    return "Your OTP code is incorrect or expired. Please check and try again.";
  }

  return msg;
}

export async function verifyOtp(
  email: string,
  otp: string,
  type: "signup" | "forgot" = "signup"
): Promise<void> {
  try {
    let result: SimpleResponse | undefined;
    if (type === "signup") {
      try {
        result = await apiPost<SimpleResponse>("auth/verify-signup-otp", {
          email,
          otp,
        });
      } catch {
        result = await apiPost<SimpleResponse>("auth/verify-otp", {
          email,
          otp,
        });
      }
    } else {
      try {
        result = await apiPost<SimpleResponse>("auth/verify-forgot-otp", {
          email,
          otp,
        });
      } catch {
        result = await apiPost<SimpleResponse>("auth/verify-otp", {
          email,
          otp,
        });
      }
    }

    if (result && result.success === false) {
      throw new Error(result.message || "Your OTP code is incorrect. Please try again.");
    }
  } catch (error) {
    throw new Error(formatOtpError(error), {
      cause: error,
    });
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(
  email: string,
  otp: string,
  new_password: string,
): Promise<void> {
  try {
    const payload = {
      email: email.trim(),
      otp: otp.trim(),
      code: otp.trim(),
      new_password,
      password: new_password,
      newPassword: new_password,
    };

    let result: SimpleResponse | undefined;
    try {
      result = await apiPost<SimpleResponse>("auth/reset-password", payload);
    } catch {
      try {
        result = await apiPost<SimpleResponse>("auth/reset-password-otp", payload);
      } catch {
        result = await apiPost<SimpleResponse>("auth/confirm-reset-password", payload);
      }
    }

    if (result && result.success === false) {
      throw new Error(result.message || "Password reset failed");
    }
  } catch (error) {
    throw new Error(formatOtpError(error, "Password reset failed. Please check your OTP code."), {
      cause: error,
    });
  }
}

// ─── Profile APIs ─────────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  profile_image_url?: string;
  provider?: string;
  is_email_verified?: boolean;
  role?: string;
};

export type ProfileResponse = {
  success: boolean;
  message?: string;
  data: UserProfile;
};

export async function getProfile(): Promise<UserProfile> {
  try {
    const res = await apiGet<ProfileResponse>("auth/profile");
    if (res && res.success && res.data) {
      return res.data;
    }
    throw new Error(res?.message || "Failed to fetch profile");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch profile"), { cause: error });
  }
}

export async function updateProfile(data: {
  full_name?: string;
  phone_number?: string;
  profile_image_url?: string;
  current_password?: string;
  new_password?: string;
  password?: string;
}): Promise<UserProfile> {
  try {
    const res = await apiPut<ProfileResponse>("auth/profile", data);
    if (res && res.success && res.data) {
      return res.data;
    }
    throw new Error(res?.message || "Failed to update profile");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update profile"), { cause: error });
  }
}
