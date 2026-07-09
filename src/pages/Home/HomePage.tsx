import { useState, useEffect, type ReactNode } from "react";
import { fetchServiceCoverages } from "src/api/admin/serviceCoverage";
import { fetchCustomerReviews } from "src/api/admin/customerReview";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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
import { CalendarDays } from "lucide-react";

const SlickSlider =
  (Slider as unknown as { default?: typeof Slider }).default ?? Slider;

const carouselSliderSettings = {
  dots: false,
  arrows: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3.15,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 2.15, slidesToScroll: 1 } },
    { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

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
  "Green Class",
  "Ultra Luxury",
  "Business Van",
  "VIP / Business Class",
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
    <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-[#1a1a1a] max-md:text-[28px] max-md:leading-[1.2]">
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

function PersonIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.1625 5.08127C11.098 5.08127 11.8563 4.32294 11.8563 3.3875C11.8563 2.45205 11.098 1.69373 10.1625 1.69373C9.22708 1.69373 8.46875 2.45205 8.46875 3.3875C8.46875 4.32294 9.22708 5.08127 10.1625 5.08127Z"
        fill="#F9BB00"
      />
      <path
        d="M13.4556 6.8682C13.1253 6.53791 12.5579 5.92815 11.4569 5.92815H9.30585C8.30973 5.92289 7.34705 5.56821 6.58562 4.92594C5.82418 4.28367 5.31229 3.39456 5.13918 2.41358C5.10931 2.21438 5.00928 2.03239 4.85712 1.90041C4.70495 1.76843 4.51065 1.69513 4.30923 1.69373C3.79263 1.69373 3.38612 2.15104 3.46234 2.65918C3.64678 3.75492 4.13388 4.77729 4.86865 5.61083C5.60343 6.44437 6.5566 7.05588 7.62055 7.37633V17.7846C7.62055 18.2503 8.00165 18.6314 8.46744 18.6314C8.93323 18.6314 9.31432 18.2503 9.31432 17.7846V13.5501H11.0081V17.7846C11.0081 18.2503 11.3892 18.6314 11.855 18.6314C12.3208 18.6314 12.7019 18.2503 12.7019 17.7846V8.51116L15.4458 11.2551C15.5242 11.3335 15.6173 11.3957 15.7197 11.4381C15.8222 11.4805 15.9319 11.5024 16.0428 11.5024C16.1537 11.5024 16.2635 11.4805 16.366 11.4381C16.4684 11.3957 16.5615 11.3335 16.6399 11.2551C16.7183 11.1767 16.7805 11.0836 16.8229 10.9811C16.8654 10.8787 16.8872 10.7689 16.8872 10.658C16.8872 10.5471 16.8654 10.4373 16.8229 10.3349C16.7805 10.2324 16.7183 10.1394 16.6399 10.061L13.4556 6.8682Z"
        fill="#F9BB00"
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

const fallbackServicesCards = [
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
];

function ServiceCardIcon({
  type,
}: {
  type: string;
}) {
  const className = "h-5 w-5 text-primary";
  const normalizedType = type.toLowerCase();
  
  if (normalizedType === "airplane" || normalizedType === "plane") {
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
  }
  if (normalizedType === "clock") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalizedType === "briefcase") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="7" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 7V5.5A1.5 1.5 0 018.5 4h3A1.5 1.5 0 0113 5.5V7M3 10h14" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  if (normalizedType === "crown") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M3 14h14M4 14l1.5-7 3 4 1.5-5 1.5 5 3-4L16 14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    );
  }
  if (normalizedType === "chauffeur") {
    return (
      <svg className={className} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.56947 4.54567C5.40888 4.75952 5.32356 4.9883 5.32356 5.23199C5.32356 6.5947 8.33471 8.32046 11.7122 8.32046C15.0897 8.32046 18.1009 6.5947 18.1009 5.23199C18.1009 4.9883 18.0156 4.75952 17.855 4.54567C19.0042 4.09806 19.7369 3.49628 19.7369 2.73038C19.742 0.939968 15.702 0 11.7172 0C7.72746 0 3.6875 0.939968 3.6875 2.73038C3.6875 3.49131 4.42523 4.09806 5.56947 4.54567Z" fill="currentColor" />
        <path d="M11.7112 9.31492C9.52305 9.31492 7.4052 8.65347 6 7.6936C6.38141 10.23 7.64108 14.8951 11.7112 14.8951C15.7762 14.8951 17.0359 10.23 17.4173 7.6936C16.0121 8.65347 13.8993 9.31492 11.7112 9.31492Z" fill="currentColor" />
        <path d="M14.0064 17.173L14.1469 18.4412L15.8583 15.109C15.6475 14.9698 15.4568 14.7907 15.2711 14.5918C14.5635 15.1936 13.7555 15.5865 12.8672 15.7705C13.4694 15.9247 13.9311 16.4668 14.0064 17.173Z" fill="currentColor" />
        <path d="M8.12339 14.5671C7.92767 14.786 7.71187 14.9948 7.46094 15.159L9.25257 18.6503L9.41819 17.1732C9.49848 16.467 9.95518 15.9249 10.5574 15.7707C9.65908 15.5817 8.84105 15.1789 8.12339 14.5671Z" fill="currentColor" />
        <path d="M18.7702 16.1784L16.7728 15.5269L12.2109 24.3994L12.4518 24.8669H22.9256C23.2016 24.8669 23.4275 24.6431 23.4275 24.3695V22.5592C23.4275 19.6548 21.5555 17.0885 18.7702 16.1784ZM20.1002 20.4953C20.0098 20.5649 19.8994 20.5997 19.789 20.5997C19.6435 20.5997 19.4929 20.535 19.3976 20.4107C18.971 19.8786 18.3989 19.4807 17.7414 19.2668C17.4805 19.1823 17.3349 18.8988 17.4202 18.6402C17.5106 18.3766 17.7916 18.2373 18.0576 18.3219C18.9007 18.5954 19.6334 19.1077 20.1855 19.794C20.3561 20.0128 20.316 20.3212 20.1002 20.4953Z" fill="currentColor" />
        <path d="M13.0168 17.2823C12.9817 16.959 12.7709 16.7153 12.52 16.7153H10.914C10.6631 16.7153 10.4523 16.9541 10.4172 17.2823L10.0859 20.2663L11.6517 23.31L13.3229 20.0624L13.0168 17.2823Z" fill="currentColor" />
        <path d="M11.0861 24.3991L6.53922 15.5664L4.65725 16.1781C1.86691 17.0883 0 19.6545 0 22.559V24.3693C0 24.6428 0.220818 24.8666 0.501859 24.8666H10.8452L11.0861 24.3991ZM5.68104 19.2666C5.02361 19.4805 4.45149 19.8783 4.02993 20.4105C3.92955 20.5348 3.78401 20.5995 3.63346 20.5995C3.52305 20.5995 3.41264 20.5646 3.3223 20.495C3.10651 20.321 3.06636 20.0126 3.24201 19.7938C3.78903 19.1074 4.52175 18.5952 5.36989 18.3217C5.63086 18.2371 5.91692 18.3764 6.00223 18.64C6.08755 18.8986 5.94703 19.1821 5.68104 19.2666Z" fill="currentColor" />
      </svg>
    );
  }
  if (normalizedType === "diamond") {
    return (
      <svg className={className} viewBox="0 0 29 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.2321 5.83831L23.5086 0.170038C23.4188 0.0628172 23.2861 0.000488281 23.1458 0.000488281H5.19621C5.05594 0.000488281 4.9232 0.0623743 4.83341 0.170038L0.109869 5.83831C-0.00775838 5.97908 -0.0332767 6.17509 0.0446621 6.34088C0.122601 6.50666 0.289328 6.61294 0.472606 6.61294H27.8693C28.0525 6.61294 28.2193 6.50666 28.2972 6.34088C28.3747 6.17559 28.3497 5.97952 28.2321 5.83831ZM1.48116 5.66827L5.41729 0.944721H22.9242L26.8604 5.66827H1.48116Z" fill="currentColor" />
        <path d="M14.6103 0.29144C14.5371 0.114805 14.3647 0 14.1739 0H5.19912C5.03002 0 4.87414 0.0902275 4.78961 0.237138C4.70509 0.384048 4.70553 0.564004 4.79105 0.710416L8.09753 6.37869C8.1712 6.50479 8.29924 6.59031 8.44471 6.60919C8.46502 6.61157 8.48534 6.61295 8.50516 6.61295C8.62987 6.61295 8.75032 6.56385 8.83961 6.47457L14.5079 0.80629C14.6429 0.671226 14.6836 0.468076 14.6103 0.29144ZM8.60435 5.37351L6.02102 0.944731H13.0331L8.60435 5.37351Z" fill="currentColor" />
        <path d="M28.2919 5.93082C28.2125 5.76974 28.0482 5.66772 27.8687 5.66772H0.472041C0.292527 5.66772 0.128623 5.76974 0.0488021 5.93082C-0.0305759 6.0919 -0.0121429 6.28415 0.0969603 6.4268L13.7953 24.3764C13.8846 24.4935 14.0235 24.5625 14.1708 24.5625C14.3182 24.5625 14.4571 24.4935 14.5454 24.3764L28.2438 6.4268C28.3529 6.28415 28.3712 6.09282 28.2919 5.93082ZM14.1708 23.3117L1.42712 6.61295H26.9145L14.1708 23.3117Z" fill="currentColor" />
        <path d="M14.621 23.9475L8.95276 5.99791C8.89043 5.8014 8.70853 5.66772 8.50212 5.66772H0.472041C0.292527 5.66772 0.128623 5.76974 0.0488021 5.93082C-0.0305759 6.0919 -0.0121429 6.28415 0.0969603 6.4268L13.7953 24.3764C13.8869 24.4968 14.0272 24.5625 14.1708 24.5625C14.2445 24.5625 14.3191 24.5455 14.3881 24.5086C14.5917 24.4033 14.6899 24.1662 14.621 23.9475ZM1.42668 6.61295H8.15588L12.9059 21.6547L1.42668 6.61295Z" fill="currentColor" />
        <path d="M23.5521 0.237138C23.468 0.0902275 23.3117 0 23.1426 0H14.1678C13.977 0 13.8045 0.114805 13.7313 0.29144C13.6581 0.468076 13.6987 0.671226 13.8338 0.80629L19.5021 6.47457C19.5909 6.56385 19.7113 6.61295 19.8361 6.61295C19.8564 6.61295 19.8767 6.61151 19.897 6.60919C20.042 6.59031 20.1705 6.50529 20.2442 6.37869L23.5507 0.710416C23.6357 0.564004 23.6362 0.384048 23.5521 0.237138ZM19.7369 5.37351L15.308 0.944731H22.3201L19.7369 5.37351Z" fill="currentColor" />
        <path d="M28.2895 5.9318C28.2101 5.77072 28.0457 5.6687 27.8662 5.6687H19.8361C19.6297 5.6687 19.4474 5.80238 19.3855 5.99889L13.7172 23.9484C13.6483 24.1667 13.7465 24.4038 13.9501 24.5096C14.0191 24.5455 14.0937 24.5625 14.1674 24.5625C14.3105 24.5625 14.4508 24.4969 14.5429 24.3774L28.2412 6.42783C28.3504 6.28507 28.3688 6.09282 28.2895 5.9318ZM15.4319 21.6546L20.1819 6.61288H26.9111L15.4319 21.6546Z" fill="currentColor" />
      </svg>
    );
  }
  if (normalizedType === "medal") {
    return (
      <svg className={className} viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.0439 8.85082C13.3012 8.85082 13.5098 8.64226 13.5098 8.385C13.5098 8.12774 13.3012 7.91919 13.0439 7.91919C12.7867 7.91919 12.5781 8.12774 12.5781 8.385C12.5781 8.64226 12.7867 8.85082 13.0439 8.85082Z" fill="currentColor" />
        <path d="M16.7705 12.5771C17.0278 12.5771 17.2363 12.3686 17.2363 12.1113C17.2363 11.8541 17.0278 11.6455 16.7705 11.6455C16.5132 11.6455 16.3047 11.8541 16.3047 12.1113C16.3047 12.3686 16.5132 12.5771 16.7705 12.5771Z" fill="currentColor" />
        <path d="M14.9071 4.19263C13.7095 4.19263 12.5387 4.54778 11.5428 5.21317C10.547 5.87857 9.77085 6.82432 9.31252 7.93083C8.85419 9.03734 8.73427 10.2549 8.96792 11.4296C9.20158 12.6042 9.77831 13.6832 10.6252 14.5301C11.4721 15.377 12.5511 15.9538 13.7258 16.1874C14.9004 16.4211 16.118 16.3012 17.2245 15.8428C18.331 15.3845 19.2768 14.6083 19.9422 13.6125C20.6076 12.6167 20.9627 11.4459 20.9627 10.2482C20.9609 8.64272 20.3223 7.10352 19.1871 5.96827C18.0518 4.83302 16.5126 4.19444 14.9071 4.19263ZM11.6464 8.38495C11.6464 8.10856 11.7284 7.83838 11.882 7.60857C12.0355 7.37876 12.2538 7.19965 12.5091 7.09388C12.7645 6.98811 13.0454 6.96044 13.3165 7.01436C13.5876 7.06828 13.8366 7.20137 14.032 7.39681C14.2275 7.59224 14.3606 7.84124 14.4145 8.11232C14.4684 8.3834 14.4407 8.66437 14.335 8.91972C14.2292 9.17507 14.0501 9.39332 13.8203 9.54688C13.5905 9.70043 13.3203 9.78239 13.0439 9.78239C12.6734 9.78198 12.3182 9.63462 12.0562 9.37264C11.7942 9.11066 11.6468 8.75545 11.6464 8.38495ZM12.9074 12.9066C12.8198 12.9926 12.7017 13.0406 12.5789 13.04C12.4561 13.0395 12.3385 12.9905 12.2517 12.9036C12.1649 12.8168 12.1159 12.6992 12.1153 12.5764C12.1147 12.4536 12.1627 12.3355 12.2487 12.2479L16.9069 7.5898C16.95 7.54591 17.0014 7.51099 17.058 7.48706C17.1147 7.46314 17.1756 7.45067 17.2371 7.45039C17.2986 7.45011 17.3596 7.46203 17.4165 7.48544C17.4733 7.50885 17.525 7.54331 17.5685 7.58681C17.612 7.63031 17.6465 7.682 17.6699 7.73889C17.6933 7.79578 17.7052 7.85674 17.7049 7.91826C17.7047 7.97978 17.6922 8.04063 17.6683 8.09731C17.6443 8.15398 17.6094 8.20536 17.5655 8.24846L12.9074 12.9066ZM16.7704 13.5089C16.494 13.5089 16.2238 13.4269 15.994 13.2734C15.7642 13.1198 15.5851 12.9016 15.4793 12.6462C15.3736 12.3909 15.3459 12.1099 15.3998 11.8388C15.4537 11.5677 15.5868 11.3187 15.7823 11.1233C15.9777 10.9279 16.2267 10.7948 16.4978 10.7409C16.7688 10.6869 17.0498 10.7146 17.3052 10.8204C17.5605 10.9262 17.7788 11.1053 17.9323 11.3351C18.0859 11.5649 18.1678 11.8351 18.1678 12.1115C18.1674 12.482 18.0201 12.8372 17.7581 13.0991C17.4961 13.3611 17.1409 13.5085 16.7704 13.5089Z" fill="currentColor" />
        <path d="M21.4415 17.4039C21.7284 17.3867 22.0084 17.3094 22.2634 17.177C22.5184 17.0445 22.7427 16.8599 22.9217 16.6351C23.1006 16.4103 23.2303 16.1504 23.3023 15.8722C23.3743 15.594 23.3869 15.3038 23.3394 15.0204C23.3022 14.7932 23.336 14.56 23.4362 14.3526C23.5364 14.1453 23.6982 13.9739 23.8994 13.8618C24.1503 13.7219 24.369 13.5308 24.5413 13.3008C24.7135 13.0709 24.8355 12.8073 24.8992 12.5271C24.963 12.2469 24.9671 11.9565 24.9113 11.6747C24.8555 11.3928 24.741 11.1259 24.5753 10.8911C24.4439 10.7043 24.3729 10.4817 24.3717 10.2533C24.3706 10.0249 24.4394 9.80166 24.569 9.61355L24.5763 9.60331C24.7418 9.36839 24.8561 9.10125 24.9117 8.81927C24.9673 8.53728 24.9629 8.24675 24.8989 7.96657C24.8348 7.68639 24.7125 7.42282 24.5399 7.193C24.3673 6.96317 24.1483 6.77224 23.8971 6.63261C23.6959 6.5198 23.5344 6.34764 23.4346 6.13962C23.3349 5.93161 23.3018 5.69788 23.3399 5.47035C23.3868 5.18699 23.3736 4.89694 23.3011 4.61902C23.2286 4.3411 23.0985 4.08154 22.9192 3.85718C22.7399 3.63282 22.5154 3.44868 22.2603 3.31673C22.0051 3.18477 21.7251 3.10795 21.4384 3.09125C21.2085 3.07724 20.9885 2.99265 20.8084 2.849C20.6283 2.70535 20.4969 2.50965 20.4322 2.28858C20.3519 2.01263 20.2144 1.75666 20.0287 1.53731C19.843 1.31797 19.6132 1.14017 19.3543 1.01546C19.0954 0.890756 18.8131 0.821943 18.5258 0.813496C18.2385 0.805048 17.9527 0.857156 17.6869 0.96643C17.4731 1.05331 17.2378 1.07215 17.0129 1.02037C16.7881 0.968597 16.5847 0.848729 16.4305 0.677113C16.238 0.463627 16.0029 0.293013 15.7402 0.176358C15.4775 0.0597025 15.1933 -0.000384311 14.9059 1.84955e-06C14.6185 0.00038801 14.3344 0.0612384 14.072 0.178599C13.8097 0.29596 13.5749 0.467205 13.3831 0.681208C13.2288 0.852021 13.0256 0.97104 12.8011 1.02201C12.5766 1.07298 12.3419 1.05341 12.129 0.965973C11.8632 0.856883 11.5774 0.804946 11.2902 0.813539C11.003 0.822132 10.7208 0.891063 10.462 1.01585C10.2032 1.14064 9.9736 1.31849 9.78804 1.53784C9.60248 1.7572 9.46515 2.01315 9.38499 2.28905C9.31996 2.51049 9.18815 2.70645 9.00757 2.85016C8.82698 2.99386 8.60642 3.0783 8.37604 3.09194C8.08921 3.1091 7.8092 3.1864 7.5542 3.31884C7.2992 3.45129 7.07492 3.6359 6.89593 3.86068C6.71694 4.08547 6.58725 4.3454 6.51528 4.62358C6.44332 4.90177 6.43069 5.19198 6.47821 5.47537C6.5154 5.70264 6.48158 5.93585 6.38137 6.1432C6.28116 6.35054 6.11943 6.52193 5.91824 6.63399C5.66729 6.77391 5.44859 6.96505 5.27633 7.195C5.10406 7.42495 4.9821 7.68856 4.91834 7.96872C4.85459 8.24887 4.85048 8.5393 4.90628 8.82115C4.96208 9.103 5.07655 9.36996 5.24223 9.60468C5.37366 9.79149 5.44472 10.0141 5.44585 10.2425C5.44699 10.4709 5.37815 10.6942 5.2486 10.8823L5.24132 10.8925C5.07574 11.1274 4.96144 11.3946 4.90586 11.6765C4.85028 11.9585 4.85466 12.2491 4.91871 12.5292C4.98277 12.8094 5.10506 13.073 5.27765 13.3028C5.45024 13.5326 5.66926 13.7236 5.92048 13.8632C6.1217 13.976 6.28321 14.1482 6.38294 14.3562C6.48267 14.5642 6.51578 14.7979 6.47772 15.0255C6.43081 15.3088 6.44402 15.5989 6.5165 15.8768C6.58897 16.1547 6.7191 16.4143 6.89841 16.6386C7.07773 16.863 7.30223 17.0471 7.55733 17.1791C7.81244 17.311 8.09245 17.3879 8.37917 17.4046C8.6091 17.4186 8.82911 17.5032 9.00919 17.6468C9.18927 17.7905 9.32065 17.9862 9.38541 18.2072C9.46569 18.4832 9.60315 18.7392 9.78886 18.9585C9.97456 19.1778 10.2044 19.3556 10.4633 19.4804C10.7222 19.6051 11.0045 19.6739 11.2918 19.6823C11.579 19.6908 11.8649 19.6387 12.1307 19.5294C12.3444 19.4423 12.5798 19.4233 12.8047 19.4751C13.0296 19.5269 13.233 19.6469 13.3871 19.8187C13.5795 20.0322 13.8147 20.2028 14.0774 20.3195C14.34 20.4361 14.6243 20.4962 14.9117 20.4958C15.1991 20.4954 15.4832 20.4346 15.7456 20.3172C16.0079 20.1999 16.2426 20.0286 16.4345 19.8146C16.5889 19.6439 16.7921 19.525 17.0165 19.474C17.241 19.4231 17.4757 19.4426 17.6886 19.5298C17.9544 19.6389 18.2402 19.6909 18.5274 19.6823C18.8146 19.6737 19.0967 19.6047 19.3555 19.48C19.6143 19.3552 19.8439 19.1773 20.0295 18.958C20.2151 18.7386 20.3524 18.4827 20.4326 18.2068C20.4976 17.9853 20.6294 17.7894 20.81 17.6457C20.9906 17.5019 21.2112 17.4175 21.4415 17.4039ZM14.9088 17.2351C13.5269 17.2351 12.1759 16.8253 11.0269 16.0576C9.87787 15.2898 8.98231 14.1985 8.45346 12.9218C7.92462 11.645 7.78625 10.2402 8.05585 8.88477C8.32545 7.52939 8.99092 6.28439 9.96809 5.30721C10.9453 4.33004 12.1903 3.66457 13.5457 3.39497C14.901 3.12536 16.3059 3.26373 17.5827 3.79258C18.8594 4.32142 19.9507 5.21699 20.7184 6.36603C21.4862 7.51507 21.896 8.86597 21.896 10.2479C21.8939 12.1004 21.1571 13.8764 19.8472 15.1863C18.5373 16.4962 16.7613 17.233 14.9088 17.2351Z" fill="currentColor" />
      </svg>
    );
  }
  if (normalizedType === "support") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.1807 18.0638L16.0547 16.2592C15.4473 15.9085 14.6635 16.1174 14.3131 16.7254L14.1897 16.9394C13.8774 17.4812 13.3969 17.8265 12.7843 17.9519C12.1743 18.0769 11.5924 17.9461 11.0942 17.5724C10.0718 16.8054 9.10596 15.9584 8.20232 15.0548C7.29885 14.1513 6.45193 13.1856 5.68512 12.1633C5.31139 11.665 5.18014 11.0831 5.30513 10.4728C5.43057 9.86038 5.77662 9.38061 6.31807 9.06809L6.53186 8.94475C6.82836 8.77364 7.03593 8.49992 7.12459 8.16957C7.21284 7.84067 7.16901 7.49814 6.99869 7.20315L5.19386 4.07721C4.87339 3.52213 4.21208 3.30185 3.6171 3.53018L3.57826 3.5451C2.96503 3.78034 1.2749 4.39769 0.820697 4.85189C-0.522468 6.1951 0.0522395 8.62505 0.651469 10.1713C1.70092 12.8794 3.69163 15.486 5.7317 17.5258C7.77149 19.5654 10.3779 21.5567 13.0857 22.6061C14.0252 22.9701 15.0825 23.2575 16.0967 23.2575C16.9455 23.2575 17.7904 23.052 18.4056 22.4368C18.8386 22.0039 19.4808 20.2608 19.7161 19.6689L19.7313 19.6308C19.9662 19.0399 19.7297 18.3807 19.1807 18.0638ZM18.2178 5.80129C18.5134 5.9072 18.7105 6.1876 18.7105 6.5014V10.0608H18.849C19.2595 10.0608 19.5928 10.3941 19.5928 10.8045C19.5928 11.2154 19.2599 11.5482 18.849 11.5482H18.7105V12.3715C18.7105 12.7824 18.3772 13.115 17.9668 13.115C17.5561 13.115 17.2233 12.7824 17.2233 12.3715V11.5482H14.4254C14.1377 11.5482 13.8757 11.3822 13.7529 11.1224C13.6301 10.8621 13.6683 10.5545 13.8509 10.3324L17.3923 6.02862C17.5916 5.78642 17.9222 5.69542 18.2178 5.80129ZM17.2233 10.0608H16.0007L17.2233 8.57537V10.0608ZM12.1828 8.59243C12.3194 8.09188 12.2392 7.71911 11.9429 7.48474C11.5985 7.21244 11.0249 7.16417 10.6368 7.37553C10.3575 7.5277 10.2393 7.78422 10.2751 8.16023C10.3147 8.56914 10.0152 8.93267 9.60633 8.97169C9.19719 9.01136 8.83435 8.71142 8.79487 8.30297C8.7008 7.32576 9.11278 6.51142 9.92511 6.06897C10.8409 5.57085 12.0504 5.67301 12.866 6.31872C13.6391 6.93021 13.9132 7.90216 13.6176 8.98418C13.4164 9.72153 12.72 10.2644 11.9835 10.8397C11.6691 11.0849 11.3349 11.3456 11.0319 11.6278H13.1929C13.6036 11.6278 13.9364 11.961 13.9364 12.3715C13.9364 12.7824 13.6036 13.115 13.1929 13.115H9.51799C9.26188 13.115 9.02357 12.9834 8.88765 12.7664C8.75149 12.5495 8.73722 12.2774 8.84885 12.047C9.35489 11.0044 10.3049 10.2629 11.0682 9.66718C11.5329 9.30416 12.1115 8.8527 12.1828 8.59243ZM23.4238 9.68585C23.4238 12.2729 22.4161 14.7048 20.5869 16.5343C20.4415 16.6792 20.2514 16.7523 20.0609 16.7523C19.8708 16.7523 19.6801 16.6792 19.5352 16.5343C19.2446 16.2438 19.2446 15.7728 19.5352 15.4823C21.0833 13.9342 21.9364 11.8753 21.9364 9.68585C21.9364 5.165 18.2588 1.48741 13.738 1.48741C11.5483 1.48741 9.48967 2.34032 7.94131 3.88849C7.6508 4.179 7.18004 4.179 6.88953 3.88849C6.59902 3.59798 6.59902 3.12722 6.88953 2.83671C8.71901 1.00768 11.151 0 13.738 0C19.0786 4.57497e-05 23.4238 4.34503 23.4238 9.68585Z" fill="currentColor" />
      </svg>
    );
  }
  return null;
}

