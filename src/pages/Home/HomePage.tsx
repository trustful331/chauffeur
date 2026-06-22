import { useState, type ReactNode } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { images } from "../../assets/images";
import { GoldOffsetImage } from "../../ui/GoldOffsetImage";
import { HeroBackground } from "../../ui/HeroBackground";
import { LocationMapField } from "../../ui/LocationMapField";
import { LoadingButton } from "../../ui/Spinner";
import {
  BOOKING_SERVICE_TYPE_MAP,
  createBooking,
  type BookingLocation,
  type BookingServiceTab,
} from "src/api/booking";
import { ContactCallbackForm } from "./ContactCallbackForm";

const SlickSlider =
  (Slider as unknown as { default?: typeof Slider }).default ?? Slider;

type BookingTab = BookingServiceTab;

type BookingForm = {
  pickup: BookingLocation;
  dropoff: BookingLocation;
  fleetClass: string;
  dateTime: string;
  passengers: string;
  childs: string;
};

const emptyLocation = (): BookingLocation => ({
  address: "",
  latitude: null,
  longitude: null,
});

const CONTACT_INFO_CARDS = [
  {
    title: "Call us Now",
    subtitle: "Available 24/7 for bookings",
    detail: "(555) 123-RIDE",
  },
  {
    title: "Email Support",
    subtitle: "Quick Response Guaranteed",
    detail: "Support@mail.com",
  },
  {
    title: "Live Chat",
    subtitle: "Instant help when you need it",
    cta: "Start Chat",
  },
  {
    title: "Chat on Whatsapp",
    detail: "(555) 123-RIDE",
  },
  {
    title: "Customer Support",
    subtitle: "24/7 Customer Support",
    detail: "Rides available 24/7",
  },
] as const;

const BOOKING_TABS: BookingTab[] = [
  "Airport Transfer",
  "A to B Transfer",
  "Hourly Service",
  "Daily Service",
];

const FLEET_CLASS_OPTIONS = [
  "First Class",
  "Economy Class",
];

function GoldHeading({
  before,
  accent,
  after = "",
}: {
  before: string;
  accent: string;
  after?: string;
}) {
  return (
    <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-[#1a1a1a]">
      {before}
      <span className="text-maseer-gold">{accent}</span>
      {after}
    </h2>
  );
}

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

function CalendarIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0 text-primary"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <rect
        x="2"
        y="3"
        width="12"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M2 6h12M5 1.5V4M11 1.5V4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0 text-primary"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle cx="8" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3.5 14c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
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

function validateDateTime(value: string) {
  if (!value) return "Date and time is required";
  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) {
    return "Enter a valid date and time";
  }
  if (selected <= new Date()) {
    return "Please select a future date and time";
  }
  return true;
}

function filterFutureTime(time: Date) {
  const now = new Date();
  if (time.toDateString() === now.toDateString()) {
    return time.getTime() > now.getTime();
  }
  return true;
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
        "flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 focus-within:border-primary/60",
        hasError ? "border-red-400" : "border-[#e5e7eb]",
      ].join(" ")}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {icon}
    </div>
  );
}

const servicesCards = [
  {
    title: "Airport Transfers",
    text: "Discreet meet & greet at KKIA, KAIA and beyond.",
    icon: "airplane",
  },
  {
    title: "Hourly Chauffeur",
    text: "A car and chauffeur at your disposal — by the hour.",
    icon: "clock",
  },
  {
    title: "Corporate Mobility",
    text: "Programmatic ground service for executive teams.",
    icon: "briefcase",
  },
  {
    title: "VIP Tourism",
    text: "From AlUla to NEOM — bespoke journeys curated.",
    icon: "crown",
  },
] as const;

