import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { signIn } from "src/api/auth";
import { setSession } from "src/store/slices/auth";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectIsAuthenticated } from "src/store/slices/auth/selectors";
import {
  AuthDivider,
  AuthField,
  SocialAuthButtons,
  fieldClass,
} from "./AuthShared";
import { LoadingButton } from "../../ui/Spinner";

type SignInFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export function SignInPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    (location.state as { from?: string } | null)?.from ||
    searchParams.get("redirect") ||
    "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const session = await signIn(data.email.trim(), data.password);
      dispatch(setSession(session));
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Sign in failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow !text-primary">WELCOME BACK</p>
        <h2 className="mt-3 font-serif text-[36px] font-semibold leading-tight text-maseer-green-text max-md:text-[28px]">
          Sign in
        </h2>
        <p className="mt-2 font-lato text-[14px] text-maseer-muted">
          Access your Maseer account to manage rides and preferences.
        </p>
      </div>

      <SocialAuthButtons mode="signin" />
      <AuthDivider />

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
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass(!!errors.email)}
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
            autoComplete="current-password"
            placeholder="Enter your password"
            className={fieldClass(!!errors.password)}
          />
        </AuthField>

        <div className="flex items-center justify-between gap-4 pt-1 max-md:flex-col max-md:items-start max-md:gap-2">
          <label className="flex cursor-pointer items-center gap-2 font-lato text-[13px] text-maseer-green-text">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-maseer-line text-maseer-green focus:ring-maseer-gold/30"
            />
            Remember me
          </label>
          <button
            type="button"
            className="font-lato text-[13px] font-semibold text-maseer-gold transition hover:text-maseer-green"
            onClick={() =>
              console.log("[Auth] Forgot password — static handler")
            }
          >
            Forgot password?
          </button>
        </div>

        {submitError ? (
          <p className="font-lato text-[13px] text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}

        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText="Signing in..."
          className="btn-primary mt-2 w-full !rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          Sign In
        </LoadingButton>
      </form>

      <p className="mt-8 text-center font-lato text-[14px] text-maseer-muted">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-maseer-green transition hover:text-maseer-gold"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
