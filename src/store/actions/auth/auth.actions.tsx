import { postRequest } from "src/config/axios";
import { setToken, setUser, setRole } from "src/store/slices/auth";
import type { AuthUser } from "src/store/slices/auth/types";
import type { AppDispatch } from "src/store";
import type {
  ApiAuthEnvelope,
  AuthSession,
  LoginParams,
  LoginResponse,
  SignUpParams,
} from "./types";
import { clearEmptyStatesLogout } from "../empty/empty.actions";

function getAxiosErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  const data = axiosError?.response?.data;
  return data?.message || data?.error || axiosError?.message || fallback;
}

function normalizeApiUser(
  raw: Record<string, unknown> | undefined,
  fallbackEmail = "",
): AuthUser {
  return {
    id: Number(raw?.id ?? 0),
    full_name: String(raw?.full_name ?? raw?.name ?? "Maseer User"),
    username: String(raw?.username ?? fallbackEmail.split("@")[0] ?? "user"),
    email: String(raw?.email ?? fallbackEmail),
    trade_name: null,
    profile_status: null,
    data_completness_status: null,
    currentRole: String(raw?.role ?? raw?.currentRole ?? "customer"),
    phone_number: raw?.phone_number as string | undefined,
    provider: raw?.provider as string | undefined,
  };
}

function extractAuthSession(
  result: unknown,
  fallbackEmail = "",
): AuthSession | null {
  const envelope = result as ApiAuthEnvelope;

  if (envelope.success === false) {
    throw new Error(envelope.message || "Request failed");
  }

  const data = (envelope.data ?? envelope) as {
    token?: string;
    access_token?: string;
    user?: Record<string, unknown>;
  };

  const token = data.token ?? data.access_token ?? "";
  if (!token) {
    return null;
  }

  const user = normalizeApiUser(data.user, fallbackEmail);

  return { token, user };
}

function applyAuthSession(dispatch: AppDispatch, session: AuthSession) {
  dispatch(setToken(session.token));
  localStorage.setItem("STORAGE_TOKEN", session.token);
  dispatch(setUser(session.user));

  const role = session.user.currentRole ?? session.user.role;
  if (role) {
    dispatch(setRole(String(role)));
  }
}

function toLoginResponse(session: AuthSession): LoginResponse {
  return {
    success: true,
    token: session.token,
    user: session.user,
    data: {
      token: session.token,
      user: session.user,
    },
  };
}

export function signInAsync(params: LoginParams) {
  return async (dispatch: AppDispatch): Promise<LoginResponse> => {
    try {
      const result = (await postRequest(
        "auth/login",
        JSON.stringify({
          email: params.email,
          password: params.password,
        }),
      )) as ApiAuthEnvelope;

      const session = extractAuthSession(result, params.email);
      if (!session) {
        throw new Error("Invalid login response from server.");
      }

      applyAuthSession(dispatch, session);
      return toLoginResponse(session);
    } catch (error: unknown) {
      throw new Error(getAxiosErrorMessage(error, "Login failed"), {
        cause: error,
      });
    }
  };
}

export function signUpAsync(params: SignUpParams) {
  return async (dispatch: AppDispatch): Promise<LoginResponse> => {
    try {
      const result = (await postRequest(
        "auth/signup",
        JSON.stringify({
          full_name: params.full_name,
          email: params.email,
          password: params.password,
          phone_number: params.phone_number,
        }),
      )) as ApiAuthEnvelope;

      const session = extractAuthSession(result, params.email);
      if (!session) {
        throw new Error("Account created but no session was returned. Please sign in.");
      }

      applyAuthSession(dispatch, session);
      return toLoginResponse(session);
    } catch (error: unknown) {
      throw new Error(getAxiosErrorMessage(error, "Sign up failed"), {
        cause: error,
      });
    }
  };
}

export function logoutAsync() {
  return async (dispatch: AppDispatch) => {
    try {
      await postRequest("auth/logout", JSON.stringify({}));
    } catch {
      // Clear local session even when API logout fails.
    } finally {
      dispatch(clearEmptyStatesLogout());
    }
  };
}
