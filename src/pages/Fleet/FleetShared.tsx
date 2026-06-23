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
          gradient="linear-gradient(90deg, rgba(7,18,11,0.88) 0%, rgba(7,18,11,0.45) 35%, rgba(7,58,11,0.15) 100%)"
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
  <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.2 42L11.4 35.6L4.2 34L4.9 26.6L0 21L4.9 15.4L4.2 8L11.4 6.4L15.2 0L22 2.9L28.8 0L32.6 6.4L39.8 8L39.1 15.4L44 21L39.1 26.6L39.8 34L32.6 35.6L28.8 42L22 39.1L15.2 42ZM16.9 36.9L22 34.7L27.2 36.9L30 32.1L35.5 30.8L35 25.2L38.7 21L35 16.7L35.5 11.1L30 9.9L27.1 5.1L22 7.3L16.8 5.1L14 9.9L8.5 11.1L9 16.7L5.3 21L9 25.2L8.5 30.9L14 32.1L16.9 36.9ZM19.9 28.1L31.2 16.8L28.4 13.9L19.9 22.4L15.6 18.2L12.8 21L19.9 28.1Z" fill="#073A0B"/>
</svg>

  );
}

function SprayBottleIcon() {
  return (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 6C12.5833 6 12.2292 5.85417 11.9375 5.5625C11.6458 5.27083 11.5 4.91667 11.5 4.5C11.5 4.21667 11.6417 3.84167 11.925 3.375C12.2083 2.90833 12.5667 2.45 13 2C13.4333 2.45 13.7917 2.90833 14.075 3.375C14.3583 3.84167 14.5 4.21667 14.5 4.5C14.5 4.91667 14.3542 5.27083 14.0625 5.5625C13.7708 5.85417 13.4167 6 13 6ZM15.5 13C14.8 13 14.2083 12.7583 13.725 12.275C13.2417 11.7917 13 11.2 13 10.5C13 9.91667 13.2583 9.19583 13.775 8.3375C14.2917 7.47917 14.8667 6.7 15.5 6C16.1333 6.7 16.7083 7.47917 17.225 8.3375C17.7417 9.19583 18 9.91667 18 10.5C18 11.2 17.7583 11.7917 17.275 12.275C16.7917 12.7583 16.2 13 15.5 13ZM5 16H7V14H9V12H7V10H5V12H3V14H5V16ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V10C0 8.5 0.475 7.2 1.425 6.1C2.375 5 3.56667 4.33333 5 4.1V2H3V0H9C9.56667 0 10.1 0.0875 10.6 0.2625C11.1 0.4375 11.5667 0.683333 12 1L10.55 2.45C10.3167 2.31667 10.0708 2.20833 9.8125 2.125C9.55417 2.04167 9.28333 2 9 2H7V4.1C8.43333 4.33333 9.625 5 10.575 6.1C11.525 7.2 12 8.5 12 10V18C12 18.55 11.8042 19.0208 11.4125 19.4125C11.0208 19.8042 10.55 20 10 20H2ZM2 18H10V10C10 8.9 9.60833 7.95833 8.825 7.175C8.04167 6.39167 7.1 6 6 6C4.9 6 3.95833 6.39167 3.175 7.175C2.39167 7.95833 2 8.9 2 10V18ZM2 18C2 18 2.39167 18 3.175 18C3.95833 18 4.9 18 6 18C7.1 18 8.04167 18 8.825 18C9.60833 18 10 18 10 18H2Z" fill="#073A0B"/>
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
          <article className="flex flex-col justify-center rounded-2xl bg-[#F5F5F5] p-8 lg:p-12 min-h-[380px] lg:min-h-[460px]">
            <div>
              <MaintenanceBadgeIcon />
              <h3 className="mt-8 font-serif text-[28px] font-semibold leading-tight text-maseer-green-text">
                Meticulous Maintenance
              </h3>
              <p className="mt-6 font-lato text-[14px] leading-[26px] text-maseer-green-text/75">
                Our vehicles undergo a 50-point technical inspection every 7 days.
                We partner directly with authorized manufacturer service centers
                to guarantee that every mechanical component exceeds factory
                specifications. Performance is never compromised.
              </p>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="flex gap-6 items-center rounded-2xl bg-[#F5F5F5] p-8 lg:p-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-maseer-line/80 bg-white shadow-sm">
                <SprayBottleIcon />
              </div>
              <div>
                <h3 className="font-serif text-[22px] font-semibold text-maseer-green-text">
                  {sanitizationTitle}
                </h3>
                <p className="mt-2.5 font-lato text-[13.5px] leading-[22px] text-maseer-green-text/75">
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
                  className="flex min-h-[190px] lg:min-h-[210px] items-center justify-center rounded-2xl bg-[#F5F5F5] p-8 text-center"
                >
                  <div>
                    <p className="font-serif text-[38px] font-semibold leading-none text-maseer-green-text">
                      {item.val}
                    </p>
                    <p className="mt-4 font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-maseer-muted">
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
