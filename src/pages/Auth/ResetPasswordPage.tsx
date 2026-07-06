import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "src/api/auth";
import { LoadingButton } from "../../ui/Spinner";
import { AuthField, fieldClass } from "./AuthShared";

type ResetForm = {
  newPassword: string;
  confirmPassword: string;
};

function LockIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12" aria-hidden>
      <rect width="48" height="48" rx="14" fill="rgba(7,58,11,0.06)" />
      <rect
        x="13"
        y="22"
        width="22"
        height="16"
        rx="3"
        stroke="#073A0B"
        strokeWidth="1.8"
      />
      <path
        d="M17 22v-5a7 7 0 0 1 14 0v5"
        stroke="#073A0B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="30" r="2" fill="#073A0B" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "#EF4444" };
  if (score <= 2) return { score: 2, label: "Fair", color: "#F59E0B" };
  return { score: 3, label: "Strong", color: "#22C55E" };
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; otp?: string } | null;
  const email = state?.email ?? "";
  const otp = state?.otp ?? "";

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const watchedPassword = watch("newPassword", "");
  const strength = getStrength(watchedPassword);

  const onSubmit = async (data: ResetForm) => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(email, otp, data.newPassword);
      navigate("/signin", {
        state: { resetSuccess: true },
        replace: true,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Password reset failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <LockIcon />

      <div className="mt-5 mb-8">
        <p className="eyebrow !text-primary">PASSWORD RECOVERY</p>
        <h2 className="mt-3 font-serif text-[34px] font-semibold leading-tight text-maseer-green-text max-md:text-[26px]">
          Reset password
        </h2>
        <p className="mt-2 font-lato text-[14px] text-maseer-muted">
          Create a strong new password for your account.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* New Password */}
        <AuthField label="New Password" error={errors.newPassword?.message}>
          <div className="relative">
            <input
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              id="new-password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter new password"
              className={`${fieldClass(!!errors.newPassword)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-maseer-muted transition hover:text-maseer-green"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showNew} />
            </button>
          </div>

          {/* Strength indicator */}
          {watchedPassword && (
            <div className="mt-2.5">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((tier) => (
                  <div
                    key={tier}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        strength.score >= tier ? strength.color : "#E5E7EB",
                    }}
                  />
                ))}
              </div>
              <p
                className="mt-1 font-lato text-[11px] font-semibold transition-colors"
                style={{ color: strength.color }}
              >
                {strength.label} password
              </p>
            </div>
          )}
        </AuthField>

        {/* Confirm Password */}
        <AuthField
          label="Confirm Password"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watchedPassword || "Passwords do not match",
              })}
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              className={`${fieldClass(!!errors.confirmPassword)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-maseer-muted transition hover:text-maseer-green"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </AuthField>

        {/* Password requirements */}
        <div
          className="rounded-xl px-4 py-3.5"
          style={{
            background: "rgba(6,33,17,0.04)",
            border: "1px solid rgba(7,58,11,0.1)",
          }}
        >
          <p className="mb-2 font-lato text-[12px] font-semibold text-maseer-green-text">
            Password requirements:
          </p>
          <ul className="space-y-1">
            {[
              { check: watchedPassword.length >= 8, label: "At least 8 characters" },
              { check: /[A-Z]/.test(watchedPassword), label: "One uppercase letter" },
              { check: /[0-9]/.test(watchedPassword), label: "One number" },
              { check: /[^A-Za-z0-9]/.test(watchedPassword), label: "One special character" },
            ].map((req) => (
              <li
                key={req.label}
                className="flex items-center gap-2 font-lato text-[12px]"
                style={{ color: req.check ? "#22C55E" : "#9CA3AF" }}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden
                >
                  {req.check ? (
                    <path
                      d="M3 8l3.5 3.5 7-7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.4" />
                  )}
                </svg>
                {req.label}
              </li>
            ))}
          </ul>
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
          loadingText="Resetting password..."
          className="btn-primary mt-2 w-full !rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          Reset Password
        </LoadingButton>
      </form>
    </div>
  );
}
