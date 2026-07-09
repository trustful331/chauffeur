import { apiGet, apiPost, apiPut, apiDelete, getErrorMessage } from "src/config/axios";

export type CustomerReviewItem = {
  id: string;
  section_title: string;
  section_subtitle: string;
  customer_name: string;
  customer_image_url?: string;
  star_rating: number;
  review_title: string;
  review_content: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export type CustomerReviewResponse = {
  success: boolean;
  count?: number;
  message?: string;
  data: CustomerReviewItem[];
};

export type SingleCustomerReviewResponse = {
  success: boolean;
  message?: string;
  data: CustomerReviewItem;
};

export type CustomerReviewParams = Omit<CustomerReviewItem, "id" | "created_at" | "updated_at">;

export async function fetchCustomerReviews(filters?: { is_active?: boolean }) {
  try {
    let url = "customer_review/get";
    const params = new URLSearchParams();
    if (filters) {
      if (filters.is_active !== undefined) params.append("is_active", String(filters.is_active));
    }
    const queryStr = params.toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
    const response = await apiGet<CustomerReviewResponse>(url);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch customer reviews"), { cause: error });
  }
}

export async function fetchCustomerReviewById(id: string) {
  try {
    const response = await apiGet<SingleCustomerReviewResponse>(`customer_review/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch customer review details"), { cause: error });
  }
}

export async function createCustomerReview(data: CustomerReviewParams) {
  try {
    const response = await apiPost<SingleCustomerReviewResponse>("customer_review/create", data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create customer review"), { cause: error });
  }
}

export async function updateCustomerReview(id: string, data: Partial<CustomerReviewParams>) {
  try {
    const response = await apiPut<SingleCustomerReviewResponse>(`customer_review/${id}`, data);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update customer review"), { cause: error });
  }
}

export async function deleteCustomerReview(id: string) {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`customer_review/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete customer review"), { cause: error });
  }
}
