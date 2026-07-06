import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "src/api/auth";
import { LoadingButton } from "../../ui/Spinner";
import { AuthField, fieldClass } from "./AuthShared";

type ForgotForm = {
  email: string;
};

function MailIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12" aria-hidden>
      <rect width="48" height="48" rx="14" fill="rgba(7,58,11,0.06)" />
      <path
        d="M12 18l12 9 12-9"
        stroke="#073A0B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="10"
        y="15"
        width="28"
        height="20"
        rx="3"
        stroke="#073A0B"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotForm) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await forgotPassword(data.email.trim());
      // Pass email forward via state so OTP and reset pages can use it
      navigate("/otp-verify", {
        state: { email: data.email.trim() },
        replace: false,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to send OTP.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Icon */}
      <MailIcon />

      {/* Header */}
      <div className="mt-5 mb-8">
        <p className="eyebrow !text-primary">PASSWORD RECOVERY</p>
        <h2 className="mt-3 font-serif text-[34px] font-semibold leading-tight text-maseer-green-text max-md:text-[26px]">
          Forgot password?
        </h2>
        <p className="mt-2 font-lato text-[14px] text-maseer-muted">
          Enter your email address and we&apos;ll send a 6-digit OTP to
          verify your identity.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField label="Email Address" error={errors.email?.message}>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass(!!errors.email)}
          />
        </AuthField>

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
          loadingText="Sending OTP..."
          className="btn-primary mt-2 w-full !rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          Send OTP Code
        </LoadingButton>
      </form>

      <p className="mt-6 text-center font-lato text-[14px] text-maseer-muted">
        Remember your password?{" "}
        <Link
          to="/signin"
          className="font-semibold text-maseer-green transition hover:text-maseer-gold"
        >
          Back to login
        </Link>
      </p>
    </div>
  );
}
