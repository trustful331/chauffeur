import { apiGet, apiPost, apiPut, getErrorMessage } from "src/config/axios";
import { fetchFleets } from "./admin/fleet";
import { type BookingItem, type BookingResponse } from "./admin/booking";

export type CreateBookingParams = {
  service_type: string;
  fleet_id: string;
  pickup_location: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_location: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  pickup_date: string; // YYYY-MM-DD
  pickup_time: string; // HH:MM
  dropoff_date?: string; // YYYY-MM-DD
  dropoff_time?: string; // HH:MM
  passengers_count: number;
  children_count: number;
  hours?: number | null;
  passenger_name: string;
  passenger_email: string;
  phone_number: string;
  payment_method: string; // e.g., "card"
  special_requests?: string;
  addons?: string[];
  amount: number;
  currency: string; // "KWD"
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
  data?: {
    id: string;
    amount: number;
    currency: string;
    payment_status: string;
    booking_status: string;
    [key: string]: unknown;
  };
};

export async function createBooking(params: CreateBookingParams) {
  try {
    const result = await apiPost<BookingApiResponse>("booking/create", params);

    if (result.success === false) {
      throw new Error(result.message || "Booking failed");
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Booking failed"), { cause: error });
  }
}

/**
 * Fetch bookings for user with status tab (upcoming | history | inprogress | cancelled | completed | all) and date filters (from, to).
 */
export async function fetchUserBookings(query?: {
  status?: "upcoming" | "history" | "inprogress" | "cancelled" | "completed" | "all" | string;
  from?: string;
  to?: string;
}): Promise<BookingItem[]> {
  try {
    const searchParams = new URLSearchParams();
    if (query?.status) searchParams.append("status", query.status);
    if (query?.from) searchParams.append("from", query.from);
    if (query?.to) searchParams.append("to", query.to);

    const queryString = searchParams.toString();
    const endpoint = `booking/get${queryString ? `?${queryString}` : ""}`;

    const response = await apiGet<BookingResponse>(endpoint);

    if (response && response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.warn("Failed to fetch user bookings via status query:", error);
    return [];
  }
}

/**
 * Update status of a booking (allowed: upcoming, inprogress, cancelled, completed)
 */
export async function updateBookingStatus(
  bookingId: string,
  status: "upcoming" | "inprogress" | "cancelled" | "completed" | string
) {
  try {
    const result = await apiPut<{ success: boolean; message?: string; data?: BookingItem }>(
      `booking/${bookingId}/status`,
      { status }
    );
    if (result.success === false) {
      throw new Error(result.message || "Failed to update booking status");
    }
    return result;
  } catch (error) {
    // Try shortcut cancel endpoint if status is cancelled
    if (status === "cancelled" || status === "cancel") {
      return cancelBooking(bookingId);
    }
    throw new Error(getErrorMessage(error, "Failed to update booking status"), { cause: error });
  }
}

/**
 * Shortcut to cancel booking
 */
export async function cancelBooking(bookingId: string) {
  try {
    const result = await apiPut<{ success: boolean; message?: string; data?: BookingItem }>(
      `booking/${bookingId}/cancel`
    );
    if (result.success === false) {
      throw new Error(result.message || "Failed to cancel booking");
    }
    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to cancel booking"), { cause: error });
  }
}

/**
 * Resolves the database ID of an active fleet vehicle matching the given category name.
 */
export async function getFleetIdForCategory(categoryName: string): Promise<string> {
  try {
    const response = await responseDataToFleets();
    if (response && response.length > 0) {
      let backendCategory = "economy_class";
      if (categoryName === "Green Class") backendCategory = "green_class";
      else if (categoryName === "Ultra Luxury") backendCategory = "ultra_luxury";
      else if (categoryName === "Business Van") backendCategory = "business_van";
      else if (categoryName === "VIP / Business Class") backendCategory = "vip_business_class";

      const matched = response.find((item) => item.category === backendCategory);
      if (matched) {
        return matched.id;
      }
    }
  } catch (error) {
    console.error("Failed to map category to dynamic fleet_id, using fallback:", error);
  }

  // Fallbacks: Map static names to standard IDs
  const fallbackMap: Record<string, string> = {
    "Economy Class": "lexus-es",
    "VIP / Business Class": "mercedes-s",
    "Ultra Luxury": "cadillac-escalade",
    "Green Class": "bmw-7",
    "Business Van": "mercedes-v",
  };
  return fallbackMap[categoryName] || "mercedes-s";
}

async function responseDataToFleets() {
  try {
    const response = await fetchFleets({ is_active: true });
    if (response && response.success && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (e) {
    // Ignore error
  }
  return [];
}

