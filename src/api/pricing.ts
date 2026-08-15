import { apiGet, apiPost, apiPut, apiDelete, getErrorMessage } from "src/config/axios";

export type QuoteMode = "hourly" | "fixed" | "long_distance";
export type QuoteStatus = "priced" | "awaiting_admin" | "expired" | "cancelled";

export type QuoteRequestParams =
  | {
      fleet_id: string;
      hours: number;
      pricing_type: "hourly";
    }
  | {
      fleet_id: string;
      distance_km?: number;
      pickup_latitude: number;
      pickup_longitude: number;
      dropoff_latitude: number;
      dropoff_longitude: number;
      pickup_location: string;
      dropoff_location: string;
    };

export type QuoteData = {
  pricing_mode: QuoteMode;
  status: QuoteStatus;
  requires_admin_price: boolean;
  fleet_id: string;
  hours?: number | null;
  price_per_hour?: number | null;
  amount?: number | null;
  currency: string;
  distance_km?: number | null;
  quote_id?: string | null;
  expires_at?: string | null;
};

export type QuoteApiResponse = {
  success: boolean;
  message?: string;
  data: QuoteData;
};

export type QuoteStatusData = {
  id: string;
  status: QuoteStatus;
  amount?: number | null;
  fleet_id: string;
  distance_km?: number | null;
  currency: string;
  expires_at?: string | null;
};

export type QuoteStatusApiResponse = {
  success: boolean;
  message?: string;
  data: QuoteStatusData;
};

export type PendingQuoteUser = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
};

export type PendingQuoteItem = {
  id: string;
  status: QuoteStatus;
  distance_km: number;
  pickup_location: string;
  dropoff_location: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_latitude: number;
  dropoff_longitude: number;
  fleet_id: string;
  amount?: number | null;
  currency: string;
  expires_at?: string | null;
  user?: PendingQuoteUser;
};

export type PendingQuotesApiResponse = {
  success: boolean;
  count?: number;
  data: PendingQuoteItem[];
};

export type SetPriceParams = {
  amount: number;
  fleet_id: string;
  admin_note?: string;
};

export type SetPriceApiResponse = {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    status: QuoteStatus;
    amount: number;
    fleet_id: string;
    distance_km: number;
    currency: string;
    admin_note?: string;
    expires_at?: string;
  };
};

export type FleetInfo = {
  id: string;
  vehicle_name: string;
  vehicle_type: string;
  category: string;
};

export type FixedPriceItem = {
  id: string;
  fleet_id: string;
  fleet?: FleetInfo;
  price: number;
  currency: string;
  is_active: boolean;
};

export type FixedPricesResponse = {
  success: boolean;
  count?: number;
  data: FixedPriceItem[];
};

export type SingleFixedPriceResponse = {
  success: boolean;
  message?: string;
  data: FixedPriceItem;
};

export type HourlyPriceItem = {
  id: string;
  fleet_id: string;
  fleet?: FleetInfo;
  price_per_hour: number;
  currency: string;
  is_active: boolean;
};

export type HourlyPricesResponse = {
  success: boolean;
  count?: number;
  data: HourlyPriceItem[];
};

export type SingleHourlyPriceResponse = {
  success: boolean;
  message?: string;
  data: HourlyPriceItem;
};

/* ─── Haversine Distance Helper ────────────────────────────────────────────── */

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/* ─── Pricing API Calls ────────────────────────────────────────────────────── */

/**
 * 1) Request a Quote (Hourly, Short distance <= 45km, or Long distance > 45km)
 * POST /api/pricing/quote
 */
export async function requestQuote(params: QuoteRequestParams): Promise<QuoteApiResponse> {
  try {
    const response = await apiPost<QuoteApiResponse>("pricing/quote", params);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to request pricing quote"), { cause: error });
  }
}

/**
 * 2) Poll Quote Status
 * GET /api/pricing/quotes/:quoteId
 */
