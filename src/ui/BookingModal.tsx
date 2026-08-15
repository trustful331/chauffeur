import { type ReactNode, useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, X, Clock, CreditCard, ChevronLeft, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/store/hooks";
import { selectAuthUser, selectIsAuthenticated } from "src/store/slices/auth/selectors";
import {
  BOOKING_SERVICE_TYPE_MAP,
  createBooking,
  getFleetIdForCategory,
  type BookingLocation,
  type BookingServiceTab,
} from "../api/booking";
import { payBooking } from "../api/payment";
import {
  requestQuote,
  getQuoteStatus,
  calculateHaversineDistance,
  type QuoteData,
} from "../api/pricing";
import { FLEET_VEHICLES } from "../data/fleetData";
import { LocationMapField } from "./LocationMapField";
import { LoadingButton, LoadingSpinner } from "./Spinner";

/* ─── types ────────────────────────────────────────────────────────────────── */

type BookingTab = BookingServiceTab;

export type BookingForm = {
  pickup: BookingLocation;
  dropoff: BookingLocation;
  fleetClass: string;
  dateTime: string;
  passengers: string;
  childs: string;
  hours: string;
  passenger_name: string;
  passenger_email: string;
  phone_number: string;
  specialRequests: string;
  paymentMethod: string;
};

/* ─── constants ─────────────────────────────────────────────────────────────── */

const BOOKING_TABS: BookingTab[] = [
  "Airport Transfer",
  "A to B Transfer",
  "Hourly Service",
  "Daily Service",
];

const FLEET_CLASS_OPTIONS = [
  "Green Class",
  "Ultra Luxury",
  "Business Van",
  "VIP / Business Class",
  "Economy Class",
];

const CATEGORY_PRICE_MAP: Record<string, number> = {
  "Economy Class": 15,
  "Green Class": 25,
  "VIP / Business Class": 40,
  "Business Van": 50,
  "Ultra Luxury": 75,
};

const emptyLocation = (): BookingLocation => ({
  address: "",
  latitude: null,
  longitude: null,
});

/* ─── helpers ───────────────────────────────────────────────────────────────── */

function validateDateTime(value: string) {
  if (!value) return "Date and time is required";
  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) return "Enter a valid date and time";
  if (selected <= new Date()) return "Please select a future date and time";
  return true;
}

function filterFutureTime(time: Date) {
  const now = new Date();
  if (time.toDateString() === now.toDateString()) {
    return time.getTime() > now.getTime();
  }
  return true;
}

