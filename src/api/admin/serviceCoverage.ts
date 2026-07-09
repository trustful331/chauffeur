import { apiGet, apiPost, apiPut, apiDelete, getErrorMessage } from "src/config/axios";

export type ServiceCoverageItem = {
  id: string;
  section_type: "featured" | "itinerary";
  section_heading?: string;
  section_subtitle?: string;
  title: string;
  description: string;
  image_url?: string;
  icon_key?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ServiceCoverageResponse = {
  success: boolean;
  count?: number;
  message?: string;
  data: ServiceCoverageItem[];
};

export type SingleServiceCoverageResponse = {
  success: boolean;
  message?: string;
  data: ServiceCoverageItem;
};

export type ServiceCoverageParams = Omit<ServiceCoverageItem, "id" | "created_at" | "updated_at">;

export async function fetchServiceCoverages(filters?: {
  section_type?: string;
  is_active?: boolean;
}) {
  try {
    let url = "service_coverage/get";
    const params = new URLSearchParams();
    if (filters) {
      if (filters.section_type) params.append("section_type", filters.section_type);
      if (filters.is_active !== undefined) params.append("is_active", String(filters.is_active));
    }
    const queryStr = params.toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
    const response = await apiGet<ServiceCoverageResponse>(url);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch service coverage"), { cause: error });
  }
}

export async function fetchServiceCoverageById(id: string) {
  try {
    const response = await apiGet<SingleServiceCoverageResponse>(`service_coverage/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch service coverage details"), { cause: error });
  }
}

export async function createServiceCoverage(data: ServiceCoverageParams) {
  try {
    const response = await apiPost<SingleServiceCoverageResponse>("service_coverage/create", data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create service coverage"), { cause: error });
  }
}

export async function updateServiceCoverage(id: string, data: Partial<ServiceCoverageParams>) {
  try {
    const response = await apiPut<SingleServiceCoverageResponse>(`service_coverage/${id}`, data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update service coverage"), { cause: error });
  }
}

export async function deleteServiceCoverage(id: string) {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`service_coverage/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete service coverage"), { cause: error });
  }
}