function ServiceCardIcon({
  type,
}: {
  type: (typeof servicesCards)[number]["icon"];
}) {
  const className = "h-5 w-5 text-primary";
  switch (type) {
    case "airplane":
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M10 2l2.5 6H18l-5 4 2 6-5-3.5L5 18l2-6-5-4h5.5L10 2z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "clock":
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle
            cx="10"
            cy="10"
            r="7"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M10 6v4l3 2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "briefcase":
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect
            x="3"
            y="7"
            width="14"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M7 7V5.5A1.5 1.5 0 018.5 4h3A1.5 1.5 0 0113 5.5V7M3 10h14"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );
    case "crown":
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M3 14h14M4 14l1.5-7 3 4 1.5-5 1.5 5 3-4L16 14"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

const hospitalityFeatures = [
  "Punctual & Professional",
  "Luxury Fleet",
  "24/7 Support",
  "Safe and Secure",
  "Bilingual Chauffeurs",
  "Discreet Privacy",
];

const coverageLarge = [
  {
    title: "Airport Transfer Service",
    subtitle: "Enjoy professional and seamless airport transfers.",
    image: images.services.coverage[0],
  },
  {
    title: "Hourly Service",
    subtitle: "Travel in luxury with our VIP hourly chauffeur service.",
    image: images.services.coverage[1],
  },
];

const coverageSmall = [
  {
    title: "Point To Point",
    subtitle: "Travel between destinations with comfort.",
    image: images.services.coverage[2],
  },
  {
    title: "Intercity",
    subtitle: "Book the hour for flexible intercity rides.",
    image: images.services.coverage[3],
  },
  {
    title: "Event Services",
    subtitle: "Luxury chauffeur service for any occasion.",
    image: images.services.coverage[4],
  },
];

const bestFeatures = [
  {
    icon: "clock",
    title: "24/7 Availablity",
    text: "Round-the-clock service whenever you need a ride, day or night",
  },
  {
    icon: "pin",
    title: "GPS Tracking for safty",
    text: "Real-time tracking keeps you informed and ensures your safety",
  },
  {
    icon: "pound",
    title: "Transparent Pricing",
    text: "No hidden fees - see exactly what you'll pay before you book",
  },
  {
    icon: "shield",
    title: "luggage Handling",
    text: "Specialized service for safe and secure luggage transportation",
  },
] as const;

function FeatureCardIcon({
  type,
}: {
  type: (typeof bestFeatures)[number]["icon"];
}) {
  const className = "h-7 w-7 text-white";
  switch (type) {
    case "clock":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 8v4l3 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "pin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="11"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "pound":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M14 6.5C14 4.57 12.43 3 10.5 3S7 4.57 7 6.5 8.57 10 10.5 10H14M10 10v11M6 14h8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3L4 6.5v6c0 5.2 3.4 10 8 11.5 4.6-1.5 8-6.3 8-11.5v-6L12 3z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

const fleetCards = [
  {
    id: "mercedes-s",
    title: "Mercedes-Benz S-Class",
    category: "BUSINESS",
    guests: 3,
    image: images.home.fleet[0],
  },
  {
    id: "audi-a8",
    title: "Mercedes-Benz S-Class",
    category: "BUSINESS",
    guests: 3,
    image: images.home.fleet[1],
  },
  {
    id: "cadillac-escalade",
    title: "Mercedes-Benz S-Class",
    category: "BUSINESS",
    guests: 3,
    image: images.home.fleet[2],
  },
  {
    id: "mercedes-v",
    title: "Mercedes-Benz S-Class",
    category: "BUSINESS",
    guests: 3,
    image: images.home.fleet[0],
  },
];

const reviews = [
  {
    quote:
      '"Absolutely fantastic service! The driver was professional, the car was spotless, and they handled my luggage with care."',
    name: "Emily Rodriguez",
  },
  {
    quote:
      '"Best chauffeur experience in Riyadh. On time, courteous, and the S-Class was immaculate. Highly recommended."',
    name: "James Al-Farsi",
  },
  {
    quote:
      '"Used Maseer for corporate events multiple times. Flawless coordination and VIP treatment every single trip."',
    name: "Sarah Mitchell",
  },
];

const faqItems = [
  {
    q: "How flexible are Maseer booking and cancellation policies?",
    a: "We offer flexible rescheduling and cancellation options for most bookings. Corporate clients receive tailored terms aligned with their mobility programs and service agreements.",
  },
  {
    q: "What corporate and event transportation options do you provide?",
    a: "Maseer provides dedicated corporate fleet programs, executive airport transfers, conference shuttles, and bespoke event logistics with account management and consolidated billing.",
  },
  {
    q: "Can I schedule a consultation before setting up a corporate account?",
    a: "Yes. Our corporate team offers onboarding consultations to understand your travel requirements, fleet preferences, and billing structure before activating your account.",
  },
  {
    q: "Do you provide transportation for large groups and delegations?",
    a: "Yes. We coordinate multi-vehicle deployments for delegations, conferences, and VIP groups with synchronized pickup schedules and on-ground coordination.",
  },
];

function FaqChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={[
        "h-3.5 w-3.5 shrink-0 transition-transform duration-300",
        open ? "rotate-180" : "",
      ].join(" ")}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [bookingTab, setBookingTab] = useState<BookingTab>("Airport Transfer");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

    // if (!isAuthenticated) {
    //   navigate("/signin", { state: { from: "/" } });
    //   return;
    // }

    if (data.pickup.latitude == null || data.pickup.longitude == null) {
      setBookingError("Please set pick up location on the map.");
      return;
    }

    const isHourly = bookingTab === "Hourly Service";
    const dropoffLocation = isHourly ? data.pickup : data.dropoff;

    if (
      !isHourly &&
      (dropoffLocation.latitude == null || dropoffLocation.longitude == null)
    ) {
      setBookingError("Please set drop off location on the map.");
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
        drop_off_longitude: dropoffLocation.longitude ?? data.pickup.longitude,
        class: data.fleetClass,
        date_and_time: new Date(data.dateTime).toISOString(),
        passengers: Number(data.passengers),
        childs: Number(data.childs || 0),
      };

      console.log("Booking payload:", payload);

      const result = await createBooking(payload);

      setBookingSuccess(result.message || "Booking created successfully.");
      reset({
        pickup: emptyLocation(),
        dropoff: emptyLocation(),
        fleetClass: "",
        dateTime: "",
        passengers: "",
        childs: "0",
      });
      navigate("/booking");
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Booking failed. Try again.",
      );
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const fleetSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.15,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2.15 } },
      { breakpoint: 768, settings: { slidesToShow: 1.1 } },
    ],
  };

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero + Booking — Figma node 201-203 */}
      <section className="relative w-full min-h-[640px] bg-maseer-green-deep">
        <HeroBackground
          image={images.home.hero}
          gradient="linear-gradient(90deg, rgba(7,58,11,0.88) 0%, rgba(7,58,11,0.45) 45%, rgba(7,58,11,0.15) 100%)"
        />
        <div className="page-container relative pb-[200px] pt-16">
          <h1 className="max-w-[650px] font-serif text-[44px] font-semibold leading-[1.5] text-white">
            <span className=" bg-primary text-white px-4 pb-1 rounded-2xl text-center h-[108.82px]">
              Luxury Chauffeur
            </span>{" "}
            and Mobility Services without limits Across Saudi Arabia
          </h1>
          <p className="mt-5 max-w-[660px] font-lato text-xl font-medium leading-8 text-white">
            Reliable airport transfers, executive transportation, city-to-city
            rides, and premium chauffeur experiences designed for corporates,
            VIP guests, travelers, and hospitality clients.
          </p>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 w-[calc(100%-232px)] max-w-[1100px] -translate-x-1/2 translate-y-1/2">
          <form
            noValidate
            onSubmit={handleSubmit(onBookingSubmit)}
            className=" p-5 rounded-[32px] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.14)]"
          >
            <div className="grid grid-cols-4 border-b border-primary/30">
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
                      "font-lato py-4 text-center text-[13px] font-semibold transition-colors",
                      isActive
                        ? [
                            "bg-maseer-green text-white",
                            index === 0 ? "rounded-tl-[32px]" : "",
                            index === BOOKING_TABS.length - 1
                              ? "rounded-tr-[32px]"
                              : "",
                          ].join(" ")
                        : "bg-[#FFF9EB] text-primary",
                      !isActive && index > 0
                        ? "border-l border-primary/20"
                        : "",
                    ].join(" ")}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="px-10 pb-0 pt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.35fr_1fr_0.7fr_0.7fr]">
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
                              className="w-full cursor-pointer bg-transparent text-left font-lato text-[13px] outline-none"
                            >
                              <span
                                className={
                                  field.value ? "text-[#333]" : "text-[#9ca3af]"
                                }
                              >
                                {field.value || "Select Fleet Category"}
                              </span>
                            </ListboxButton>
                          </BookingInput>
                          <ListboxOptions
                            anchor="bottom start"
                            className="z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-xl border border-[#e5e7eb] bg-white py-1 shadow-lg [--anchor-gap:4px] focus:outline-none"
                          >
                            {FLEET_CLASS_OPTIONS.map((opt) => (
                              <ListboxOption
                                key={opt}
                                value={opt}
                                className="cursor-pointer px-4 py-2.5 font-lato text-[13px] text-[#333] data-[focus]:bg-[#FFF9EB] data-[selected]:font-semibold data-[selected]:text-maseer-green"
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
                        icon={<CalendarIcon />}
                        hasError={!!errors.dateTime}
                      >
                        <DatePicker
                          selected={
                            field.value ? new Date(field.value) : null
                          }
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
                          className="w-full cursor-pointer bg-transparent font-lato text-[13px] text-[#333] outline-none placeholder:text-[#b0b0b0]"
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
                                aria-label="Previous month"
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
                                aria-label="Next month"
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
                <div>
                  <FieldLabel>Passengers</FieldLabel>
                  <BookingInput
                    icon={<PersonIcon />}
                    hasError={!!errors.passengers}
                  >
                    <input
                      {...register("passengers", {
                        required: "Number of passengers is required",
                        validate: (value) => {
                          const count = Number(value);
                          if (!value || Number.isNaN(count)) {
                            return "Enter number of passengers";
                          }
                          if (!Number.isInteger(count)) {
                            return "Passengers must be a whole number";
                          }
                          if (count < 1) return "At least 1 passenger required";
                          if (count > 99)
                            return "Maximum 99 passengers allowed";
                          return true;
                        },
                      })}
                      type="number"
                      min={1}
                      max={99}
                      placeholder="00"
                      className="w-full bg-transparent font-lato text-[13px] text-[#333] outline-none placeholder:text-[#b0b0b0]"
                    />
                  </BookingInput>
                  <FieldError message={errors.passengers?.message} />
                </div>
                <div>
                  <FieldLabel>Children</FieldLabel>
                  <BookingInput
                    icon={<PersonIcon />}
                    hasError={!!errors.childs}
                  >
                    <input
                      {...register("childs", {
                        validate: (value) => {
                          const count = Number(value || 0);
                          if (Number.isNaN(count))
                            return "Enter a valid number";
                          if (!Number.isInteger(count)) {
                            return "Children must be a whole number";
                          }
                          if (count < 0) return "Children cannot be negative";
                          if (count > 99) return "Maximum 99 children allowed";
                          return true;
                        },
                      })}
                      type="number"
                      min={0}
                      max={99}
                      placeholder="0"
                      className="w-full bg-transparent font-lato text-[13px] text-[#333] outline-none placeholder:text-[#b0b0b0]"
                    />
                  </BookingInput>
                  <FieldError message={errors.childs?.message} />
                </div>
              </div>

              {bookingError ? (
                <p
                  className="mt-6 text-center font-lato text-[13px] text-red-600"
                  role="alert"
                >
                  {bookingError}
                </p>
              ) : null}
              {bookingSuccess ? (
                <p
                  className="mt-6 text-center font-lato text-[13px] text-maseer-green"
                  role="status"
                >
                  {bookingSuccess}
                </p>
              ) : null}

              <LoadingButton
                type="submit"
                loading={isBookingSubmitting}
                loadingText="Booking..."
                className="mx-auto mt-8 block w-full max-w-[420px] rounded-xl bg-maseer-green py-3.5 font-lato text-[16px] font-semibold text-white transition hover:bg-maseer-green-deep disabled:cursor-not-allowed disabled:opacity-70"
              >
                Book Your Ride
              </LoadingButton>
            </div>
          </form>
        </div>
      </section>

      <div className="h-[240px]" />

      {/* An itinerary, composed */}
      <section className="page-container py-16">
        <div className="flex items-start justify-between gap-10">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
                SERVICES
              </p>
            </div>
            <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text">
              An itinerary, <span className="text-primary">composed.</span>
            </h2>
            <p className="mt-4 max-w-[520px] font-lato text-[14px] leading-[22px] text-maseer-green-text/80">
              From the door of your residence to the door of your private jet —
              every detail attended to.
            </p>
          </div>
          <Link
            to="/services"
            className="shrink-0 border-b border-maseer-green-text/30 pb-0.5 font-lato text-sm font-semibold text-maseer-green-text transition hover:border-primary hover:text-primary"
          >
            All services ↗
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-4 gap-6">
          {servicesCards.map((card) => (
            <article
              key={card.title}
              className="flex min-h-[220px] flex-col rounded-2xl bg-maseer-surface-card p-7"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <ServiceCardIcon type={card.icon} />
              </div>
              <h3 className="font-serif text-[22px] font-semibold leading-tight text-maseer-green-text">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 font-lato text-[12.5px] leading-[18px] text-maseer-muted">
                {card.text}
              </p>
              <Link
                to="/services"
                aria-label={`Learn more about ${card.title}`}
                className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-maseer-surface text-sm text-maseer-green transition hover:bg-maseer-green hover:text-white"
              >
                →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Hospitality on wheels */}
      <section className="bg-maseer-tint-green py-[53px]">
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-[549px_1fr]">
          <GoldOffsetImage
            src={images.home.wheels}
            alt="Hospitality on wheels"
            offset="right"
          />
          <div>
            <p className="eyebrow">THE MASEER EXPERIENCE</p>
            <h2 className="mt-3 font-serif text-figma-h2 font-medium text-maseer-green-text">
              Hospitality on <span className="text-maseer-gold">wheels.</span>
            </h2>
            <p className="mt-4 text-[14px] leading-6 text-maseer-muted">
              Every Maseer journey is choreographed — chilled water, scented
              cabin, climate prepared, music to your taste. The car is ready
              before you ever step out.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              {hospitalityFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-maseer-green text-[10px] text-white">
                    ✓
                  </span>
                  <span className="text-[12px] font-semibold text-[#2d2d2d]">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="page-container py-16">
        <GoldHeading before="Our, " accent="Service Coverage" />
        <p className="mt-3 text-[14px] text-maseer-muted">
          From the door of your residence to the door of your private jet —
          every detail attended to.
        </p>
        <div className="mt-10 space-y-3">
          <div className="grid grid-cols-[1.55fr_1fr] gap-3">
            {coverageLarge.map((item) => (
              <div
                key={item.title}
                className="card-image h-[280px]"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%), url(${item.image})`,
                }}
              >
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-serif text-[26px] font-medium">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] text-white/80">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {coverageSmall.map((item) => (
              <div
                key={item.title}
                className="card-image h-[240px]"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%), url(${item.image})`,
                }}
              >
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="font-serif text-[22px] font-medium">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12px] text-white/80">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Feature */}
      <section className="page-container py-16">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-0.5 w-9 bg-primary" aria-hidden />
          <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
            FEATURES
          </p>
        </div>
        <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text">
          Our, <span className="text-primary">Best Feature.</span>
        </h2>
        <p className="mt-4 max-w-[520px] font-lato text-[14px] leading-[22px] text-maseer-green-text/80">
          From the door of your residence to the door of your private jet —
          every detail attended to.
        </p>

        <div className="mt-12 grid grid-cols-4 gap-6">
          {bestFeatures.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl bg-maseer-surface-card px-6 py-8 text-center"
            >
              <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary">
                <FeatureCardIcon type={f.icon} />
              </div>
              <h3 className="mt-6 font-lato text-[17px] font-bold leading-snug text-maseer-green-text">
                {f.title}
              </h3>
              <p className="mt-3 font-lato text-[13px] leading-5 text-maseer-green-text/75">
                {f.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Fleet slider */}
      <section className="overflow-hidden py-16">
        <div className="page-container">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-0.5 w-9 bg-primary" aria-hidden />
            <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
              OUR FLEET
            </p>
          </div>
          <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text">
            Explore our,{" "}
            <span className="text-maseer-gold">Exquisite Fleet</span>
          </h2>
          <p className="mt-4 max-w-[560px] font-lato text-[14px] leading-[22px] text-maseer-muted">
            Chauffeur-driven sedans, executive SUVs and electric flagships —
            pristine, private, immaculate.
          </p>

          <div className="fleet-carousel mt-12 overflow-hidden">
            <SlickSlider {...fleetSettings}>
              {fleetCards.map((car, index) => (
                <div key={`${car.id}-${index}`}>
                  <article
                    className={[
                      "h-full px-6 lg:px-8",
                      index > 0 ? "border-l border-maseer-gold/55" : "",
                    ].join(" ")}
                  >
                    <img
                      src={car.image}
                      alt={car.title}
                      className="mx-auto h-[200px] w-full max-w-[340px] object-contain"
                    />
                    <p className="mt-8 font-lato text-[10px] font-bold uppercase tracking-[0.14em] text-maseer-muted">
                      {car.category} • {car.guests} GUESTS
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <h3 className="font-serif text-[22px] font-medium leading-tight text-maseer-green-text">
                        {car.title}
                      </h3>
                      <Link
                        to={`/fleet/${car.id}`}
                        className="link-arrow shrink-0 whitespace-nowrap pb-1"
                      >
                        View Details <span aria-hidden>↗</span>
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </SlickSlider>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-maseer-surface py-16">
        <div className="page-container">
          <GoldHeading before="What our, " accent="Customers Say" />
          <p className="mt-3 text-[14px] text-maseer-muted">
            Trusted by hundreds of happy customers
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {reviews.map((r) => (
              <article
                key={r.name}
                className="rounded-xl border border-[#ebebeb] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
              >
                <div className="text-[#e6b422]">★★★★★</div>
                <p className="mt-4 text-[14px] italic leading-[22px] text-[#444]">
                  {r.quote}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-[#eee] pt-5">
                  <img
                    src={images.home.fleet[0]}
                    alt={r.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="text-[14px] font-semibold text-[#1a1a1a]">
                    {r.name}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="bg-maseer-tint-contact py-16">
        <div className="page-container">
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
                CONTACT US
              </p>
            </div>
            <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text">
              Get in, <span className="text-primary">Touch</span>
            </h2>
            <p className="mt-4 font-lato text-[14px] text-maseer-muted">
              Need help or having questions
            </p>
          </div>

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-8">
            <ContactCallbackForm />

            <div className="space-y-3">
              {CONTACT_INFO_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-[#e8e8e8] bg-white px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-lato text-[15px] font-bold text-maseer-green-text">
                        {card.title}
                      </p>
                      {"subtitle" in card && card.subtitle && (
                        <p className="mt-1 font-lato text-[13px] text-maseer-muted">
                          {card.subtitle}
                        </p>
                      )}
                      {"detail" in card && card.detail && (
                        <p className="mt-1 font-lato text-[13px] text-maseer-muted">
                          {card.detail}
                        </p>
                      )}
                    </div>
                    {"cta" in card && card.cta && (
                      <button
                        type="button"
                        className="shrink-0 rounded-lg bg-maseer-green px-4 py-2 font-lato text-xs font-semibold text-white"
                      >
                        {card.cta}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-container pb-20 pt-16">
        <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-maseer-green-text">
          QUESTION ABOUT OUR SERVICE
        </p>
        <h2 className="mt-2 font-serif text-[40px] font-bold leading-[52px] text-maseer-green-text">
          Frequently asked Questions
        </h2>

        <div className="mt-8 border-t border-maseer-green/25">
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;

            return (
              <div key={item.q} className="border-b border-maseer-green/25">
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <p className="font-lato text-[15.91px] font-bold leading-snug text-maseer-green-text">
                    {item.q}
                  </p>
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-maseer-green transition-colors duration-300",
                      isOpen
                        ? "bg-maseer-green text-white"
                        : "text-maseer-green",
                    ].join(" ")}
                  >
                    <FaqChevron open={isOpen} />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={[
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[913px] pb-5 pr-14 font-lato text-[15.91px] leading-7 text-maseer-green-text/85">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
