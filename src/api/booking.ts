import { apiPost, getErrorMessage } from "src/config/axios";

export type CreateBookingParams = {
  service_type: string;
  pick_up_location: string;
  drop_off_location: string;
  pick_up_latitude: number;
  pick_up_longitude: number;
  drop_off_latitude: number;
  drop_off_longitude: number;
  class: string;
  date_and_time: string;
  passengers: number;
  childs: number;
};

export type BookingLocation = {
  address: string;
  latitude: number | null;
  longitude: number | null;
};

export const BOOKING_SERVICE_TYPE_MAP = {
  "Airport Transfer": "airport_transfer",
  "A to B Transfer": "a_to_b_transfer",
  "Hourly Service": "hourly_service",
  "Daily Service": "daily_service",
} as const;

export type BookingServiceTab = keyof typeof BOOKING_SERVICE_TYPE_MAP;

type BookingApiResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
};

export async function createBooking(params: CreateBookingParams) {
  try {
    const result = await apiPost<BookingApiResponse>("booking/create", params);

    if (result.success === false) {
      throw new Error(result.message || "Booking failed");
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Booking failed"));
  }
}
