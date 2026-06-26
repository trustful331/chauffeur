import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "../../ui/Spinner";
import { createGetInTouch } from "src/api/getInTouch";
import toast from "react-hot-toast";

type ContactCallbackFormValues = {
  name: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  message: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 font-lato text-[11px] text-red-600" role="alert">
      {message}
    </p>
  );
}

function fieldClass(hasError: boolean) {
  return ["input-field font-lato !py-1.5", hasError ? "!border-red-400" : ""].join(" ");
}

export function ContactCallbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactCallbackFormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceNeeded: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactCallbackFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        full_name: data.name.trim(),
        phone_number: data.phone.trim(),
        email_address: data.email.trim(),
        note: `Service Needed: ${data.serviceNeeded.trim()}\nMessage: ${data.message.trim()}`.trim(),
      };

      await createGetInTouch(payload);
      toast.success("Callback request submitted successfully! 🎉");
      reset();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to submit request";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-[#e8e8e8] bg-white p-8 lg:p-10"
    >
      <h3 className="font-lato text-xl font-bold text-maseer-green-text">
        Request a Callback
      </h3>
      <p className="mt-2 font-lato text-[13px] leading-5 text-maseer-muted">
        Fill out the form and we&apos;ll get back to you within minutes.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                validate: (value) =>
                  value.trim().length > 0 || "Name is required",
              })}
              placeholder="Your Name"
              className={fieldClass(!!errors.name)}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[+]?[\d\s()-]{7,20}$/,
                  message: "Enter a valid phone number",
                },
              })}
              placeholder="Phone Number"
              className={fieldClass(!!errors.phone)}
            />
            <FieldError message={errors.phone?.message} />
          </div>
        </div>

        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            placeholder="Email Address"
            className={fieldClass(!!errors.email)}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <input
            {...register("serviceNeeded", {
              required: "Service needed is required",
              minLength: {
                value: 2,
                message: "Please describe the service you need",
              },
            })}
            placeholder="Service Needed"
            className={fieldClass(!!errors.serviceNeeded)}
          />
          <FieldError message={errors.serviceNeeded?.message} />
        </div>

        <div>
          <textarea
            {...register("message", {
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
            })}
            rows={5}
            placeholder="Tell us about your transportation needs..."
            className={[fieldClass(!!errors.message), "resize-none"].join(" ")}
          />
          <FieldError message={errors.message?.message} />
        </div>
      </div>

      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingText="Sending..."
        className="mt-6 w-full rounded-xl bg-maseer-green py-2.5 font-lato text-sm font-semibold text-white transition hover:bg-maseer-green-deep disabled:cursor-not-allowed disabled:opacity-70"
      >
        Request Callback
      </LoadingButton>
    </form>
  );
}