/* ─── small UI pieces ────────────────────────────────────────────────────────── */

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-2 block font-lato text-[13px] font-semibold text-maseer-green">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 font-lato text-[11px] text-red-600" role="alert">
      {message}
    </p>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[#9ca3af]"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden>
      <circle cx="10.5" cy="6" r="3.5" stroke="#9ca3af" strokeWidth="1.4" />
      <path
        d="M3 19c0-4.4 3.4-7 7.5-7s7.5 2.6 7.5 7"
        stroke="#9ca3af"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookingInput({
  icon,
  children,
  hasError = false,
}: {
  icon?: ReactNode;
  children: ReactNode;
  hasError?: boolean;
}) {
  return (
    <div
      className={[
        "flex h-[46px] items-center gap-2.5 rounded-xl border px-3.5 transition-colors",
        hasError
          ? "border-red-400 bg-red-50"
          : "border-[#e5e7eb] bg-white focus-within:border-maseer-gold",
      ].join(" ")}
    >
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      {children}
    </div>
  );
}

/* ─── booking form body ─────────────────────────────────────────────────────── */

export function BookingFormBody({
  vehicleId,
  vehicleName,
  initialData,
}: {
  vehicleId?: string;
  vehicleName?: string;
  onSuccess?: () => void;
  initialData?: Partial<BookingForm>;
}) {
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [step, setStep] = useState<1 | 2>(1);
  const [bookingTab, setBookingTab] = useState<BookingTab>("Airport Transfer");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Quote State
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(900);

  // Auto-resolve fleet class category if vehicleId is passed
  const autoResolvedClass = vehicleId
    ? (FLEET_VEHICLES.find((v) => v.id === vehicleId)?.category || "")
    : "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
    trigger,
    getValues,
    setValue,
  } = useForm<BookingForm>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      pickup: emptyLocation(),
      dropoff: emptyLocation(),
      fleetClass: autoResolvedClass,
      dateTime: "",
      passengers: "",
      childs: "0",
      hours: "1",
      passenger_name: "",
      passenger_email: "",
      phone_number: "",
      specialRequests: "",
      paymentMethod: "card",
    },
  });

  // Apply initialData if passed (e.g. from homepage form)
  useEffect(() => {
    if (initialData) {
      if (initialData.pickup) setValue("pickup", initialData.pickup);
      if (initialData.dropoff) setValue("dropoff", initialData.dropoff);
      if (initialData.fleetClass) setValue("fleetClass", initialData.fleetClass);
      if (initialData.dateTime) setValue("dateTime", initialData.dateTime);
      if (initialData.passengers) setValue("passengers", initialData.passengers);
      if (initialData.childs) setValue("childs", initialData.childs);
      if (initialData.hours) setValue("hours", initialData.hours);
    }
  }, [initialData, setValue]);

  // Autofill passenger details once authUser is loaded
  useEffect(() => {
    if (authUser && typeof authUser === "object") {
      setValue("passenger_name", authUser.full_name || "");
      setValue("passenger_email", authUser.email || "");
      if (authUser.phone_number) setValue("phone_number", authUser.phone_number);
    }
  }, [authUser, setValue]);

  // Poll quote status when awaiting admin
  useEffect(() => {
    if (!quoteData?.quote_id || quoteData.status !== "awaiting_admin") return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await getQuoteStatus(quoteData.quote_id!);
        if (res.success && res.data) {
          if (res.data.status === "priced" && res.data.amount != null) {
            setQuoteData((prev) =>
              prev
                ? {
                    ...prev,
                    status: "priced",
                    amount: res.data.amount,
                    requires_admin_price: false,
                  }
                : null
            );
            toast.success(`Admin has approved your custom rate: ${res.data.amount} KWD!`);
          } else if (res.data.status === "expired") {
            setQuoteData((prev) => (prev ? { ...prev, status: "expired" } : null));
            toast.error("Quote request expired. Please request a new quote.");
          }
        }
      } catch (e) {
        // Silently ignore transient network polling error
      }
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [quoteData?.quote_id, quoteData?.status]);

  // Countdown timer when awaiting admin
  useEffect(() => {
    if (!quoteData?.expires_at || quoteData.status !== "awaiting_admin") return;

    const timer = setInterval(() => {
      const expires = new Date(quoteData.expires_at!).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setRemainingSeconds(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [quoteData?.expires_at, quoteData?.status]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleNextStep = async () => {
    setBookingError(null);
    
    // Validate Step 1 fields
    const fieldsToValidate: Array<keyof BookingForm> = [
      "pickup",
      "fleetClass",
      "dateTime",
      "passengers",
      "childs",
    ];
    if (bookingTab !== "Hourly Service") {
      fieldsToValidate.push("dropoff");
    } else {
      fieldsToValidate.push("hours");
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    // Check map coordinate validations
    const values = getValues();
    if (values.pickup.latitude == null || values.pickup.longitude == null) {
      const msg = "Please set pick up location on the map.";
      setBookingError(msg);
      toast.error(msg);
      return;
    }

    if (bookingTab !== "Hourly Service") {
      if (values.dropoff.latitude == null || values.dropoff.longitude == null) {
        const msg = "Please set drop off location on the map.";
        setBookingError(msg);
        toast.error(msg);
        return;
      }
    }

    // Redirect to Signin if not authenticated before going to payment step
    if (!isAuthenticated) {
      toast.error("Please sign in to proceed with booking payment.");
      navigate("/signin");
      return;
    }

    // Request pricing quote from API
    setIsFetchingQuote(true);
    try {
      const fleet_id = vehicleId || (await getFleetIdForCategory(values.fleetClass));
      let quoteRes;

      if (bookingTab === "Hourly Service") {
        quoteRes = await requestQuote({
          fleet_id,
          hours: Number(values.hours),
          pricing_type: "hourly",
        });
      } else {
        const distance = calculateHaversineDistance(
          values.pickup.latitude!,
          values.pickup.longitude!,
          values.dropoff.latitude!,
          values.dropoff.longitude!
        );
        quoteRes = await requestQuote({
          fleet_id,
          distance_km: distance,
          pickup_latitude: values.pickup.latitude!,
          pickup_longitude: values.pickup.longitude!,
          dropoff_latitude: values.dropoff.latitude!,
          dropoff_longitude: values.dropoff.longitude!,
          pickup_location: values.pickup.address.trim(),
          dropoff_location: values.dropoff.address.trim(),
        });
      }

      if (quoteRes && quoteRes.success && quoteRes.data) {
        setQuoteData(quoteRes.data);
        setStep(2);
      } else {
        throw new Error(quoteRes.message || "Failed to calculate trip pricing quote.");
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to fetch pricing quote.";
      setBookingError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const onBookingSubmit = async (data: BookingForm) => {
    if (step === 1) {
      await handleNextStep();
      return;
    }

    if (quoteData?.status === "awaiting_admin") {
      toast.error("Waiting for admin to approve pricing quote before proceeding.");
      return;
    }

    if (quoteData?.status === "expired") {
      toast.error("Quote request expired. Please click 'Request New Quote'.");
      return;
    }

    setBookingError(null);
    setIsBookingSubmitting(true);

    try {
      // 1. Resolve fleet_id
      const fleet_id = vehicleId || (await getFleetIdForCategory(data.fleetClass));

      // 2. Format date and time
      const d = new Date(data.dateTime);
      const pickup_date = d.toISOString().split("T")[0];
      const pickup_time = d.toTimeString().split(" ")[0].substring(0, 5);

      // 3. Amount from backend quote
      const amount = quoteData?.amount || CATEGORY_PRICE_MAP[data.fleetClass] || 25;

      const isHourly = bookingTab === "Hourly Service";
      const payload = {
        service_type: BOOKING_SERVICE_TYPE_MAP[bookingTab],
        fleet_id,
        pickup_location: data.pickup.address.trim(),
        pickup_latitude: data.pickup.latitude!,
        pickup_longitude: data.pickup.longitude!,
        dropoff_location: (isHourly ? data.pickup.address : data.dropoff.address).trim(),
        dropoff_latitude: isHourly ? data.pickup.latitude! : data.dropoff.latitude!,
        dropoff_longitude: isHourly ? data.pickup.longitude! : data.dropoff.longitude!,
        pickup_date,
        pickup_time,
        passengers_count: Number(data.passengers),
        children_count: Number(data.childs || 0),
        hours: isHourly ? Number(data.hours) : null,
        passenger_name: data.passenger_name.trim(),
        passenger_email: data.passenger_email.trim(),
        phone_number: data.phone_number.trim(),
        payment_method: data.paymentMethod,
        special_requests: data.specialRequests?.trim() || "",
        addons: [],
        amount,
        currency: "KWD",
      };

      // 4. Create booking
      const result = await createBooking(payload);

      if (!result.success || !result.data?.id) {
        throw new Error(result.message || "Failed to create booking.");
      }

      const bookingId = result.data.id;

      // 5. Store booking ID in localStorage for redirect page retrieval
      localStorage.setItem("pending_booking_id", bookingId);

      // 6. Pay booking to get MyFatoorah checkout URL
      const payResult = await payBooking(bookingId, {
        amount,
        currency: "KWD",
        language: "en",
      });

      if (!payResult.success || !payResult.data?.checkout_url) {
        throw new Error(payResult.message || "Failed to create payment checkout page.");
      }

      toast.success("Redirecting to secure payment page...");

      // 7. Redirect the browser to MyFatoorah hosted page
      window.location.href = payResult.data.checkout_url;

    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Booking payment failed. Try again.";
      setBookingError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const selectedCategoryPrice = CATEGORY_PRICE_MAP[getValues("fleetClass")] || 25;

  return (
    <form noValidate onSubmit={handleSubmit(onBookingSubmit)}>
      {/* Step Indicator Progress Bar */}
      <div className="flex items-center justify-between border-b border-primary/10 px-8 py-3 bg-[#FFFBF0] text-xs font-semibold max-md:px-4">
        <div className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step === 1 ? "bg-maseer-green text-white" : "bg-maseer-green/20 text-maseer-green"}`}>1</span>
          <span className={step === 1 ? "text-maseer-green" : "text-maseer-muted"}>Trip Info</span>
        </div>
        <div className="h-0.5 flex-1 mx-4 bg-primary/10" />
        <div className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step === 2 ? "bg-maseer-green text-white" : "bg-primary/10 text-maseer-muted"}`}>2</span>
          <span className={step === 2 ? "text-maseer-green" : "text-maseer-muted"}>Passenger &amp; Payment</span>
        </div>
      </div>

      {step === 1 && (
        <>
          {/* tabs */}
          <div className="grid grid-cols-4 overflow-hidden border-b border-primary/30 p-8 max-md:grid-cols-2 max-md:p-4">
            {BOOKING_TABS.map((tab, index) => {
              const isActive = bookingTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setBookingTab(tab);
                    clearErrors();
                  }}
                  className={[
                    "font-lato py-3.5 text-center text-[12px] font-semibold transition-colors max-md:px-1 max-md:py-3 max-md:text-[10px]",
                    isActive
                      ? "bg-maseer-green text-white"
                      : "bg-[#FFF9EB] text-primary",
                    !isActive && index > 0 ? "border-l border-primary/20" : "",
                  ].join(" ")}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* fields */}
          <div className="px-6 pb-4 pt-6 max-md:px-4 lg:px-8">
            {/* pickup / dropoff */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Controller
                name="pickup"
                control={control}
                rules={{
                  validate: (value) =>
                    value.address.trim().length >= 2 ||
                    "Pick up location is required",
                }}
                render={({ field }) => (
                  <LocationMapField
                    label="Pick Up Location"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter Pickup Location"
                    required
                    error={errors.pickup?.message as string | undefined}
                  />
                )}
              />
              {bookingTab !== "Hourly Service" ? (
                <Controller
                  name="dropoff"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.address.trim().length >= 2 ||
                      "Drop off location is required",
                  }}
                  render={({ field }) => (
                    <LocationMapField
                      label="Drop Off Location"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter DropOff Location"
                      required
                      error={errors.dropoff?.message as string | undefined}
                    />
                  )}
                />
              ) : (
                <div>
                  <FieldLabel>Duration (Hours)</FieldLabel>
                  <BookingInput icon={<Clock className="h-4 w-4 text-[#9ca3af]" />} hasError={!!errors.hours}>
                    <input
                      {...register("hours", {
                        required: "Duration is required",
                        validate: (v) => {
                          const num = Number(v);
                          if (!v || Number.isNaN(num)) return "Enter valid hours";
                          if (num < 1) return "Min 1 hour required";
                          if (num > 24) return "Max 24 hours allowed";
                          return true;
                        }
                      })}
                      type="number"
                      min={1}
                      max={24}
                      placeholder="1"
                      className="w-full bg-transparent font-lato text-[12px] text-[#333] outline-none"
                    />
                  </BookingInput>
                  <FieldError message={errors.hours?.message} />
                </div>
              )}
            </div>

            {/* class / date / passengers / children */}
            <div className="mt-5 grid grid-cols-2 gap-4 max-md:grid-cols-1 lg:grid-cols-4">
              {/* fleet class */}
              <div>
                <FieldLabel>Class</FieldLabel>
                <Controller
                  name="fleetClass"
                  control={control}
                  rules={{ required: "Please select a fleet class" }}
                  render={({ field }) => (
                    <Listbox
                      value={field.value}
                      onChange={field.onChange}
                      invalid={!!errors.fleetClass}
                    >
                      <div className="relative">
                        <BookingInput
                          icon={<ChevronDownIcon />}
                          hasError={!!errors.fleetClass}
                        >
                          <ListboxButton
                            onBlur={field.onBlur}
                            className="w-full cursor-pointer bg-transparent text-left font-lato text-[12px] outline-none"
                          >
                            <span
                              className={
                                field.value ? "text-[#333]" : "text-[#9ca3af]"
                              }
                            >
                              {field.value || "Select Category"}
                            </span>
                          </ListboxButton>
                        </BookingInput>
                        <ListboxOptions
                          anchor="bottom start"
                          className="z-[1050] mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-xl border border-[#e5e7eb] bg-white py-1 shadow-lg [--anchor-gap:4px] focus:outline-none"
                        >
                          {FLEET_CLASS_OPTIONS.map((opt) => (
                            <ListboxOption
                              key={opt}
                              value={opt}
                              className="cursor-pointer px-4 py-2.5 font-lato text-[12px] text-[#333] data-[focus]:bg-[#FFF9EB] data-[selected]:font-semibold data-[selected]:text-maseer-green"
                            >
                              {opt}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  )}
                />
                <FieldError message={errors.fleetClass?.message} />
              </div>

              {/* date & time */}
              <div>
                <FieldLabel>Date &amp; Time</FieldLabel>
                <Controller
                  name="dateTime"
                  control={control}
                  rules={{
                    required: "Date and time is required",
                    validate: validateDateTime,
                  }}
                  render={({ field }) => (
                    <BookingInput
                      icon={<CalendarDays className="h-4 w-4 text-primary" />}
                      hasError={!!errors.dateTime}
                    >
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date: Date | null) => {
                          field.onChange(date ? date.toISOString() : "");
                        }}
                        onBlur={field.onBlur}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="EEE, MMM d · h:mm aa"
                        minDate={new Date()}
                        filterTime={filterFutureTime}
                        placeholderText="Date and Time"
                        shouldCloseOnSelect={false}
                        showPopperArrow={false}
                        portalId="datepicker-portal"
                        calendarClassName="maseer-datepicker"
                        popperClassName="maseer-datepicker-popper"
                        popperPlacement="bottom-start"
                        className="w-full cursor-pointer bg-transparent font-lato text-[12px] text-[#333] outline-none placeholder:text-[#b0b0b0]"
                      />
                    </BookingInput>
                  )}
                />
                <FieldError message={errors.dateTime?.message} />
              </div>

              {/* passengers */}
              <div>
                <FieldLabel>Passengers</FieldLabel>
                <BookingInput icon={<PersonIcon />} hasError={!!errors.passengers}>
                  <input
                    {...register("passengers", {
                      required: "Passengers is required",
                      validate: (value) => {
                        const count = Number(value);
                        if (!value || Number.isNaN(count))
                          return "Enter number of passengers";
                        if (!Number.isInteger(count))
                          return "Must be a whole number";
                        if (count < 1) return "At least 1 passenger required";
                        if (count > 99) return "Maximum 99 passengers";
                        return true;
                      },
                    })}
                    type="number"
                    min={1}
                    max={99}
                    placeholder="00"
                    className="w-full bg-transparent font-lato text-[12px] text-[#333] outline-none placeholder:text-[#b0b0b0]"
                  />
                </BookingInput>
                <FieldError message={errors.passengers?.message} />
              </div>

              {/* children */}
              <div>
                <FieldLabel>Children</FieldLabel>
                <BookingInput icon={<PersonIcon />} hasError={!!errors.childs}>
                  <input
                    {...register("childs", {
                      validate: (value) => {
                        const count = Number(value || 0);
                        if (Number.isNaN(count)) return "Enter a valid number";
                        if (!Number.isInteger(count)) return "Must be a whole number";
                        if (count < 0) return "Cannot be negative";
                        if (count > 99) return "Maximum 99 children";
                        return true;
                      },
                    })}
                    type="number"
                    min={0}
                    max={99}
                    placeholder="0"
                    className="w-full bg-transparent font-lato text-[12px] text-[#333] outline-none placeholder:text-[#b0b0b0]"
                  />
                </BookingInput>
                <FieldError message={errors.childs?.message} />
              </div>
            </div>

            {bookingError && (
              <p className="mt-4 text-center font-lato text-[12px] text-red-600" role="alert">
                {bookingError}
              </p>
            )}

            {/* next step button */}
            <LoadingButton
              type="button"
              onClick={handleNextStep}
              loading={isFetchingQuote}
              loadingText="Calculating price quote..."
              className="mx-auto mt-8 block w-full max-w-[360px] rounded-xl bg-maseer-green py-3.5 font-lato text-[15px] font-semibold text-white transition hover:bg-maseer-green-deep disabled:opacity-50"
            >
              Continue to Details
            </LoadingButton>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="px-6 pb-6 pt-6 max-md:px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-5 flex items-center gap-1.5 font-lato text-xs font-semibold text-maseer-green hover:underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Trip Details
          </button>

          {/* Awaiting Admin Pricing Screen */}
          {quoteData?.status === "awaiting_admin" ? (
            <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center space-y-4 shadow-sm my-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 animate-pulse">
                <Clock className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold text-amber-900">
                  Awaiting Chauffeur Admin Rate Quote
                </h4>
                <p className="font-lato text-xs text-amber-800 max-w-md mx-auto">
                  Your trip distance is <strong>{quoteData.distance_km ?? "45+"} km</strong> (&gt; 45 km threshold). Our Admin team is assigning a custom long-distance price for your ride.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 rounded-xl bg-white px-5 py-2.5 shadow-sm border border-amber-200">
                <span className="font-lato text-xs text-gray-600">Quote Expires In:</span>
                <span className="font-mono text-base font-black text-red-600">
                  {formatCountdown(remainingSeconds)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-lato text-amber-700">
                <LoadingSpinner />
                <span>Polling admin response live...</span>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 text-xs font-bold text-maseer-green hover:underline block mx-auto"
              >
                ← Modify Trip Locations
              </button>
            </div>
          ) : quoteData?.status === "expired" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-4 shadow-sm my-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Clock className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-red-900">
                  Quote Request Expired
                </h4>
                <p className="font-lato text-xs text-red-700 max-w-md mx-auto">
                  The 15-minute window for admin pricing has passed. Please request a new price quote for your trip.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="rounded-xl bg-maseer-green px-6 py-3 font-lato text-xs font-bold text-white hover:bg-maseer-green-deep shadow-md"
              >
                Request New Quote
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Passenger Fields */}
              <div className="lg:col-span-3 space-y-4">
                <h3 className="font-serif text-lg font-semibold text-maseer-green-text">
                  Passenger Information
                </h3>

                {/* Name */}
                <div>
                  <FieldLabel>Passenger Full Name</FieldLabel>
                  <BookingInput icon={<User className="h-4 w-4 text-[#9ca3af]" />} hasError={!!errors.passenger_name}>
                    <input
                      {...register("passenger_name", {
                        required: "Passenger name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                      })}
                      type="text"
                      placeholder="Ali Khan"
                      className="w-full bg-transparent font-lato text-[12px] text-[#333] outline-none"
                    />
                  </BookingInput>
                  <FieldError message={errors.passenger_name?.message} />
                </div>

                {/* Email */}
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <BookingInput icon={<Mail className="h-4 w-4 text-[#9ca3af]" />} hasError={!!errors.passenger_email}>
                    <input
                      {...register("passenger_email", {
                        required: "Passenger email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      placeholder="ali@email.com"
                      className="w-full bg-transparent font-lato text-[12px] text-[#333] outline-none"
                    />
                  </BookingInput>
                  <FieldError message={errors.passenger_email?.message} />
                </div>

                {/* Phone */}
                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <BookingInput icon={<Phone className="h-4 w-4 text-[#9ca3af]" />} hasError={!!errors.phone_number}>
                    <input
                      {...register("phone_number", {
                        required: "Phone number is required",
                        minLength: { value: 8, message: "Invalid phone number" },
                      })}
                      type="tel"
                      placeholder="+96550000000"
                      className="w-full bg-transparent font-lato text-[12px] text-[#333] outline-none"
                    />
                  </BookingInput>
                  <FieldError message={errors.phone_number?.message} />
                </div>

                {/* Special Requests */}
                <div>
                  <FieldLabel>Special Requests (Optional)</FieldLabel>
                  <div className="flex rounded-xl border border-[#e5e7eb] bg-white p-3.5 focus-within:border-maseer-gold">
                    <span className="mt-1 shrink-0"><MessageSquare className="h-4 w-4 text-[#9ca3af] mr-2" /></span>
                    <textarea
                      {...register("specialRequests")}
                      rows={2}
                      placeholder="E.g., child safety seat details, specific routes..."
                      className="w-full resize-none bg-transparent font-lato text-[12px] text-[#333] outline-none placeholder:text-[#b0b0b0]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Summary Sidebar */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-maseer-green-deep to-[#05280b] p-5 text-white shadow-md">
                  <h4 className="font-serif text-sm font-semibold tracking-wide text-maseer-gold">
                    BOOKING SUMMARY
                  </h4>

                  <div className="mt-4 space-y-2 border-b border-white/10 pb-4 text-xs font-lato text-white/80">
                    <div className="flex justify-between">
                      <span>Vehicle Class:</span>
                      <strong className="text-white">{getValues("fleetClass") || vehicleName || "Luxury Fleet"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <strong className="text-white">{bookingTab}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Date/Time:</span>
                      <strong className="text-white">
                        {getValues("dateTime") ? new Date(getValues("dateTime")).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "Not set"}
                      </strong>
                    </div>
                    {bookingTab === "Hourly Service" && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <strong className="text-white">{getValues("hours")} hour(s)</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Passengers:</span>
                      <strong className="text-white">
                        {getValues("passengers")} adults, {getValues("childs") || "0"} children
                      </strong>
                    </div>

                    {quoteData?.distance_km && (
                      <div className="flex justify-between">
                        <span>Trip Distance:</span>
                        <strong className="text-maseer-gold">{quoteData.distance_km} km</strong>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block font-lato text-xs text-white/70">Calculated Rate:</span>
                        {quoteData?.pricing_mode && (
                          <span className="inline-block rounded-md bg-white/10 px-2 py-0.5 text-[9px] uppercase font-bold text-maseer-gold border border-maseer-gold/30">
                            {quoteData.pricing_mode === "hourly"
                              ? "Hourly Rate"
                              : quoteData.pricing_mode === "fixed"
                              ? "Fixed Rate (≤ 45 km)"
                              : "Admin Custom Quote"}
                          </span>
                        )}
                      </div>
                      <span className="font-serif text-2xl font-black text-maseer-gold">
                        {quoteData?.amount ?? selectedCategoryPrice} KWD
                      </span>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-2">
                      <span className="block font-lato text-[11px] uppercase tracking-wide text-white/60">
                        Payment Method
                      </span>
                      <label className="flex cursor-pointer items-center justify-between rounded-xl bg-white/10 p-3 hover:bg-white/15 border border-white/10">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-maseer-gold" />
                          <span className="font-lato text-xs font-semibold">Credit/Debit Card</span>
                        </div>
                        <input
                          type="radio"
                          value="card"
                          checked
                          readOnly
                          className="h-3.5 w-3.5 accent-maseer-gold"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {bookingError && (
                  <p className="text-center font-lato text-[11px] text-red-500" role="alert">
                    {bookingError}
                  </p>
                )}

                {/* Submit / Pay Button */}
                <LoadingButton
                  type="submit"
                  loading={isBookingSubmitting}
                  loadingText="Securing payment..."
                  className="block w-full rounded-xl bg-maseer-gold py-4 text-center font-lato text-sm font-bold text-[#101828] hover:bg-[#d8a400] transition active:scale-[0.99] disabled:opacity-50"
                >
                  Proceed to Payment ({quoteData?.amount ?? selectedCategoryPrice} KWD)
                </LoadingButton>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

/* ─── modal ─────────────────────────────────────────────────────────────────── */

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
  initialData?: Partial<BookingForm>;
};

export function BookingModal({
  isOpen,
  onClose,
  vehicleId,
  vehicleName,
  initialData,
}: BookingModalProps) {
  if (!isOpen) return null;

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book a vehicle"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* panel */}
      <div className="relative z-10 h-[620px] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.22)] max-md:h-auto max-md:max-h-[92vh] max-md:rounded-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-8 pb-4 pt-6 max-md:px-4">
          <div>
            <h2 className="font-serif text-[22px] font-semibold text-maseer-green-text">
              Book Your Ride
            </h2>
            {vehicleName && (
              <p className="mt-0.5 font-lato text-[13px] text-maseer-muted">
                {vehicleName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-maseer-line/60 text-maseer-muted transition hover:bg-maseer-cream hover:text-maseer-green-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <hr className="border-maseer-line/50" />

        {/* form */}
        <BookingFormBody
          vehicleId={vehicleId}
          vehicleName={vehicleName}
          onSuccess={onClose}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
