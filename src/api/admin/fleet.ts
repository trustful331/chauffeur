import { apiGet, apiPost, apiPut, apiDelete, getErrorMessage } from "src/config/axios";

export type Amenity = {
  name: string;
  icon_key: string;
};

export type FleetItem = {
  id: string;
  vehicle_name: string;
  vehicle_type: "sedan" | "suv" | "van";
  category: "green_class" | "ultra_luxury" | "business_van" | "vip_business_class" | "economy_class";
  image_url: string;
  seat_count: number;
  luggage_capacity: number;
  amenities: Amenity[];
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export type FleetResponse = {
  success: boolean;
  count?: number;
  message?: string;
  data: FleetItem[];
};

export type SingleFleetResponse = {
  success: boolean;
  message?: string;
  data: FleetItem;
};

export type FleetParams = Omit<FleetItem, "id" | "created_at" | "updated_at">;

export async function fetchFleets(filters?: {
  category?: string;
  vehicle_type?: string;
  is_active?: boolean;
}) {
  try {
    let url = "fleet/get";
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append("category", filters.category);
      if (filters.vehicle_type) params.append("vehicle_type", filters.vehicle_type);
      if (filters.is_active !== undefined) params.append("is_active", String(filters.is_active));
    }
    const queryStr = params.toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
    const response = await apiGet<FleetResponse>(url);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch fleets"), { cause: error });
  }
}

export async function fetchFleetById(id: string) {
  try {
    const response = await apiGet<SingleFleetResponse>(`fleet/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch fleet details"), { cause: error });
  }
}

export async function createFleet(data: FleetParams) {
  try {
    const response = await apiPost<SingleFleetResponse>("fleet/create", data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create fleet"), { cause: error });
  }
}

export async function updateFleet(id: string, data: Partial<FleetParams>) {
  try {
    const response = await apiPut<SingleFleetResponse>(`fleet/${id}`, data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update fleet"), { cause: error });
  }
}

export async function deleteFleet(id: string) {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`fleet/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete fleet"), { cause: error });
  }
}
