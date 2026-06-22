import { Link } from "react-router-dom";
import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";

type FleetHeroProps = {
  tagline?: string;
};

export function FleetHero({ tagline = "UNMATCHED LUXURY" }: FleetHeroProps) {
  return (
    <section className="relative w-full min-h-[620px] overflow-hidden bg-maseer-green-deep">
      <HeroBackground
        image={images.fleet.hero}
        gradient="linear-gradient(180deg, rgba(6,33,17,0.3) 0%, rgba(6,33,17,0.75) 70%, rgba(6,33,17,0.95) 100%)"
      />
      <div className="page-container relative flex min-h-[620px] flex-col justify-end pb-20 pt-28">
        <p className="eyebrow">{tagline}</p>
        <h1 className="mt-4 max-w-2xl font-serif text-figma-hero text-white">
          Our Elite Fleet
        </h1>
        <p className="mt-5 max-w-xl text-figma-body text-white/85">
          Discover a collection of the world&apos;s most prestigious vehicles,
          maintained to the highest standards of excellence for your journey in
          the Gulf.
        </p>
      </div>
    </section>
  );
}

type FleetFilterBarProps = {
  categories: readonly string[];
  active: string;
  onChange: (cat: string) => void;
  showLabel?: boolean;
  variant?: "default" | "grid";
};

export function FleetFilterBar({
  categories,
  active,
  onChange,
  showLabel = false,
  variant = "default",
}: FleetFilterBarProps) {
  const inactiveClass =
    variant === "grid" ? "filter-pill-inactive-grid" : "filter-pill-inactive";

  return (
    <section
      className={
        variant === "grid"
          ? "bg-maseer-cream py-8"
          : "border-b border-maseer-line/60 bg-white py-6"
      }
    >
      <div className="page-container flex flex-wrap items-center justify-center gap-3">
        {showLabel && (
          <span className="font-lato text-[11px] font-bold uppercase tracking-[0.08em] text-maseer-muted">
            FILTER BY CATEGORY:
          </span>
        )}
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={[
                "filter-pill uppercase",
                active === cat ? "filter-pill-active" : inactiveClass,
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaintenanceBadgeIcon() {
  return (
    <svg
      className="h-11 w-11 text-maseer-green"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden
    >
      <circle
        cx="22"
        cy="22"
        r="16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="3.5 2.5"
      />
      <path
        d="M15.5 22.5l4 4 9.5-9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SprayBottleIcon() {
  return (
    <svg
      className="h-5 w-5 text-maseer-green"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 3h4v2.5c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2V3zM7 7.5V16h6V7.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V2M14 4l1.5-1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M6 11h8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

type FleetStandardsProps = {
  errorValue?: string;
  sanitizationTitle?: string;
  fleetAge?: string;
};

export function FleetStandards({
  errorValue = "0.01%",
  sanitizationTitle = "Hospital-Grade Sanitization",
  fleetAge = "2Yrs",
}: FleetStandardsProps) {
  return (
    <section className="bg-white py-[88px]">
      <div className="page-container">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-[520px]">
            <h2 className="font-serif text-[42px] font-semibold leading-[1.1] text-maseer-green-text">
              Maseer Standards
            </h2>
            <p className="mt-4 font-lato text-[14px] leading-[22px] text-maseer-green-text/80">
              Beyond the aesthetics, we ensure every vehicle in our fleet
              operates at the peak of technical and hygienic perfection.
            </p>
          </div>
          <p className="shrink-0 font-serif leading-none text-maseer-gold">
            <span className="text-[42px] font-medium">{errorValue}</span>
            <span className="text-[30px] font-medium"> Error Tolerance</span>
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <article className="rounded-2xl bg-[#F5F5F5] p-8 lg:p-10">
            <MaintenanceBadgeIcon />
            <h3 className="mt-6 font-serif text-[26px] font-semibold leading-tight text-maseer-green-text">
              Meticulous Maintenance
            </h3>
            <p className="mt-4 font-lato text-[14px] leading-[24px] text-maseer-green-text/75">
              Our vehicles undergo a 50-point technical inspection every 7 days.
              We partner directly with authorized manufacturer service centers
              to guarantee that every mechanical component exceeds factory
              specifications. Performance is never compromised.
            </p>
          </article>

          <div className="grid gap-6">
            <article className="flex gap-4 rounded-2xl bg-[#F5F5F5] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-maseer-line/80 bg-white">
                <SprayBottleIcon />
              </div>
              <div>
                <h3 className="font-serif text-[20px] font-semibold text-maseer-green-text">
                  {sanitizationTitle}
                </h3>
                <p className="mt-2 font-lato text-[13px] leading-[20px] text-maseer-green-text/75">
                  Daily deep cleaning using ozone treatment and eco-friendly
                  antimicrobial agents for a pristine cabin environment.
                </p>
              </div>
            </article>

            <div className="grid grid-cols-2 gap-6">
              {[
                { val: fleetAge, label: "MAX FLEET AGE" },
                { val: "24/7", label: "SUPPORT READY" },
              ].map((item) => (
                <article
                  key={item.label}
                  className="flex min-h-[148px] items-center justify-center rounded-2xl bg-[#F5F5F5] p-6 text-center"
                >
                  <div>
                    <p className="font-serif text-[32px] font-semibold leading-none text-maseer-green-text">
                      {item.val}
                    </p>
                    <p className="mt-3 font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-maseer-muted">
                      {item.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FleetCtaProps = {
  buttonLabel?: string;
};

export function FleetCta({
  buttonLabel = "Book Your Vehicle Now",
}: FleetCtaProps) {
  return (
    <section className="bg-maseer-cream pb-[100px]">
      <div className="page-container">
        <div className="rounded-[20px] bg-maseer-green-deep px-8 py-16 text-center lg:px-16 lg:py-20">
          <h2 className="font-serif text-[40px] font-semibold leading-[48px] text-white">
            Ready for an Unforgettable Journey?
          </h2>
          <Link to="/booking" className="btn-gold mt-8 !rounded-lg">
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
