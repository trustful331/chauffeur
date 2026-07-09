import { apiGet, apiPost, apiPut, apiDelete, getErrorMessage } from "src/config/axios";
import { type FleetItem } from "./fleet";

export type Highlight = {
  title: string;
  description: string;
  icon_key: string;
};

export type FleetDetailItem = {
  id: string;
  fleet: string | FleetItem;
  title: string;
  description: string;
  vehicle_image_url: string;
  highlights: Highlight[];
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export type FleetDetailResponse = {
  success: boolean;
  count?: number;
  message?: string;
  data: FleetDetailItem[];
};

export type SingleFleetDetailResponse = {
  success: boolean;
  message?: string;
  data: FleetDetailItem;
};

export type FleetDetailParams = {
  fleet: string; // FLEET_ID
  title: string;
  description: string;
  vehicle_image_url: string;
  highlights: Highlight[];
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

export async function fetchFleetDetails(filters?: {
  fleet?: string;
  is_featured?: boolean;
  is_active?: boolean;
}) {
  try {
    let url = "fleet_detail/get";
    const params = new URLSearchParams();
    if (filters) {
      if (filters.fleet) params.append("fleet", filters.fleet);
      if (filters.is_featured !== undefined) params.append("is_featured", String(filters.is_featured));
      if (filters.is_active !== undefined) params.append("is_active", String(filters.is_active));
    }
    const queryStr = params.toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
    const response = await apiGet<FleetDetailResponse>(url);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch fleet details"), { cause: error });
  }
}

export async function createFleetDetail(data: FleetDetailParams) {
  try {
    const response = await apiPost<SingleFleetDetailResponse>("fleet_detail/create", data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create fleet details"), { cause: error });
  }
}

export async function updateFleetDetail(id: string, data: Partial<FleetDetailParams>) {
  try {
    const response = await apiPut<SingleFleetDetailResponse>(`fleet_detail/${id}`, data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update fleet details"), { cause: error });
  }
}

export async function deleteFleetDetail(id: string) {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`fleet_detail/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete fleet details"), { cause: error });
  }
}
