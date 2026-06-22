export interface CreateBookingParams {
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
}

export interface BookingLocation {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface ApiBookingEnvelope {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

export const BOOKING_SERVICE_TYPE_MAP = {
  "Airport Transfer": "airport_transfer",
  "A to B Transfer": "a_to_b_transfer",
  "Hourly Service": "hourly_service",
  "Daily Service": "daily_service",
} as const;

export type BookingServiceTab = keyof typeof BOOKING_SERVICE_TYPE_MAP;
