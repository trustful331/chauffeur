import { apiPost, getErrorMessage } from "src/config/axios";

export type CreateGetInTouchParams = {
  full_name: string;
  phone_number: string;
  email_address: string;
  note: string;
};

type GetInTouchApiResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
};

export async function createGetInTouch(params: CreateGetInTouchParams) {
  try {
    const result = await apiPost<GetInTouchApiResponse>("get_in_touch/create", params);

    if (result.success === false) {
      throw new Error(result.message || "Failed to submit request");
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to submit request"), { cause: error });
  }
}
