import { type ReactNode, useState } from "react";
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
import { CalendarDays, X } from "lucide-react";
import {
  BOOKING_SERVICE_TYPE_MAP,
  createBooking,
  type BookingLocation,
  type BookingServiceTab,
} from "../api/booking";
import { LocationMapField } from "./LocationMapField";
import { LoadingButton } from "./Spinner";

/* ─── types ────────────────────────────────────────────────────────────────── */

type BookingTab = BookingServiceTab;

type BookingForm = {
  pickup: BookingLocation;
  dropoff: BookingLocation;
  fleetClass: string;
  dateTime: string;
  passengers: string;
  childs: string;
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

function BookingFormBody({
  vehicleId,
  onSuccess,
}: {
  vehicleId?: string;
  onSuccess?: () => void;
}) {
  const [bookingTab, setBookingTab] = useState<BookingTab>("Airport Transfer");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<BookingForm>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      pickup: emptyLocation(),
      dropoff: emptyLocation(),
      fleetClass: "",
      dateTime: "",
      passengers: "",
      childs: "0",
    },
  });

  const onBookingSubmit = async (data: BookingForm) => {
    setBookingError(null);
    setBookingSuccess(null);

    if (data.pickup.latitude == null || data.pickup.longitude == null) {
      const msg = "Please set pick up location on the map.";
      setBookingError(msg);
      toast.error(msg);
      return;
    }

    const isHourly = bookingTab === "Hourly Service";
    const dropoffLocation = isHourly ? data.pickup : data.dropoff;

    if (
      !isHourly &&
      (dropoffLocation.latitude == null || dropoffLocation.longitude == null)
    ) {
      const msg = "Please set drop off location on the map.";
      setBookingError(msg);
      toast.error(msg);
      return;
    }

    setIsBookingSubmitting(true);

    try {
      const payload = {
        service_type: BOOKING_SERVICE_TYPE_MAP[bookingTab],
        pick_up_location: data.pickup.address.trim(),
        drop_off_location: (
          dropoffLocation.address || data.pickup.address
        ).trim(),
        pick_up_latitude: data.pickup.latitude,
        pick_up_longitude: data.pickup.longitude,
        drop_off_latitude: dropoffLocation.latitude ?? data.pickup.latitude,
        drop_off_longitude:
          dropoffLocation.longitude ?? data.pickup.longitude,
        class: data.fleetClass,
        date_and_time: new Date(data.dateTime).toISOString(),
        passengers: Number(data.passengers),
        childs: Number(data.childs || 0),
        ...(vehicleId ? { vehicle_id: vehicleId } : {}),
      };

      const result = await createBooking(payload);
      const successMsg = result.message || "Booking created successfully! 🎉";
      setBookingSuccess(successMsg);
      toast.success(successMsg);
      reset({
        pickup: emptyLocation(),
        dropoff: emptyLocation(),
        fleetClass: "",
        dateTime: "",
        passengers: "",
        childs: "0",
      });
      onSuccess?.();
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Booking failed. Try again.";
      setBookingError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onBookingSubmit)}>
      {/* tabs */}
      <div className="grid grid-cols-4 p-8  overflow-hidden rounded-t-2xl border-b border-primary/30">
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
                "font-lato py-3.5 text-center text-[12px] font-semibold transition-colors",
                isActive
                  ? [
                      "bg-maseer-green text-white",
                      index === 0 ? "rounded-tl-2xl" : "",
                      index === BOOKING_TABS.length - 1
                        ? "rounded-tr-2xl"
                        : "",
                    ].join(" ")
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
      <div className="px-6 pb-4 pt-6 lg:px-8">
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
          ) : null}
        </div>

        {/* class / date / passengers / children */}
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                    }) => (
                      <div className="flex items-center justify-between px-3 py-3">
                        <button
                          type="button"
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-30"
                        >
                          ‹
                        </button>
                        <span className="font-lato text-sm font-bold tracking-wide text-white">
                          {date.toLocaleString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-30"
                        >
                          ›
                        </button>
                      </div>
                    )}
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

        {/* status messages */}
        {bookingError && (
          <p
            className="mt-4 text-center font-lato text-[12px] text-red-600"
            role="alert"
          >
            {bookingError}
          </p>
        )}
        {bookingSuccess && (
          <p
            className="mt-4 text-center font-lato text-[12px] text-maseer-green"
            role="status"
          >
            {bookingSuccess}
          </p>
        )}

        {/* submit */}
        <LoadingButton
          type="submit"
          loading={isBookingSubmitting}
          loadingText="Booking..."
          className="mx-auto mt-6 block w-full max-w-[360px] rounded-xl bg-maseer-green py-3.5 font-lato text-[15px] font-semibold text-white transition hover:bg-maseer-green-deep disabled:cursor-not-allowed disabled:opacity-70"
        >
          Book Your Ride
        </LoadingButton>
      </div>
    </form>
  );
}

/* ─── modal ─────────────────────────────────────────────────────────────────── */

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  vehicleName?: string;
};

export function BookingModal({
  isOpen,
  onClose,
  vehicleId,
  vehicleName,
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
      <div className="relative z-10 w-full max-w-3xl h-[600px] overflow-y-auto rounded-[32px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.22)]">
        {/* header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4">
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
        <BookingFormBody vehicleId={vehicleId} onSuccess={onClose} />
      </div>
    </div>
  );
}
