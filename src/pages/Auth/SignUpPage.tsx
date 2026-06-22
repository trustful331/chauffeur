import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signUpAsync } from "src/store/actions/auth/auth.actions";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectIsAuthenticated } from "src/store/slices/auth/selectors";
import {
  AuthDivider,
  AuthField,
  SocialAuthButtons,
  fieldClass,
} from "./AuthShared";
import { LoadingButton } from "../../ui/Spinner";

type SignUpFormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
};

export function SignUpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await dispatch(
        signUpAsync({
          full_name: data.fullName.trim(),
          email: data.email.trim(),
          password: data.password,
          phone_number: data.phone.trim(),
        }),
      );
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Sign up failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow !text-primary">JOIN MASEER</p>
        <h2 className="mt-3 font-serif text-[36px] font-semibold leading-tight text-maseer-green-text">
          Create account
        </h2>
        <p className="mt-2 font-lato text-[14px] text-maseer-muted">
          Sign up to book premium chauffeur services with ease.
        </p>
      </div>

      <SocialAuthButtons mode="signup" />
      <AuthDivider />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField label="Full Name" error={errors.fullName?.message}>
          <input
            {...register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            autoComplete="name"
            placeholder="Your full name"
            className={fieldClass(!!errors.fullName)}
          />
        </AuthField>

        <AuthField label="Email Address" error={errors.email?.message}>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass(!!errors.email)}
          />
        </AuthField>

        <AuthField label="Phone Number" error={errors.phone?.message}>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[+]?[\d\s()-]{7,20}$/,
                message: "Enter a valid phone number",
              },
            })}
            type="tel"
            autoComplete="tel"
            placeholder="+966 5X XXX XXXX"
            className={fieldClass(!!errors.phone)}
          />
        </AuthField>

        <AuthField label="Password" error={errors.password?.message}>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            className={fieldClass(!!errors.password)}
          />
        </AuthField>

        <label className="flex cursor-pointer items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            {...register("acceptTerms", {
              required: "You must accept the terms to continue",
            })}
            className="mt-0.5 h-4 w-4 rounded border-maseer-line text-maseer-green focus:ring-maseer-gold/30"
          />
          <span className="font-lato text-[12px] leading-5 text-maseer-muted">
            I agree to Maseer&apos;s{" "}
            <button
              type="button"
              className="font-semibold text-maseer-green underline-offset-2 hover:underline"
              onClick={() => console.log("[Auth] Terms — static handler")}
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="font-semibold text-maseer-green underline-offset-2 hover:underline"
              onClick={() => console.log("[Auth] Privacy — static handler")}
            >
              Privacy Policy
            </button>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="font-lato text-[11px] text-red-600" role="alert">
            {errors.acceptTerms.message}
          </p>
        )}

        {submitError ? (
          <p className="font-lato text-[13px] text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}

        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText="Creating account..."
          className="btn-primary mt-2 w-full !rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          Create Account
        </LoadingButton>
      </form>

      <p className="mt-8 text-center font-lato text-[14px] text-maseer-muted">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="font-semibold text-maseer-green transition hover:text-maseer-gold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
