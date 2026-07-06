import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { forgotPassword, verifyOtp } from "src/api/auth";
import { LoadingButton } from "../../ui/Spinner";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function OtpShieldIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12" aria-hidden>
      <rect width="48" height="48" rx="14" fill="rgba(249,187,0,0.10)" />
      <path
        d="M24 8L11 14v9c0 7.6 5.5 14.7 13 17 7.5-2.3 13-9.4 13-17v-9L24 8z"
        fill="rgba(249,187,0,0.15)"
        stroke="#C9A130"
        strokeWidth="1.6"
      />
      <path
        d="M19 24l3.5 3.5 6.5-6.5"
        stroke="#C9A130"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    // Accept only single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setSubmitError(null);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setSubmitError(null);
    try {
      await forgotPassword(email);
      setCountdown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to resend OTP.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setSubmitError("Please enter the complete 6-digit OTP.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await verifyOtp(email, otp);
      navigate("/reset-password", {
        state: { email, otp },
        replace: false,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "OTP verification failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <div>
      <OtpShieldIcon />

      <div className="mt-5 mb-8">
        <p className="eyebrow !text-primary">OTP VERIFICATION</p>
        <h2 className="mt-3 font-serif text-[34px] font-semibold leading-tight text-maseer-green-text max-md:text-[26px]">
          Check your email
        </h2>
        <p className="mt-2 font-lato text-[14px] text-maseer-muted">
          We sent a 6-digit code to{" "}
          {email ? (
            <span className="font-semibold text-maseer-green-text">{email}</span>
          ) : (
            "your email"
          )}
          . Enter it below to continue.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Grid */}
        <div>
          <label className="mb-3 block font-lato text-[13px] font-semibold text-[#374151]">
            Enter OTP Code
          </label>
          <div className="flex gap-2.5 sm:gap-3">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                id={`otp-digit-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={[
                  "h-13 w-full rounded-xl border-2 text-center font-lato text-[22px] font-bold outline-none transition-all duration-150",
                  "focus:scale-[1.06] focus:shadow-md",
                  digits[i]
                    ? "border-maseer-gold bg-[#FFFDF5] text-maseer-green-text shadow-sm"
                    : submitError
                      ? "border-red-300 bg-white text-maseer-green-text"
                      : "border-[#D1D5DB] bg-white text-maseer-green-text",
                  "focus:border-maseer-gold focus:ring-2 focus:ring-maseer-gold/25",
                ].join(" ")}
                style={{ height: "52px" }}
                aria-label={`OTP digit ${i + 1}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>
        </div>

        {/* Resend */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="font-lato text-[13px] text-maseer-muted">
              Resend code in{" "}
              <span className="font-semibold text-maseer-green">
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                {String(countdown % 60).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-lato text-[13px] font-semibold text-maseer-gold transition hover:text-maseer-green disabled:opacity-60"
            >
              {isResending ? "Resending…" : "Resend OTP code"}
            </button>
          )}
          {resendSuccess && (
            <p className="mt-1 font-lato text-[12px] text-green-600">
              ✓ New OTP sent to your email.
            </p>
          )}
        </div>

        {submitError && (
          <div className="rounded-xl bg-red-50 px-4 py-3">
            <p className="font-lato text-[13px] text-red-600" role="alert">
              {submitError}
            </p>
          </div>
        )}

        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText="Verifying..."
          disabled={!isComplete}
          className="btn-primary mt-2 w-full !rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verify OTP
        </LoadingButton>
      </form>

      <p className="mt-6 text-center font-lato text-[14px] text-maseer-muted">
        Wrong email?{" "}
        <Link
          to="/forgot-password"
          className="font-semibold text-maseer-green transition hover:text-maseer-gold"
        >
          Go back
        </Link>
      </p>
    </div>
  );
}
