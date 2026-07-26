import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, ArrowRight, Calendar, MapPin, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { verifyPayment, type VerifyPaymentResponse } from "../../api/payment";

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId") || searchParams.get("payment_id");
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyData, setVerifyData] = useState<VerifyPaymentResponse["data"] | null>(null);

  useEffect(() => {
    // 1. Get the pending booking ID from localStorage
    const savedBookingId = localStorage.getItem("pending_booking_id");
    setBookingId(savedBookingId);

    if (!paymentId) {
      setError("No payment transaction identifier was found in the URL.");
      setLoading(false);
      return;
    }

    if (!savedBookingId) {
      setError("No pending booking ID was found on this device.");
      setLoading(false);
      return;
    }

    async function runVerification() {
      try {
        const response = await verifyPayment(savedBookingId, {
          payment_id: paymentId!,
        });

        if (response && response.success && response.data) {
          setVerifyData(response.data);
          // Check payment status from the response
          const status = response.data.booking.payment_status;
          if (status !== "paid" && response.data.payment.payment_status !== "SUCCESS") {
            setError("Your payment is currently pending or has failed on the gateway.");
          } else {
            // Success! Clear the pending booking ID
            localStorage.removeItem("pending_booking_id");
            toast.success("Payment verified successfully!");
          }
        } else {
          setError(response.message || "Failed to verify payment with the server.");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred while verifying payment.");
      } finally {
        setLoading(false);
      }
    }

    runVerification();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fcfbfa] px-4">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-maseer-gold/20 opacity-75" />
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-maseer-gold border-t-transparent" />
        </div>
        <h2 className="mt-6 font-serif text-2xl font-bold text-maseer-green-text">
          Verifying Payment
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-maseer-muted">
          Please wait while we secure your transaction details...
        </p>
      </div>
    );
  }

  if (error || !verifyData) {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-3xl border border-red-100 bg-white p-8 shadow-[0_12px_48px_rgba(0,0,0,0.05)] text-center max-md:mx-4 max-md:p-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="mt-6 font-serif text-2xl font-bold text-[#101828]">
          Verification Failed
        </h2>
        <p className="mt-3 text-sm text-[#667085] leading-relaxed">
          {error || "We could not verify your payment at this moment."}
        </p>
        
        <div className="mt-8 rounded-2xl bg-slate-50 p-4.5 text-left text-xs text-slate-500 space-y-2">
          {bookingId && (
            <div className="flex justify-between">
              <span>Booking Reference:</span>
              <strong className="text-slate-700">{bookingId}</strong>
            </div>
          )}
          {paymentId && (
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <strong className="text-slate-700 truncate max-w-[200px]">{paymentId}</strong>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/"
            className="w-full rounded-xl bg-maseer-green py-3.5 font-lato text-sm font-semibold text-white transition hover:bg-maseer-green-deep"
          >
            Go to Homepage
          </Link>
          <a
            href="mailto:support@chauffeur.com"
            className="font-lato text-xs font-semibold text-maseer-muted hover:underline"
          >
            Contact Customer Care
          </a>
        </div>
      </div>
    );
  }

  const { booking, payment } = verifyData;

  return (
    <div className="min-h-[85vh] bg-[#fcfbfa] py-16 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Success Header Card */}
        <div className="rounded-[32px] bg-white border border-[#eaecf0] p-10 shadow-[0_16px_50px_rgba(0,0,0,0.03)] text-center max-md:p-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold text-maseer-green-text max-md:text-2xl">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-sm text-maseer-muted leading-relaxed max-w-md mx-auto">
            Your payment of <strong className="text-maseer-green">{payment.amount} {payment.currency}</strong> was processed successfully. Thank you for riding with us.
          </p>

          {/* Receipt details */}
          <div className="mt-10 border-t border-[#f0f2f5] pt-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-maseer-gold" />
              <h3 className="font-serif text-base font-bold text-maseer-green-text">
                Transaction Receipt
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 rounded-2xl bg-[#FFFBF0]/60 p-6 text-xs font-lato max-md:grid-cols-1 max-md:gap-y-3">
              <div>
                <span className="block text-maseer-muted uppercase tracking-wider text-[10px]">Booking Reference</span>
                <strong className="mt-1 block text-sm text-maseer-green-text">{booking.id}</strong>
              </div>
              <div>
                <span className="block text-maseer-muted uppercase tracking-wider text-[10px]">Payment ID</span>
                <strong className="mt-1 block text-sm text-maseer-green-text break-all">{payment.transaction_id || paymentId}</strong>
              </div>
              <div>
                <span className="block text-maseer-muted uppercase tracking-wider text-[10px]">Amount Charged</span>
                <strong className="mt-1 block text-sm text-maseer-green">{payment.amount} {payment.currency}</strong>
              </div>
              <div>
                <span className="block text-maseer-muted uppercase tracking-wider text-[10px]">Status</span>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-800 uppercase">
                  {booking.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Trip Overview */}
          <div className="mt-8 border-t border-[#f0f2f5] pt-8 text-left">
            <h3 className="font-serif text-base font-bold text-maseer-green-text mb-4">
              Trip Details
            </h3>
            
            <div className="space-y-4 text-xs font-lato">
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-maseer-gold" />
                <div>
                  <span className="block text-[10px] text-maseer-muted uppercase">Pickup Location</span>
                  <span className="text-sm font-semibold text-maseer-green-text">{booking.pickup_location as string}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#b28b24]" />
                <div>
                  <span className="block text-[10px] text-maseer-muted uppercase">Dropoff Location</span>
                  <span className="text-sm font-semibold text-maseer-green-text">{booking.dropoff_location as string}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#f0f2f5]/60 pt-4 max-md:grid-cols-1">
                <div className="flex gap-3">
                  <Calendar className="h-4 w-4 text-maseer-gold" />
                  <div>
                    <span className="block text-[10px] text-maseer-muted uppercase">Scheduled Date &amp; Time</span>
                    <span className="font-semibold text-maseer-green-text">
                      {booking.pickup_date as string} at {booking.pickup_time as string}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <User className="h-4 w-4 text-maseer-gold" />
                  <div>
                    <span className="block text-[10px] text-maseer-muted uppercase">Passenger Name</span>
                    <span className="font-semibold text-maseer-green-text">
                      {booking.passenger_name as string}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex gap-4 max-md:flex-col">
            <Link
              to="/"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-maseer-green py-4 font-lato text-sm font-bold text-white transition hover:bg-maseer-green-deep"
            >
              Go to Home Page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
