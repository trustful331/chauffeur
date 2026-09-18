import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "src/store/hooks";
import { selectIsAuthenticated } from "src/store/slices/auth/selectors";
import { MaseerLogo } from "./MaseerLogo";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { useFirebaseMessaging } from "src/hooks/useFirebaseMessaging";
import { PageMeta } from "./PageMeta";
import { SITE, getWhatsAppUrl, hasWhatsApp } from "src/config/site";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services", end: true },
  { to: "/fleet", label: "Our Fleet", end: true },
  { to: "/corporate", label: "Corporate", end: true },
  { to: "/about", label: "About Us", end: true },
  { to: "/contact", label: "Contact Us", end: true },
];

const footerServices = [
  { label: "Executive Transfers"},
  { label: "Airport Transfers", },
  { label: "Hourly & Full-Day Chauffeur", },
  { label: "Corporate Transportation", },
  { label: "Events, Conferences & MICE", },
  { label: "Staff & Employee Transportation", },
  { label: "Intercity Transportation" },
  { label: "VIP & VVIP Mobility", },
];

const regionCities = [
  "Riyadh",
  "Jeddah",
  "Madinah",
  "Makkah",
 
];

function FacebookIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 8h3V5h-3c-2.8 0-5 2.2-5 5v2H6v3h3v7h3v-7h2.5l.5-3H12V10c0-.6.4-1 1-1z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.9 4H21l-6.5 7.4L22 20h-6.2l-4.8-6.2L5.5 20H3.4l7-8L2 4h6.3l4.3 5.6L18.9 4zm-2.2 14.3h1.2L7.1 5.6H5.8l11 12.7z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MainLayout() {
  useFirebaseMessaging();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { pathname } = useLocation();
  const contactPage = pathname === "/contact";
  const pageBg = contactPage ? "bg-maseer-cream" : "bg-white";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = () => setMobileNavOpen(false);
  const whatsappHref = getWhatsAppUrl("Hello Maseer, I would like to enquire about a booking.");
  const whatsappIsExternal = hasWhatsApp();
  const socialLinks = [
    { label: "Facebook", href: SITE.social.facebook, Icon: FacebookIcon },
    { label: "Twitter", href: SITE.social.twitter, Icon: TwitterIcon },
    { label: "Instagram", href: SITE.social.instagram, Icon: InstagramIcon },
  ].filter((item) => Boolean(item.href.trim()));

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <PageMeta />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-maseer-green focus:px-4 focus:py-2 focus:font-lato focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b border-maseer-line/60 bg-white">
        <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-4 max-md:h-auto max-md:min-h-[64px] max-md:py-3 md:px-5">
          <MaseerLogo />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 xl:flex" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "nav-link text-base",
                    isActive
                      ? "font-semibold text-maseer-green"
                      : "text-maseer-muted hover:text-maseer-green",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <NotificationDropdown align="right" />
                <UserProfileDropdown />
              </div>
            ) : (
              <Link
                to="/signin"
                className="font-lato text-sm font-semibold text-maseer-green transition hover:text-maseer-gold"
              >
                Login
              </Link>
            )}
            {whatsappIsExternal ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !rounded-full !py-2.5 !text-xs max-md:!px-3"
              >
                <WhatsAppIcon />
                <span className="max-md:hidden">Chat on WhatsApp</span>
              </a>
            ) : (
              <Link
                to="/contact"
                className="btn-primary !rounded-full !py-2.5 !text-xs max-md:!px-3"
              >
                <WhatsAppIcon />
                <span className="max-md:hidden">Contact Us</span>
              </Link>
            )}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-maseer-green transition hover:bg-maseer-surface md:hidden"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobileNavOpen ? (
          <nav className="border-t border-maseer-line/60 bg-white px-4 py-4 md:hidden">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={closeMobileNav}
                    className={({ isActive }) =>
                      [
                        "block rounded-lg px-4 py-3 font-lato text-[15px] font-semibold transition",
                        isActive
                          ? "bg-maseer-surface text-maseer-green"
                          : "text-maseer-muted hover:bg-maseer-surface hover:text-maseer-green",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <main id="main-content" className="w-full" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="border-t border-maseer-line/40 bg-white">
        <div className="page-container py-10 max-md:py-12 lg:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-16">
            <div className="sm:col-span-2 lg:col-span-1">
              <MaseerLogo />
              <p className="mt-6 max-w-[280px] font-lato text-[13px] leading-[22px] text-maseer-green-text">
                Reliable, professional chauffeur services for passengers and
                luggage. Your journey, our priority.
              </p>
              {socialLinks.length > 0 ? (
                <div className="mt-6 flex items-center gap-4 text-maseer-green-text">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="transition hover:text-primary"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <p className="font-lato text-[15px] font-bold text-maseer-green-text">
                Services
              </p>
              <ul className="mt-5 space-y-3 font-lato text-[13px] leading-5 text-maseer-green-text">
                {footerServices.map((s) => (
                  <li key={s.label}>
                    <Link to={ ""} className="transition hover:text-primary">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-lato text-[15px] font-bold text-maseer-green-text">
                Company
              </p>
              <ul className="mt-5 space-y-3 font-lato text-[13px] leading-5 text-maseer-green-text">
                <li>
                  <NavLink
                    to="/about"
                    className="transition hover:text-primary"
                  >
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/fleet"
                    className="transition hover:text-primary"
                  >
                    Our Fleet
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className="transition hover:text-primary"
                  >
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/privacy"
                    className="transition hover:text-primary"
                  >
                    Privacy Policy
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/terms"
                    className="transition hover:text-primary"
                  >
                    Terms &amp; Conditions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cookies"
                    className="transition hover:text-primary"
                  >
                    Cookie Policy
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-lato text-[15px] font-bold text-maseer-green-text">
                Region
              </p>
              <ul className="mt-5 space-y-3 font-lato text-[13px] leading-5 text-maseer-green-text">
                {regionCities.map((city) => (
                  <li key={city}>{city}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
