import { postRequest } from "src/config/axios";
import type { ApiBookingEnvelope, CreateBookingParams } from "./types";

function getBookingErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  const data = axiosError?.response?.data;
  return data?.message || data?.error || axiosError?.message || fallback;
}

export function createBookingAsync(params: CreateBookingParams) {
  return async (): Promise<ApiBookingEnvelope> => {
    try {
      const result = (await postRequest(
        "booking/create",
        JSON.stringify(params),
      )) as ApiBookingEnvelope;

      if (result.success === false) {
        throw new Error(result.message || "Booking failed");
      }

      return result;
    } catch (error: unknown) {
      throw new Error(getBookingErrorMessage(error, "Booking failed"), {
        cause: error,
      });
    }
  };
}
