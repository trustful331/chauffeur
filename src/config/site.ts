/**
 * Public site contact & social settings (FE-only).
 * Update these values before go-live with verified Maseer details.
 * Leave phone/WhatsApp/social empty to hide that channel until confirmed.
 */
export const SITE = {
  brand: "Maseer",
  email: "support@maseer.com",
  /** Display string, e.g. "+966 5X XXX XXXX" */
  phoneDisplay: "",
  /** tel: href digits with +, e.g. "+9665XXXXXXXX" */
  phoneTel: "",
  /**
   * WhatsApp number for wa.me — country code + number, digits only.
   * Example: "9665XXXXXXXX"
   */
  whatsappNumber: "",
  social: {
    facebook: "",
    twitter: "",
    instagram: "",
  },
  serviceHours: "24/7 booking support",
} as const;

export function getWhatsAppUrl(prefillMessage?: string): string {
  const number = SITE.whatsappNumber.trim();
  if (!number) return "/contact";
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  if (!prefillMessage) return base;
  return `${base}?text=${encodeURIComponent(prefillMessage)}`;
}

export function getPhoneHref(): string | null {
  const tel = SITE.phoneTel.trim() || SITE.phoneDisplay.trim();
  if (!tel) return null;
  const digits = tel.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function hasPhone(): boolean {
  return Boolean(SITE.phoneDisplay.trim() || SITE.phoneTel.trim());
}

export function hasWhatsApp(): boolean {
  return Boolean(SITE.whatsappNumber.trim());
}

export const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Maseer | Luxury Chauffeur & Mobility across Saudi Arabia",
    description:
      "Premium chauffeur services in Saudi Arabia — airport transfers, corporate mobility, and executive travel.",
  },
  "/services": {
    title: "Services | Maseer Chauffeur",
    description:
      "Airport transfers, hourly chauffeur, corporate mobility, VIP tourism, Ziyarah tours, and 24/7 support.",
  },
  "/fleet": {
    title: "Our Fleet | Maseer Chauffeur",
    description:
      "Approved Maseer fleet categories from executive sedans to group transport and electric mobility.",
  },
  "/corporate": {
    title: "Corporate & Partner Solutions | Maseer",
    description:
      "Corporate mobility partnerships aligned with premium service standards across Saudi Arabia.",
  },
  "/about": {
    title: "About Us | Maseer",
    description:
      "Maseer is a premium chauffeur and mobility company focused on comfort, reliability, and professionalism.",
  },
  "/contact": {
    title: "Contact Us | Maseer",
    description:
      "Contact Maseer for bookings, corporate enquiries, and trip support across Saudi Arabia.",
  },
  "/booking": {
    title: "Book a Ride | Maseer",
    description: "Book a Maseer chauffeur for airport, city, hourly, or daily journeys.",
  },
  "/privacy": {
    title: "Privacy Policy | Maseer",
    description: "How Maseer collects, uses, and protects personal information.",
  },
  "/terms": {
    title: "Terms & Conditions | Maseer",
    description: "Terms governing Maseer chauffeur bookings and website use.",
  },
  "/cookies": {
    title: "Cookie Policy | Maseer",
    description: "How Maseer uses cookies and similar technologies on this website.",
  },
  "/signin": {
    title: "Sign In | Maseer",
    description: "Sign in to your Maseer account.",
  },
  "/signup": {
    title: "Create Account | Maseer",
    description: "Create a Maseer account to manage bookings.",
  },
};
