import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { SITE } from "src/config/site";

type LegalPageShellProps = {
  title: string;
  updated?: string;
  children: ReactNode;
};

export function LegalPageShell({
  title,
  updated = "September 2026",
  children,
}: LegalPageShellProps) {
  return (
    <div className="bg-white">
      <section className="border-b border-maseer-line/40 bg-maseer-cream">
        <div className="page-container py-14 max-md:py-10">
          <p className="eyebrow">LEGAL</p>
          <h1 className="mt-3 font-serif text-[40px] font-semibold text-maseer-green-text max-md:text-[28px]">
            {title}
          </h1>
          <p className="mt-3 font-lato text-[13px] text-maseer-muted">
            Last updated: {updated} · {SITE.brand}
          </p>
        </div>
      </section>
      <section className="page-container py-12 max-md:py-8">
        <div className="mx-auto max-w-3xl space-y-8 font-lato text-[14px] leading-7 text-maseer-green-text/90">
          {children}
          <p className="border-t border-maseer-line/50 pt-8 text-[13px] text-maseer-muted">
            Questions?{" "}
            <Link to="/contact" className="font-semibold text-maseer-green hover:underline">
              Contact us
            </Link>{" "}
            or email{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-maseer-green hover:underline"
            >
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-[22px] font-semibold text-maseer-green-text">
      {children}
    </h2>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p>
        This Privacy Policy explains how {SITE.brand} collects, uses, and protects
        personal information when you use our website, booking forms, and related
        chauffeur services in Saudi Arabia.
      </p>
      <div className="space-y-3">
        <H2>Information we collect</H2>
        <p>
          We may collect your name, phone number, email address, pickup and
          drop-off details, booking preferences, payment-related references, and
          messages you send through our contact or callback forms.
        </p>
      </div>
      <div className="space-y-3">
        <H2>How we use information</H2>
        <p>
          We use your information to respond to enquiries, confirm bookings,
          coordinate chauffeurs, improve service quality, prevent fraud or abuse,
          and meet legal or operational requirements.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Sharing</H2>
        <p>
          We do not sell your personal information. We may share limited details
          with operational partners (such as chauffeurs or payment processors)
          only as needed to deliver the requested service, or when required by law.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Retention & security</H2>
        <p>
          We retain booking and contact records for as long as needed for service,
          accounting, and legal purposes, and apply reasonable technical and
          organisational measures to protect your data.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Your choices</H2>
        <p>
          You may request access, correction, or deletion of personal information
          we hold about you, subject to applicable law and operational needs, by
          contacting {SITE.email}.
        </p>
      </div>
    </LegalPageShell>
  );
}

export function TermsPage() {
  return (
    <LegalPageShell title="Terms & Conditions">
      <p>
        These Terms &amp; Conditions govern your use of the {SITE.brand} website
        and chauffeur booking services. By submitting a booking or creating an
        account, you agree to these terms.
      </p>
      <div className="space-y-3">
        <H2>Bookings</H2>
        <p>
          Bookings are subject to vehicle availability, route feasibility, and
          confirmation. Quoted fares may be estimates until confirmed. Waiting
          time, route changes, tolls, or special requests may affect the final
          price where applicable.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Passenger responsibilities</H2>
        <p>
          Provide accurate contact and location details, be ready at the agreed
          pickup time, and use the service lawfully and respectfully. Child seats
          or special equipment should be requested in advance when required.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Cancellations</H2>
        <p>
          Cancellation and rescheduling terms may vary by service type and notice
          period. Corporate accounts may have separate contractual terms.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Liability</H2>
        <p>
          We aim to deliver reliable, professional chauffeur services. We are not
          liable for delays caused by traffic, weather, events outside our
          control, or inaccurate information supplied by the passenger.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Website use</H2>
        <p>
          Content on this website is for information and booking purposes.
          Fleet imagery may be illustrative; an equivalent approved vehicle may
          be supplied for your journey.
        </p>
      </div>
    </LegalPageShell>
  );
}

export function CookiePolicyPage() {
  return (
    <LegalPageShell title="Cookie Policy">
      <p>
        This Cookie Policy explains how {SITE.brand} uses cookies and similar
        technologies on our website.
      </p>
      <div className="space-y-3">
        <H2>What are cookies?</H2>
        <p>
          Cookies are small text files stored on your device that help websites
          function, remember preferences, and understand usage patterns.
        </p>
      </div>
      <div className="space-y-3">
        <H2>How we use cookies</H2>
        <p>
          We may use essential cookies for authentication, session security, and
          core booking flows, and optional analytics cookies to improve site
          performance and content.
        </p>
      </div>
      <div className="space-y-3">
        <H2>Your control</H2>
        <p>
          You can control cookies through your browser settings. Disabling
          essential cookies may affect login or booking features.
        </p>
      </div>
    </LegalPageShell>
  );
}
