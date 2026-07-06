import { Outlet } from "react-router-dom";
import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className="h-10 w-10"
      aria-hidden
    >
      <path
        d="M20 3L5 10v10c0 9.5 6.4 18.4 15 21 8.6-2.6 15-11.5 15-21V10L20 3z"
        fill="rgba(249,187,0,0.18)"
        stroke="#F9BB00"
        strokeWidth="1.5"
      />
      <path
        d="M15 20l3.5 3.5 7-7"
        stroke="#F9BB00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminAuthLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* ── Left decorative panel ─────────────────────────────────── */}
      <div className="relative hidden min-h-screen overflow-hidden lg:flex" style={{ backgroundColor: "#062111" }}>
        <HeroBackground
          image={images.home.hero}
          gradient="linear-gradient(180deg, rgba(6,33,17,0.80) 0%, rgba(6,33,17,0.97) 100%)"
        />

        {/* subtle gold grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249,187,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,187,0,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          {/* Top: logo + admin badge */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src={images.logo}
                alt="Maseer"
                className="h-[48px] w-auto object-contain"
              />
              <span
                className="rounded-full px-3 py-1 font-lato text-[10px] font-bold uppercase tracking-[0.14em] text-maseer-gold"
                style={{ background: "rgba(249,187,0,0.12)", border: "1px solid rgba(249,187,0,0.25)" }}
              >
                Admin Panel
              </span>
            </div>
          </div>

          {/* Middle: headline */}
          <div className="max-w-md">
            <ShieldIcon />
            <p className="eyebrow mt-5 !text-maseer-gold">ADMIN ACCESS</p>
            <h1 className="mt-4 font-serif text-[40px] font-semibold leading-[1.15] text-white xl:text-[46px]">
              Secure control{" "}
              <span className="text-maseer-gold">centre.</span>
            </h1>
            <p className="mt-5 font-lato text-[15px] leading-7 text-white/70">
              Manage bookings, drivers, fleets and operations from your
              centralised Maseer admin dashboard.
            </p>

            {/* Stat pills */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: "Active Bookings", value: "—" },
                { label: "Drivers", value: "—" },
                { label: "Fleet Vehicles", value: "—" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="font-lato text-[18px] font-bold text-maseer-gold">
                    {s.value}
                  </p>
                  <p className="mt-0.5 font-lato text-[11px] text-white/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: copyright */}
          <p className="font-lato text-[12px] text-white/40">
            © {new Date().getFullYear()} MASEER — Restricted Admin Access
          </p>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────── */}
      <div className="flex min-h-screen flex-col bg-[#F9F8F3] px-6 py-10 max-md:px-4 max-md:py-6 sm:px-10 lg:py-12">
        {/* Mobile header */}
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <img
            src={images.logo}
            alt="Maseer"
            className="h-[44px] w-auto object-contain"
          />
          <span
            className="rounded-full px-3 py-1 font-lato text-[10px] font-bold uppercase tracking-[0.12em] text-maseer-gold"
            style={{ background: "rgba(6,33,17,0.08)", border: "1px solid rgba(201,161,48,0.3)" }}
          >
            Admin Panel
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[440px]">
            <Outlet />
          </div>
        </div>

        <p className="mt-8 text-center font-lato text-[12px] text-maseer-muted lg:hidden">
          © {new Date().getFullYear()} MASEER — Restricted Admin Access
        </p>
      </div>
    </div>
  );
}
