import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { XCircle, RefreshCw, Home, AlertCircle, PhoneCall } from "lucide-react";
import toast from "react-hot-toast";
import { payBooking } from "../../api/payment";

export function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId") || searchParams.get("payment_id");
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const savedBookingId = localStorage.getItem("pending_booking_id");
    setBookingId(savedBookingId);
  }, []);

  const handleRetryPayment = async () => {
    if (!bookingId) {
      toast.error("Unable to find the booking details for retry. Please book again.");
      return;
    }

    setRetrying(true);
    try {
      // Re-initiate payment checkout session
      const response = await payBooking(bookingId, {
        currency: "KWD",
        language: "en",
      });

      if (response && response.success && response.data?.checkout_url) {
        toast.success("Re-initiating payment gateway...");
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error(response.message || "Failed to retrieve checkout URL.");
      }
    } catch (err) {
      console.error("Retry payment error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to retry payment. Please try again.");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#fcfbfa] py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="rounded-[32px] bg-white border border-[#eaecf0] p-10 shadow-[0_16px_50px_rgba(0,0,0,0.03)] text-center max-md:p-6">
          
          {/* Failure Circle Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 animate-pulse">
            <XCircle className="h-12 w-12" />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold text-maseer-green-text max-md:text-2xl">
            Payment Declined
          </h1>
          
          <p className="mt-3 text-sm text-maseer-muted leading-relaxed">
            We couldn't process your transaction. This might be due to incorrect details, insufficient funds, or a network timeout.
          </p>

          {/* Reference panel */}
          <div className="mt-8 border-t border-[#f0f2f5] pt-6 text-left">
            <div className="flex items-center gap-1.5 mb-3 text-red-600">
              <AlertCircle className="h-4.5 w-4.5" />
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider">
                Transaction Details
              </h3>
            </div>
            
            <div className="rounded-2xl bg-red-50/50 border border-red-50 p-5 text-xs font-lato space-y-2.5">
              {bookingId && (
                <div className="flex justify-between">
                  <span className="text-maseer-muted">Booking Reference:</span>
                  <strong className="text-maseer-green-text">{bookingId}</strong>
                </div>
              )}
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-maseer-muted">Payment Ref ID:</span>
                  <strong className="text-maseer-green-text break-all max-w-[220px] text-right">{paymentId}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-maseer-muted">Currency Code:</span>
                <strong className="text-maseer-green-text">KWD (Kuwaiti Dinar)</strong>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3">
            {bookingId && (
              <button
                type="button"
                onClick={handleRetryPayment}
                disabled={retrying}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-maseer-gold py-4 font-lato text-sm font-bold text-[#101828] hover:bg-[#d8a400] transition active:scale-[0.99] disabled:opacity-50"
              >
                {retrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Try Payment Again
                  </>
                )}
              </button>
            )}

            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-maseer-line/60 py-3.5 font-lato text-sm font-bold text-maseer-green-text hover:bg-maseer-cream transition"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-2 text-xs font-lato text-maseer-muted">
            <span>Need help?</span>
            <a
              href="tel:+96550000000"
              className="flex items-center gap-1 font-semibold text-maseer-green hover:underline"
            >
              <PhoneCall className="h-3 w-3" /> Call Helpline
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
