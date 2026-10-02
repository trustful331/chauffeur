import { Link } from "react-router-dom";
import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";
import { GoldOffsetImage } from "../../ui/GoldOffsetImage";
import {
  ClipboardList,
  CalendarCheck,
  Network,
  Car,
  ShieldCheck,
  Hotel,
  Globe,
  Building2,
  Calendar,
  Layers,
  MessageSquare,
  Search,
  FileText,
  UserCheck,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const PARTNERSHIP_JOURNEY = [
  {
    stepNum: "01",
    title: "Step 1 — Conversation",
    text: "Tell us about your business, your guests and your transportation requirements.",
    icon: MessageSquare,
  },
  {
    stepNum: "02",
    title: "Step 2 — Assessment",
    text: "We review your requirements and identify the most suitable service model.",
    icon: Search,
  },
  {
    stepNum: "03",
    title: "Step 3 — Proposal",
    text: "We develop a commercial and operational proposal tailored to your needs.",
    icon: FileText,
  },
  {
    stepNum: "04",
    title: "Step 4 — Onboarding",
    text: "We establish the booking, communication, service and billing processes required for the partnership.",
    icon: UserCheck,
  },
  {
    stepNum: "05",
    title: "Step 5 — Launch",
    text: "Your transportation programme begins with dedicated coordination and operational support.",
    icon: Sparkles,
  },
  {
    stepNum: "06",
    title: "Step 6 — Growth",
    text: "As your requirements grow, we scale the solution with you.",
    icon: TrendingUp,
  },
];

const PARTNERSHIP_OPPORTUNITIES = [
  {
    title: "Hotels",
    text: "Offer your guests premium transportation under a service model that complements your hospitality standards. We can support airport transfers, executive journeys, VIP movements, hourly bookings and event transportation.",
    icon: Hotel,
  },
  {
    title: "Travel Agencies & Tour Operators",
    text: "Add dependable premium ground transportation to your packages and itineraries. We support individual travelers, families, groups, VIPs and multi-city programmes.",
    icon: Globe,
  },
  {
    title: "Corporate Clients",
    text: "Create a more reliable way to move executives, employees, clients and visiting delegations with flexible, professionally coordinated transportation.",
    icon: Building2,
  },
  {
    title: "Event & MICE Partners",
    text: "Work with a transportation partner capable of supporting the movement of guests, speakers, VIPs and teams across the full event lifecycle.",
    icon: Calendar,
  },
  {
    title: "Vehicle Owners & Fleet Operators",
    text: "Join the Maseer vendor network and connect suitable vehicles with premium demand. Maseer can support the commercial and operational coordination required to bring vehicles into a professional mobility ecosystem.",
    icon: Car,
  },
  {
    title: "Strategic & White-Label Partners",
    text: "Create a branded or co-branded transportation solution that allows your organization to offer premium ground transportation without building the entire operational infrastructure internally.",
    icon: Layers,
  },
];

const OPERATING_MODEL_STEPS = [
  {
    step: "01",
    title: "1. REQUIREMENT",
    text: "We understand the client's journey, service level, vehicle requirements, timing and operational needs.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "2. PLANNING",
    text: "Our team selects the appropriate vehicle and operational resources based on the requirement.",
    icon: CalendarCheck,
  },
  {
    step: "03",
    title: "3. COORDINATION",
    text: "Bookings, dispatch, chauffeur assignment, guest details and operational communication are coordinated through a central point of control.",
    icon: Network,
  },
  {
    step: "04",
    title: "4. DELIVERY",
    text: "The journey is delivered according to the agreed service requirements, with attention to punctuality, professionalism and guest experience.",
    icon: Car,
  },
  {
    step: "05",
    title: "5. OVERSIGHT",
    text: "Our team remains available to manage changes, support the journey and coordinate follow-up requirements.",
    icon: ShieldCheck,
  },
];

const VALUES = [
  {
    title: "Safety First",
    text: "We prioritize the safety and security of our passengers and drivers above everything else",
    icon: (
      <svg
        width="35"
        height="41"
        viewBox="0 0 35 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M34.36 10.9607L34.3588 10.9293C34.3412 10.5412 34.3295 10.1307 34.3224 9.67396C34.2895 7.44658 32.5188 5.60414 30.2911 5.47962C25.6465 5.22042 22.0535 3.70591 18.9835 0.713568L18.9573 0.688603C17.9559 -0.229534 16.4454 -0.229534 15.4437 0.688603L15.4175 0.713568C12.3475 3.70591 8.7545 5.22042 4.10988 5.47993C1.88249 5.60414 0.111555 7.44658 0.0785775 9.67427C0.071797 10.1279 0.059777 10.5385 0.0422095 10.9293L0.0403603 11.0023C-0.0499433 15.7385 -0.162129 21.6329 1.80976 26.983C2.89401 29.9251 4.53612 32.4825 6.69016 34.5848C9.14345 36.9789 12.3568 38.8796 16.2408 40.2339C16.3671 40.2779 16.4984 40.3137 16.6322 40.3405C16.8208 40.3781 17.0107 40.3969 17.2005 40.3969C17.3904 40.3969 17.5805 40.3781 17.7688 40.3405C17.9026 40.3137 18.0348 40.2776 18.1618 40.2332C22.0411 38.8765 25.2511 36.9749 27.7022 34.5811C29.8553 32.4782 31.4974 29.9201 32.5826 26.9774C34.5619 21.6113 34.45 15.7058 34.36 10.9607Z"
          fill="#002703"
        />
      </svg>
    ),
  },
  {
    title: "Customer Focus",
    text: "Every decision we make is centered around delivering exceptional customer experiences.",
    icon: (
      <svg
        width="40"
        height="36"
        viewBox="0 0 40 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M29.375 0C27.2045 0 25.2145 0.687812 23.4604 2.04437C21.7787 3.34492 20.6591 5.00141 20 6.20594C19.3409 5.00133 18.2213 3.34492 16.5396 2.04437C14.7855 0.687812 12.7955 0 10.625 0C4.56781 0 0 4.95445 0 11.5245C0 18.6225 5.69867 23.4788 14.3257 30.8306C15.7907 32.0791 17.4513 33.4943 19.1772 35.0036C19.4047 35.2028 19.6969 35.3125 20 35.3125C20.3031 35.3125 20.5953 35.2028 20.8228 35.0037C22.5489 33.4941 24.2094 32.0791 25.6752 30.8298C34.3013 23.4788 40 18.6225 40 11.5245C40 4.95445 35.4322 0 29.375 0Z"
          fill="#002703"
        />
      </svg>
    ),
  },
  {
    title: "Reliability",
    text: "Dependable service you can count on, day or night.",
    icon: (
      <svg
        width="21"
        height="42"
        viewBox="0 0 21 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.8 17.3337H13.8668V0L0 24.2674H6.93316V41.6L20.8 17.3337Z"
          fill="#002703"
        />
      </svg>
    ),
  },
  {
    title: "Innovation",
    text: "Continuously improving our technology and services to better serve our community.",
    icon: (
      <svg
        width="28"
        height="41"
        viewBox="0 0 28 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.4775 14.8956L17.1569 17.2162C18.4506 19.7186 16.5257 22.8414 13.6958 22.8036C11.5638 22.8036 9.82932 21.0691 9.82932 18.9371C9.79175 16.1074 12.9143 14.1821 15.4167 15.4761L18.0977 12.795C18.3284 12.5642 18.6414 12.4345 18.9678 12.4345H27.3915C25.4846 -4.15091 1.90086 -4.13877 0 12.4345H7.91419L10.2348 10.1139C8.94107 7.61159 10.866 4.48877 13.6959 4.52659C15.8279 4.52659 17.5624 6.26108 17.5624 8.39303C17.5999 11.2227 14.4774 13.1481 11.975 11.854L9.29397 14.5351C9.0633 14.7658 8.75026 14.8955 8.42394 14.8955H0.00090249C0.311068 18.3329 1.91046 21.5395 4.49802 23.8375C5.90717 25.1401 6.82126 26.8904 7.10149 28.7693C7.10452 28.7689 20.2856 28.7689 20.2902 28.7693C20.5703 26.8908 21.4844 25.1403 22.8938 23.8375C25.4813 21.5396 27.0808 18.3329 27.3909 14.8955H19.4775V14.8956Z"
          fill="#002703"
        />
        <path
          d="M7.19531 32.6357C7.19531 35.8004 9.46836 38.4428 12.4673 39.0198C12.345 40.9263 15.0511 40.9251 14.9283 39.0198C17.9272 38.4428 20.2003 35.8004 20.2003 32.6357V31.2301H7.19531V32.6357Z"
          fill="#002703"
        />
        <path
          d="M15.0987 8.39307C15.0987 7.61812 14.4682 6.98755 13.6932 6.98755C11.8312 7.05826 11.8317 9.72813 13.6932 9.7986C14.4682 9.79851 15.0987 9.16802 15.0987 8.39307Z"
          fill="#002703"
        />
        <path
          d="M12.2891 18.9372C12.2891 19.7121 12.9196 20.3427 13.6946 20.3427C15.5566 20.272 15.5561 17.6021 13.6946 17.5317C12.9196 17.5317 12.2891 18.1622 12.2891 18.9372Z"
          fill="#002703"
        />
      </svg>
    ),
  },
];

export function CorporatePage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative w-full min-h-[620px] overflow-hidden bg-maseer-green-deep max-md:min-h-[480px]">
        <HeroBackground
          image={images.corporate.hero}
          gradient="linear-gradient(90deg, rgba(7,18,11,0.88) 0%, rgba(7,18,11,0.45) 35%, rgba(7,58,11,0.15) 100%)"
        />
        <div className="page-container relative pb-24 pt-[115px] max-md:pb-16 max-md:pt-20">
          <div className="mb-4">
            <img
              src={images.logo}
              alt="Maseer"
              className="h-16 w-auto object-contain md:h-20 drop-shadow-md"
            />
          </div>
          <p className="eyebrow">UNMATCHED LUXURY</p>
          <h1 className="mt-3 font-serif text-[30px] leading-tight text-white sm:text-[42px] lg:text-figma-hero">
            Our Mission
          </h1>
          <p className="mt-4 max-w-[560px] text-figma-body text-white/90">
            Our goal is to become a trusted long-term mobility partner for
            organizations looking for premium service standards and reliable
            operational execution.
          </p>
        </div>
      </section>

      <section className="bg-[#f5f5f0] py-[88px] max-md:py-12">
        <div className="page-container grid items-center gap-10 lg:grid-cols-2 xl:gap-[97px]">
          <div>
            <p className="eyebrow">OUR MISSION</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              Corporate and Partner
            </h2>
            <p className="font-serif text-figma-h2 text-maseer-gold max-md:text-[28px] max-md:leading-[1.2]">
              Solutions
            </p>
            <p className="mt-6 text-[15.25px] leading-[25px] text-maseer-muted">
              Maseer works closely with corporates, travel management companies,
              tourism operators, hotels, serviced residences, event organizers,
              and government entities to provide reliable transportation
              solutions across Saudi Arabia.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              We offer dedicated operational handling, flexible booking support,
              professional chauffeurs, and scalable transportation solutions
              tailored to the requirements of our partners.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              Our goal is to become a trusted long-term mobility partner for
              organizations looking for premium service standards and reliable
              operational execution.
            </p>
          </div>
          <GoldOffsetImage
            src={images.corporate.partners}
            alt="Chauffeur greeting corporate guest"
            offset="right"
            className="justify-self-end"
          />
        </div>
      </section>

      <section className="bg-white py-[88px] max-md:py-12">
        <div className="page-container grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item) => (
            <article key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center">
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-maseer-green">
                {item.title}
              </h3>
              <p className="mx-auto mt-3 max-w-[220px] text-[13px] font-medium leading-5 text-maseer-green">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Our Operating Model */}
      <section className="border-t border-maseer-line bg-gradient-to-b from-[#FAF9F5] via-white to-[#FAF9F5] py-24 max-md:py-16">
        <div className="page-container">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.16em] text-primary">
                | OUR OPERATING MODEL
              </p>
            </div>
            <h2 className="mt-4 font-serif text-[40px] font-semibold leading-[1.2] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.25]">
              Flexible capacity. Centralized coordination. <span className="text-primary">Consistent standards.</span>
            </h2>
            <div className="mt-6 rounded-2xl border border-maseer-line/80 bg-white p-5 shadow-soft">
              <p className="font-lato text-xs font-bold uppercase tracking-wider text-primary mb-1">
                How It Works
              </p>
              <p className="font-lato text-[15px] leading-[25px] text-maseer-green-text/90">
                Maseer brings together client requirements and transportation capacity through a professionally coordinated operating model.
              </p>
            </div>
          </div>

          {/* 5 Operating Steps */}
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
            {OPERATING_MODEL_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-maseer-line/90 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-card"
                >
                  <div>
                    {/* Step badge & icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-maseer-surface font-lato text-xs font-bold text-maseer-green-text border border-maseer-line transition-colors duration-300 group-hover:bg-primary group-hover:text-maseer-green-deep group-hover:border-primary">
                        {item.step}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-lato text-[15px] font-bold tracking-wide text-maseer-green-text transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-2.5 font-lato text-[13px] leading-[22px] text-maseer-muted">
                      {item.text}
                    </p>
                  </div>

                  {/* Step Accent Bar */}
                  <div className="mt-5 pt-3 border-t border-maseer-line/50 flex items-center justify-between text-maseer-muted/60 text-[11px] font-lato font-medium">
                    <span>Phase {item.step}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>
              );
            })}
          </div>

          {/* The Advantage Banner */}
          <div className="relative mt-10 overflow-hidden rounded-3xl bg-maseer-green-deep p-8 md:p-10 text-white shadow-card">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-7 bg-primary" aria-hidden />
                  <p className="font-lato text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    The Advantage
                  </p>
                </div>
                <p className="mt-3 font-serif text-[20px] md:text-[23px] font-medium leading-[34px] text-white">
                  Clients gain access to a scalable transportation capability without having to build and manage an entire transportation operation themselves.
                </p>
              </div>
              <div className="shrink-0">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 backdrop-blur-md">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-lato text-xs font-bold uppercase tracking-wider text-white">
                    Centralized Control
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f0] py-[88px] max-md:py-12">
        <div className="page-container grid items-center gap-10 lg:grid-cols-2 xl:gap-[97px]">
          <GoldOffsetImage
            src={images.corporate.sustainability}
            alt="Sustainability and corporate partnership"
            offset="left"
          />
          <div>
            <p className="eyebrow">VISION 2030</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              Sustainability &amp; Vision
            </h2>
            <p className="font-serif text-figma-h2 text-maseer-gold max-md:text-[28px] max-md:leading-[1.2]">2030.</p>
            <p className="mt-6 text-[15.25px] leading-[25px] text-maseer-muted">
              Maseer supports a smarter and more sustainable transportation
              future in Saudi Arabia. Through our Electric Mobility options,
              where available, we aim to promote environmentally conscious
              journeys while maintaining comfort and service standards.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              Our focus aligns with Saudi Vision 2030 by contributing toward
              innovation, premium tourism experiences, sustainable mobility, and
              world-class hospitality services.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="relative border-t border-maseer-line bg-gradient-to-b from-white via-[#FAF9F5] to-white py-24 max-md:py-16 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute right-1/4 -top-24 h-64 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="page-container relative z-10">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.16em] text-primary">
                | PARTNERSHIP OPPORTUNITIES
              </p>
            </div>
            <h2 className="mt-4 font-serif text-[40px] font-semibold leading-[1.2] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.25]">
              Build the journey <span className="text-primary">with us.</span>
            </h2>
          </div>

          {/* 6 Opportunity Cards (3 cols x 2 rows) */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNERSHIP_OPPORTUNITIES.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-maseer-line/90 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-card"
                >
                  {/* Watermark Numeral */}
                  <span className="pointer-events-none absolute -right-2 -top-3 select-none font-serif text-[56px] font-extrabold text-maseer-green/[0.04] transition-colors duration-300 group-hover:text-primary/10">
                    0{index + 1}
                  </span>

                  <div>
                    {/* Header with Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-maseer-surface text-maseer-green-text border border-maseer-line transition-all duration-300 group-hover:bg-primary group-hover:text-maseer-green-deep group-hover:border-primary group-hover:shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-lato text-xs font-semibold text-maseer-muted/50 group-hover:text-primary transition-colors">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-lato text-[17px] font-bold text-maseer-green-text transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 font-lato text-[13.5px] leading-[23px] text-maseer-muted">
                      {item.text}
                    </p>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="mt-6 pt-3 border-t border-maseer-line/60 flex items-center justify-between text-[11.5px] font-lato font-medium text-maseer-muted/60">
                    <span className="group-hover:text-maseer-green-text transition-colors">
                      Explore Collaboration
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership Journey */}
      <section className="relative overflow-hidden bg-maseer-green-deep py-24 max-md:py-16 text-white">
        {/* Ambient Luxury Glows */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-maseer-gold/10 blur-[120px] pointer-events-none" />

        <div className="page-container relative z-10">
          <div className="grid items-start gap-12 lg:grid-cols-12 max-md:gap-10">
            {/* Left Column: Sticky Executive Authority Block */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-9 bg-primary" aria-hidden />
                <p className="font-lato text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  | PARTNERSHIP JOURNEY
                </p>
              </div>
              <h2 className="mt-4 font-serif text-[42px] font-semibold leading-[1.18] text-white max-md:text-[28px] max-md:leading-[1.25]">
                A structured approach to <span className="text-primary block mt-1">long-term collaboration.</span>
              </h2>

              {/* Interactive Stage Tracker Card */}
              <div className="mt-8 rounded-3xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-md shadow-card">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-lato text-xs font-bold uppercase tracking-wider text-primary">
                    6-Phase Framework
                  </span>
                  <span className="flex items-center gap-1.5 font-lato text-[11px] font-medium text-white/70">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    End-to-End Execution
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {PARTNERSHIP_JOURNEY.map((item, i) => (
                    <div
                      key={item.stepNum}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-lato transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="text-white/80 font-medium">
                        {item.title}
                      </span>
                      <span className="font-bold text-primary text-[11px]">
                        0{i + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-lato text-xs font-bold uppercase tracking-wider text-maseer-green-deep shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
                  >
                    <span>Start the Conversation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: 6-Step Connected Timeline Rail */}
            <div className="relative lg:col-span-7">
              {/* Continuous Vertical Gold Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 max-md:left-[21px]" />

              <div className="space-y-6">
                {PARTNERSHIP_JOURNEY.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="group relative flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.08] hover:shadow-card max-md:p-5"
                    >
                      {/* Connected Number Milestone Node */}
                      <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-primary bg-maseer-green-deep shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-maseer-green-deep max-md:h-11 max-md:w-11">
                        <span className="font-serif text-sm font-bold text-primary group-hover:text-maseer-green-deep">
                          {item.stepNum}
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-lato text-[17px] font-bold text-white transition-colors group-hover:text-primary max-md:text-[15.5px]">
                            {item.title}
                          </h3>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>

                        <p className="font-lato text-[13.5px] leading-[23px] text-white/70 max-md:text-[13px]">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
