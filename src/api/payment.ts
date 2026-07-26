import { apiGet, apiPost, getErrorMessage } from "src/config/axios";

export type PayBookingParams = {
  amount?: number;
  currency?: string; // Must be "KWD"
  language?: "en" | "ar";
};

export type PayBookingResponse = {
  success: boolean;
  message?: string;
  data: {
    booking: {
      id: string;
      amount: number;
      currency: string;
      payment_status: string;
      fatora_order_id?: string;
      fatora_checkout_url?: string;
      [key: string]: unknown;
    };
    checkout_url: string;
  };
};

export type VerifyPaymentParams = {
  payment_id: string;
  order_id?: string;
  transaction_id?: string;
};

export type VerifyPaymentResponse = {
  success: boolean;
  message?: string;
  data: {
    booking: {
      id: string;
      payment_status: "pending" | "paid" | "failed";
      amount: number;
      currency: string;
      paid_at?: string;
      [key: string]: unknown;
    };
    payment: {
      payment_status: "SUCCESS" | string;
      transaction_id: string;
      amount: number;
      currency: string;
      description?: string;
    };
  };
};

export type PaymentStatusResponse = {
  success: boolean;
  data: {
    id: string;
    payment_status: "pending" | "paid" | "failed";
    amount: number;
    currency: string;
    fatora_checkout_url?: string;
    paid_at?: string;
    [key: string]: unknown;
  };
};

/**
 * Initializes a MyFatoorah payment session for a booking
 */
export async function payBooking(bookingId: string, params: PayBookingParams) {
  try {
    const response = await apiPost<PayBookingResponse>(
      `booking/${bookingId}/pay`,
      params
    );
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to initiate payment"), {
      cause: error,
    });
  }
}

/**
 * Verifies a payment transaction using the paymentId
 */
export async function verifyPayment(
  bookingId: string,
  params: VerifyPaymentParams
) {
  try {
    const response = await apiPost<VerifyPaymentResponse>(
      `booking/payment/verify/${bookingId}`,
      params
    );
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to verify payment"), {
      cause: error,
    });
  }
}

/**
 * Retrieves the current payment status of a booking
 */
export async function getPaymentStatus(bookingId: string) {
  try {
    const response = await apiGet<PaymentStatusResponse>(
      `booking/${bookingId}/payment/status`
    );
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch payment status"), {
      cause: error,
    });
  }
}
