import { apiPost, getErrorMessage } from "src/config/axios";
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
      id: Number(raw.id ?? 0),
      full_name: String(raw.full_name ?? raw.name ?? "User"),
      email: String(raw.email ?? email),
      currentRole: String(raw.role ?? raw.currentRole ?? "customer"),
      phone_number: raw.phone_number as string | undefined,
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

export async function verifyOtp(email: string, otp: string): Promise<void> {
  try {
    const result = await apiPost<SimpleResponse>("auth/verify-otp", {
      email,
      otp,
    });
    if (result.success === false) {
      throw new Error(result.message || "OTP verification failed");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error, "OTP verification failed"), {
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
    const result = await apiPost<SimpleResponse>("auth/reset-password", {
      email,
      otp,
      new_password,
    });
    if (result.success === false) {
      throw new Error(result.message || "Password reset failed");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error, "Password reset failed"), {
      cause: error,
    });
  }
}
