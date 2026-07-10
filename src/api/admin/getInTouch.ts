import { apiGet, apiDelete, getErrorMessage } from "src/config/axios";

export type GetInTouchItem = {
  id: string;
  full_name: string;
  phone_number: string;
  email_address: string;
  note: string;
  created_at?: string;
  updated_at?: string;
};

export type GetInTouchResponse = {
  success: boolean;
  count?: number;
  message?: string;
  data: GetInTouchItem[];
};

export type SingleGetInTouchResponse = {
  success: boolean;
  message?: string;
  data: GetInTouchItem;
};

export async function fetchGetInTouches() {
  try {
    const response = await apiGet<GetInTouchResponse>("get_in_touch/get");
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch callback requests"), { cause: error });
  }
}

export async function fetchGetInTouchById(id: string) {
  try {
    const response = await apiGet<SingleGetInTouchResponse>(`get_in_touch/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch callback details"), { cause: error });
  }
}

export async function deleteGetInTouch(id: string) {
  try {
    const response = await apiDelete<{ success: boolean; message?: string }>(`get_in_touch/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete callback request"), { cause: error });
  }
}