const hospitalityFeatures = [
  "HOSPITALITY-TRAINED CHAUFFEURS",
  "VEHICLES UNDER 18 MONTHS OLD",
  "REAL-TIME FLIGHT TRACKING",
  "BILINGUAL CONCIERGE, 24/7",
  "DISCREET PRIVACY PARTITIONS",
  "REFRESHMENTS CURATED DAILY",
];

const fallbackFeatured = [
  {
    title: "Airport Transfer Service",
    subtitle: "Enjoy professional and seamless airport transfers.",
    image: images.services.coverage[0],
  },
  {
    title: "Limousine Service",
    subtitle: "Travel in Luxury with our VIP limousine service.",
    image: images.services.coverage[1],
  },
  {
    title: "Intercity Travel service",
    subtitle: "Travel Between cities with comfort.",
    image: images.services.coverage[2],
  },
  {
    title: "Hire by the Hour",
    subtitle: "Book the hour for flexible rides.",
    image: images.services.coverage[3],
  },
  {
    title: "Event transport",
    subtitle: "Luxury Chauffeur service for any occasion.",
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
    rating: 5,
    title: "It is always a pleasure",
    quote:
      '"Absolutely fantastic service! The driver was professional, the car was spotless, and they handled my luggage with care. Will definitely use again for airport transfers."',
    name: "Emily Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    rating: 5,
    title: "Highly recommended",
    quote:
      '"Best chauffeur experience in Riyadh. On time, courteous, and the S-Class was immaculate. Will definitely use again for airport transfers and corporate travel."',
    name: "James Al-Farsi",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    rating: 5,
    title: "Flawless coordination",
    quote:
      '"Used Maseer for corporate events multiple times. Flawless coordination and VIP treatment every single trip. Will definitely use again for airport transfers."',
    name: "Sarah Mitchell",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    rating: 5,
    title: "Flawless coordination",
    quote:
      '"Used Maseer for corporate events multiple times. Flawless coordination and VIP treatment every single trip. Will definitely use again for airport transfers."',
    name: "Sarah Mitchell",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
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
  const [bookingTab, setBookingTab] = useState<BookingTab>("Airport Transfer");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [featuredCoverage, setFeaturedCoverage] = useState<any[]>([]);
  const [itineraryCoverage, setItineraryCoverage] = useState<any[]>([]);
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);

  useEffect(() => {
    async function getCoverage() {
      try {
        const response = await fetchServiceCoverages({ is_active: true });
        if (response && response.success && Array.isArray(response.data)) {
          const featured = response.data.filter(item => item.section_type === "featured");
          const itinerary = response.data.filter(item => item.section_type === "itinerary");
          setFeaturedCoverage(featured);
          setItineraryCoverage(itinerary);
        }
      } catch (err) {
        console.error("Error fetching service coverage on homepage:", err);
      }
    }
    async function getReviews() {
      try {
        const response = await fetchCustomerReviews({ is_active: true });
        if (response && response.success && Array.isArray(response.data)) {
          setCustomerReviews(response.data);
        }
      } catch (err) {
        console.error("Error fetching customer reviews on homepage:", err);
      }
    }
    getCoverage();
    getReviews();
  }, []);

  const finalFeatured = (featuredCoverage.length > 0 
    ? featuredCoverage.map(item => ({
        title: item.title,
        subtitle: item.description,
        image: item.image_url || ""
      }))
    : fallbackFeatured).slice(0, 5);

  const coverageLarge = finalFeatured.slice(0, 2);
  const coverageSmall = finalFeatured.slice(2);

  const servicesCards = itineraryCoverage.length > 0
    ? itineraryCoverage.map(item => ({
        title: item.title,
        text: item.description,
        icon: item.icon_key || "briefcase"
      }))
    : fallbackServicesCards;

  const finalReviews = customerReviews.length > 0
    ? customerReviews.map(item => ({
        rating: item.star_rating,
        title: item.review_title,
        quote: item.review_content,
        name: item.customer_name,
        avatar: item.customer_image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
      }))
    : reviews;

  const dynamicHeading = featuredCoverage[0]?.section_heading;
  const dynamicSubtitle = featuredCoverage[0]?.section_subtitle;

  const itineraryHeading = itineraryCoverage[0]?.section_heading;
  const itinerarySubtitle = itineraryCoverage[0]?.section_subtitle;

  const reviewHeading = customerReviews[0]?.section_title;
  const reviewSubtitle = customerReviews[0]?.section_subtitle;

  const [slidesToShow, setSlidesToShow] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1280) return 2.15;
    }
    return 3.15;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(2.15);
      } else {
        setSlidesToShow(3.15);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        drop_off_longitude: dropoffLocation.longitude ?? data.pickup.longitude,
        class: data.fleetClass,
        date_and_time: new Date(data.dateTime).toISOString(),
        passengers: Number(data.passengers),
        childs: Number(data.childs || 0),
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
    <div className="overflow-hidden bg-white">
      {/* Hero + Booking — Figma node 201-203 */}
      <section className="relative w-full min-h-[640px] bg-maseer-green-deep max-md:min-h-[480px]">
        <HeroBackground
          image={images.home.hero}
          gradient="linear-gradient(90deg, rgba(7,18,11,0.88) 0%, rgba(7,18,11,0.45) 35%, rgba(7,58,11,0.15) 100%)"
        />
        <div className="page-container relative pb-[200px] pt-16 max-md:pb-8 max-md:pt-10">
          <h1 className="max-w-[650px] font-serif text-[44px] font-semibold leading-[1.5] text-white max-md:text-[28px] max-md:leading-[1.25]">
            <span className="inline-block rounded-2xl bg-primary px-4 py-1 text-center text-white max-md:h-auto">
              Luxury Chauffeur
            </span>{" "}
            and Mobility Services without limits Across Saudi Arabia
          </h1>
          <p className="mt-5 max-w-[660px] font-lato text-xl font-medium leading-8 text-white max-md:text-base max-md:leading-7">
            Reliable airport transfers, executive transportation, city-to-city
            rides, and premium chauffeur experiences designed for corporates,
            VIP guests, travelers, and hospitality clients.
          </p>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 w-[calc(100%-232px)] max-w-[1100px] -translate-x-1/2 translate-y-1/2 max-md:static max-md:mt-6 max-md:w-full max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:px-4">
          <form
            noValidate
            onSubmit={handleSubmit(onBookingSubmit)}
            className="rounded-[32px] bg-white p-5 shadow-[0_12px_48px_rgba(0,0,0,0.14)] max-md:rounded-2xl"
          >
            <div className="grid grid-cols-4 border-b border-primary/30 max-md:grid-cols-2">
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
                      "font-lato py-4 text-center text-[13px] font-semibold transition-colors max-md:px-2 max-md:py-3 max-md:text-[11px]",
                      isActive
                        ? [
                            "bg-maseer-green text-white",
                            index === 0 ? "rounded-tl-[16px]" : "",
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

            <div className="px-10 pb-0 pt-8 max-md:px-4 max-md:pt-6">
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
                        icon={<CalendarDays className="text-primary" />}
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

      <div className="h-[240px] max-md:hidden" />

      {/* An itinerary, composed */}
      <section className="page-container py-16 max-md:py-12">
        <div className="flex items-start justify-between gap-10 max-md:flex-col max-md:gap-4">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
                SERVICES
              </p>
            </div>
            <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              {itineraryHeading ? (
                <>
                  {itineraryHeading.split(" ").slice(0, -1).join(" ") + " "}
                  <span className="text-primary">{itineraryHeading.split(" ").slice(-1)[0]}</span>
                </>
              ) : (
                <>
                  An itinerary, <span className="text-primary">composed.</span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-[520px] font-lato text-[14px] leading-[22px] text-maseer-green-text/80">
              {itinerarySubtitle || "From the door of your residence to the door of your private jet — every detail attended to."}
            </p>
          </div>
          <Link
            to="/services"
            className="shrink-0 border-b border-maseer-green-text/30 pb-0.5 font-lato text-sm font-semibold text-maseer-green-text transition hover:border-primary hover:text-primary"
          >
            All services ↗
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-4 gap-6 max-md:grid-cols-1">
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
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-[549px_1fr] max-md:gap-10">
          <GoldOffsetImage
            src={images.home.wheels}
            alt="Hospitality on wheels"
            offset="right"
          />
          <div>
            <p className="eyebrow">THE MASEER EXPERIENCE</p>
            <h2 className="mt-3 font-serif text-figma-h2 font-medium text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              Hospitality on <span className="text-maseer-gold">wheels.</span>
            </h2>
            <p className="mt-4 text-[14px] leading-6 text-maseer-muted">
              Every Maseer journey is choreographed — chilled water, scented
              cabin, climate prepared, music to your taste. The car is ready
              before you ever step out.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 max-md:grid-cols-1">
              {hospitalityFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-maseer-green text-[10px] text-white">
                    ✓
                  </span>
                  <span className="text-[11px] font-semibold text-[#2d2d2d]">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="page-container py-16 max-md:py-12">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-0.5 w-9 bg-primary" aria-hidden />
          <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Features
          </p>
        </div>
        <GoldHeading 
          before={dynamicHeading ? dynamicHeading.split(" ").slice(0, -1).join(" ") + ", " : "Our, "}
          accent={dynamicHeading ? dynamicHeading.split(" ").slice(-1)[0] : "Service Coverage"}
        />
        <p className="mt-3 text-[14px] text-maseer-green ">
          {dynamicSubtitle || "From the door of your residence to the door of your private jet — every detail attended to."}
        </p>
        <div className="mt-10 space-y-3">
          <div className="grid grid-cols-[1.55fr_1fr] gap-3 max-md:grid-cols-1">
            {coverageLarge.map((item) => (
              <div
                key={item.title}
                className="card-image h-[290px] max-md:h-[200px]"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%), url(${item.image})`,
                }}
              >
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-serif text-[26px] font-medium max-md:text-lg">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] text-white/80">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
            {coverageSmall.map((item) => (
              <div
                key={item.title}
                className="card-image h-[240px] max-md:h-[200px]"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%), url(${item.image})`,
                }}
              >
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="font-serif text-[22px] font-medium max-md:text-base">
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
      <section className="page-container py-16 max-md:py-12">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-0.5 w-9 bg-primary" aria-hidden />
          <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
            FEATURES
          </p>
        </div>
        <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
          Our, <span className="text-primary">Best Feature.</span>
        </h2>
        <p className="mt-4 max-w-[550px] font-lato text-[14px] leading-[22px] text-maseer-green-text/80">
          From the door of your residence to the door of your private jet —
          every detail attended to.
        </p>

        <div className="mt-12 grid grid-cols-4 gap-6 max-md:grid-cols-1">
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
          <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
            Explore our,{" "}
            <span className="text-maseer-gold">Exquisite Fleet</span>
          </h2>
          <p className="mt-4 max-w-[580px] font-lato text-[14px] leading-[22px] text-maseer-green">
            Chauffeur-driven sedans, executive SUVs and electric flagships —
            pristine, private, immaculate.
          </p>
        </div>

        <div className="fleet-carousel mt-12 w-full overflow-hidden pl-6 sm:pl-10 xl:pl-[116px] min-[1440px]:pl-[calc((100vw-1440px)/2+116px)] pr-0">
          <SlickSlider {...carouselSliderSettings} responsive={undefined} slidesToShow={slidesToShow}>
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
                    <h3 className="font-serif text-[16px] font-medium leading-tight text-maseer-green-text">
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
      </section>

      {/* Reviews */}
      <section className="bg-maseer-surface py-16">
        <div className="page-container">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-0.5 w-9 bg-primary" aria-hidden />
            <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Ratings and reviews
            </p>
          </div>
          <GoldHeading 
            before={reviewHeading ? reviewHeading.split(" ").slice(0, -1).join(" ") + ", " : "What our, "}
            accent={reviewHeading ? reviewHeading.split(" ").slice(-1)[0] : "Customers Say"}
          />
          <p className="mt-3 text-[14px] text-maseer-green">
            {reviewSubtitle || "Trusted by hundreds of happy customers"}
          </p>
        </div>

        <div className="fleet-carousel mt-10 w-full overflow-hidden pl-6 sm:pl-10 xl:pl-[116px] min-[1440px]:pl-[calc((100vw-1440px)/2+116px)] pr-0">
          <SlickSlider {...carouselSliderSettings} responsive={undefined} slidesToShow={slidesToShow}>
            {finalReviews.map((r) => (
              <div key={r.name} className="pr-6 pb-6">
                <article className="rounded-2xl border border-maseer-line/80 bg-white p-8 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-primary text-[14px]">
                      {"★".repeat(r.rating || 5)}
                    </div>
                    <svg
                      width="48"
                      height="31"
                      viewBox="0 0 48 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.6738 0.916992V20.0439C20.6738 25.0396 15.4753 29.4403 8.62695 29.4404H4.79199V23.9336H8.62695C10.9869 23.9335 13.2803 22.3737 13.2803 20.0439V16.2588H0.916992V0.916992H20.6738Z"
                        stroke="#002703"
                        strokeWidth="1.83317"
                      />
                      <path
                        d="M46.3223 0.916992V20.0439C46.3223 25.0396 41.1237 29.4403 34.2754 29.4404H30.4404V23.9336H34.2754C36.6353 23.9335 38.9287 22.3737 38.9287 20.0439V16.2588H26.5654V0.916992H46.3223Z"
                        stroke="#002703"
                        strokeWidth="1.83317"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-serif text-[20px] font-semibold leading-tight text-maseer-green-text">
                    {r.title}
                  </h3>
                  <p className="mt-4 font-lato text-[13px] leading-[22px] text-maseer-muted">
                    {r.quote}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t-2 border-maseer-line/80 pt-6">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-lato text-[14px] font-semibold text-maseer-green-text">
                      {r.name}
                    </span>
                  </div>
                </article>
              </div>
            ))}
          </SlickSlider>
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
            <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              Get in, <span className="text-primary">Touch</span>
            </h2>
            <p className="mt-4 font-lato text-[14px] text-maseer-green">
              Need help or having questions
            </p>
          </div>

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-8 max-md:grid-cols-1">
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
        <h2 className="mt-2 font-serif text-[40px] font-bold leading-[52px] text-maseer-green-text max-md:text-[26px] max-md:leading-[34px]">
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
                    <p className="max-w-[913px] pb-5 pr-14 font-lato text-[15.91px] leading-7 text-maseer-green-text/85 max-md:pr-0">
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