export async function getQuoteStatus(quoteId: string): Promise<QuoteStatusApiResponse> {
  try {
    const response = await apiGet<QuoteStatusApiResponse>(`pricing/quotes/${quoteId}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch quote status"), { cause: error });
  }
}

/**
 * 3) Admin - Fetch Pending Quotes (list of quotes awaiting admin pricing)
 * GET /api/pricing/quotes/pending/list
 */
export async function fetchPendingQuotes(): Promise<PendingQuotesApiResponse> {
  try {
    const response = await apiGet<PendingQuotesApiResponse>("pricing/quotes/pending/list");
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch pending quotes"), { cause: error });
  }
}

/**
 * 4) Admin - Set Price for Long Distance Quote
 * PUT /api/pricing/quotes/:quoteId/set-price
 */
export async function setQuotePrice(
  quoteId: string,
  params: SetPriceParams
): Promise<SetPriceApiResponse> {
  try {
    const response = await apiPut<SetPriceApiResponse>(`pricing/quotes/${quoteId}/set-price`, params);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to set quote price"), { cause: error });
  }
}

/* ─── 5) Admin - Fixed Price CRUD (<= 45 km) ───────────────────────────────── */

export async function createFixedPrice(params: {
  fleet_id: string;
  price: number;
  currency?: string;
  is_active?: boolean;
}): Promise<SingleFixedPriceResponse> {
  try {
    const payload = {
      currency: "KWD",
      is_active: true,
      ...params,
    };
    const response = await apiPost<SingleFixedPriceResponse>("pricing/fixed/create", payload);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create fixed price"), { cause: error });
  }
}

export async function fetchFixedPrices(): Promise<FixedPricesResponse> {
  try {
    const response = await apiGet<FixedPricesResponse>("pricing/fixed/get");
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch fixed prices"), { cause: error });
  }
}

export async function fetchFixedPriceById(id: string): Promise<SingleFixedPriceResponse> {
  try {
    const response = await apiGet<SingleFixedPriceResponse>(`pricing/fixed/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch fixed price details"), { cause: error });
  }
}

export async function updateFixedPrice(
  id: string,
  params: { price?: number; is_active?: boolean }
): Promise<SingleFixedPriceResponse> {
  try {
    const response = await apiPut<SingleFixedPriceResponse>(`pricing/fixed/${id}`, params);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update fixed price"), { cause: error });
  }
}

export async function deleteFixedPrice(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`pricing/fixed/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete fixed price"), { cause: error });
  }
}

/* ─── 6) Admin - Hourly Price CRUD ─────────────────────────────────────────── */

export async function createHourlyPrice(params: {
  fleet_id: string;
  price_per_hour: number;
  currency?: string;
  is_active?: boolean;
}): Promise<SingleHourlyPriceResponse> {
  try {
    const payload = {
      currency: "KWD",
      is_active: true,
      ...params,
    };
    const response = await apiPost<SingleHourlyPriceResponse>("pricing/hourly/create", payload);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create hourly price"), { cause: error });
  }
}

export async function fetchHourlyPrices(): Promise<HourlyPricesResponse> {
  try {
    const response = await apiGet<HourlyPricesResponse>("pricing/hourly/get");
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch hourly prices"), { cause: error });
  }
}

export async function fetchHourlyPriceById(id: string): Promise<SingleHourlyPriceResponse> {
  try {
    const response = await apiGet<SingleHourlyPriceResponse>(`pricing/hourly/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch hourly price details"), { cause: error });
  }
}

export async function updateHourlyPrice(
  id: string,
  params: { price_per_hour?: number; is_active?: boolean }
): Promise<SingleHourlyPriceResponse> {
  try {
    const response = await apiPut<SingleHourlyPriceResponse>(`pricing/hourly/${id}`, params);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update hourly price"), { cause: error });
  }
}

export async function deleteHourlyPrice(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`pricing/hourly/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete hourly price"), { cause: error });
  }
}
