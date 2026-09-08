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
  fleet_name?: string;
  fleet?: { vehicle_name?: string; category?: string;[key: string]: unknown };
  date_and_time?: string;
  pickup_date?: string;
  pickup_time?: string;
  passengers_count: number;
  children_count: number;
  booking_status?: string;
  payment_method?: string;
  payment_status?: string;
  user_email?: string;
  amount?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
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

const LOCAL_STORAGE_BOOKINGS_KEY = "maseer_local_bookings";

export function saveLocalBooking(booking: Partial<BookingItem> & Record<string, unknown>) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    const existing: BookingItem[] = raw ? JSON.parse(raw) : [];

    const fleetName =
      (booking.fleet_name as string) ||
      (booking.fleet as any)?.vehicle_name ||
      (booking.fleetClass as string) ||
      "Luxury Chauffeur";

    const normalized: BookingItem = {
      id: (booking.id as string) || `booking_${Date.now()}`,
      service_type: (booking.service_type as string) || "airport_transfer",
      pickup_location: (booking.pickup_location as string) || "",
      dropoff_location: (booking.dropoff_location as string) || "",
      fleet_name: fleetName,
      date_and_time:
        (booking.date_and_time as string) ||
        (booking.pickup_date
          ? `${booking.pickup_date} ${booking.pickup_time || ""}`.trim()
          : new Date().toISOString()),
      pickup_date: (booking.pickup_date as string) || "",
      pickup_time: (booking.pickup_time as string) || "",
      passengers_count: Number(booking.passengers_count || 1),
      children_count: Number(booking.children_count || 0),
      booking_status: (booking.booking_status as string) || "confirmed",
      payment_status: (booking.payment_status as string) || "paid",
      payment_method: (booking.payment_method as string) || "card",
      user_email: (booking.passenger_email as string) || (booking.user_email as string) || "",
      amount: Number(booking.amount || 25),
      created_at: (booking.created_at as string) || new Date().toISOString(),
    };

    const filtered = existing.filter((item) => item.id !== normalized.id);
    const updated = [normalized, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn("Failed to save local booking cache:", e);
  }
}

export function getBookingFleetName(item: BookingItem): string {
  if (item.fleet_name && item.fleet_name.trim().length > 0) {
    return item.fleet_name;
  }
  if (item.fleet?.vehicle_name) {
    return item.fleet.vehicle_name;
  }
  if (item.fleet?.category) {
    return item.fleet.category;
  }
  return "Luxury Chauffeur";
}

export function getBookingTimestamp(item: BookingItem): number {
  const raw =
    item.created_at ||
    item.date_and_time ||
    (item.pickup_date ? `${item.pickup_date}T${item.pickup_time || "00:00"}` : null);

  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function formatBookingDate(item: BookingItem): string {
  const raw =
    item.date_and_time ||
    item.created_at ||
    (item.pickup_date ? `${item.pickup_date} ${item.pickup_time || ""}`.trim() : null);

  if (!raw) return "N/A";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function parseBookingList(res: any): BookingItem[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.bookings)) return res.bookings;
  if (Array.isArray(res.data?.bookings)) return res.data.bookings;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
}

export async function fetchBookings(status = "all"): Promise<BookingResponse> {
  let apiBookings: BookingItem[] = [];
  let apiError: string | null = null;

  try {
    // 1. First attempt: backend endpoint with ?status=all (or requested status)
    const endpoint = status ? `booking/get?status=${status}` : "booking/get";
    const response = await apiGet<any>(endpoint);
    const list = parseBookingList(response);
    if (list.length > 0) {
      apiBookings = list;
    } else {
      // Fallback: try plain booking/get if status parameter returned empty
      const fallback = await apiGet<any>("booking/get");
      apiBookings = parseBookingList(fallback);
    }
  } catch (error: any) {
    console.warn("Failed to fetch remote bookings with query:", error);
    apiError = error?.response?.data?.message || error?.message || null;

    // Secondary fallback: plain booking/get
    try {
      const fallback = await apiGet<any>("booking/get");
      apiBookings = parseBookingList(fallback);
    } catch {
      // Ignore secondary fallback error
    }
  }

  let localBookings: BookingItem[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (raw) {
      localBookings = JSON.parse(raw);
    }
  } catch (e) {
    // Ignore local storage error
  }

  const mergedMap = new Map<string, BookingItem>();
  for (const item of [...apiBookings, ...localBookings]) {
    if (item && item.id) {
      if (!mergedMap.has(item.id)) {
        mergedMap.set(item.id, item);
      }
    }
  }

  const merged = Array.from(mergedMap.values());
  return {
    success: true,
    count: merged.length,
    data: merged,
    message: apiError || undefined,
  };
}

export async function fetchBookingById(id: string) {
  try {
    const response = await apiGet<SingleBookingResponse>(`booking/${id}`);
    return response;
  } catch (error) {
    // Fallback to local storage if API fails
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      if (raw) {
        const localList: BookingItem[] = JSON.parse(raw);
        const match = localList.find((b) => b.id === id);
        if (match) {
          return { success: true, data: match };
        }
      }
    } catch (e) {
      // Ignore
    }
    throw new Error(getErrorMessage(error, "Failed to fetch booking details"), { cause: error });
  }
}

export async function deleteBooking(id: string) {
  try {
    // Also remove from local storage if present
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      if (raw) {
        const localList: BookingItem[] = JSON.parse(raw);
        const updated = localList.filter((b) => b.id !== id);
        localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      // Ignore
    }

    const response = await apiDelete<{ success: boolean; message?: string }>(`booking/${id}`);
    return response;
  } catch (error) {
    // If backend delete failed but local item was removed
    return { success: true, message: "Booking removed from local state." };
  }
}
