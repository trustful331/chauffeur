import { apiGet, apiDelete, getErrorMessage } from "src/config/axios";

export type BookingItem = {
  id: string;
  service_type: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  dropoff_latitude?: number | null;
  dropoff_longitude?: number | null;
  fleet_name: string;
  date_and_time: string;
  passengers_count: number;
  children_count: number;
  booking_status?: string;
  payment_method?: string;
  payment_status?: string;
  user_email?: string;
  created_at?: string;
  updated_at?: string;
};

export type BookingResponse = {
  success: boolean;
  count?: number;
  message?: string;
  data: BookingItem[];
};

export type SingleBookingResponse = {
  success: boolean;
  message?: string;
  data: BookingItem;
};

export async function fetchBookings() {
  try {
    const response = await apiGet<BookingResponse>("booking/get");
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch bookings"), { cause: error });
  }
}

export async function fetchBookingById(id: string) {
  try {
    const response = await apiGet<SingleBookingResponse>(`booking/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch booking details"), { cause: error });
  }
}

export async function deleteBooking(id: string) {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`booking/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete booking"), { cause: error });
  }
}
