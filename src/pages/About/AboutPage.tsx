import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";
import {
  Crown,
  Sparkles,
  Briefcase,
  Calendar,
  Compass,
  Users,
  MapPin,
  Car,
  Hotel,
  Globe,
  Building2,
  Landmark,
  Handshake,
  UserCheck,
  Layers,
  ShieldCheck,
  Clock,
  Heart,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Navigation,
  TrendingUp,
  ArrowRight,
  Info,
} from "lucide-react";

const KEY_FACTS = [
  {
    value: "2020",
    label: "Founded",
    icon: Calendar,
  },
  {
    value: "50+",
    label: "Premium vehicles",
    icon: Car,
  },
  {
    value: "500+",
    label: "Events served",
    icon: Sparkles,
  },
  {
    value: "24/7",
    label: "Availability",
    icon: Clock,
  },
  {
    value: "100%",
    label: "Satisfaction rate",
    icon: Heart,
  },
  {
    value: "KSA",
    label: "Kingdom-wide operating capability",
    icon: Globe,
  },
];

const HOW_WE_WORK = [
  {
    step: "01",
    title: "DISCOVER",
    text: "We understand your requirements, guest profile, travel patterns, locations and service expectations.",
    icon: Search,
  },
  {
    step: "02",
    title: "DESIGN",
    text: "We create the appropriate transportation solution, vehicle mix and operating plan.",
    icon: SlidersHorizontal,
  },
  {
    step: "03",
    title: "CONFIRM",
    text: "We agree the scope, commercial terms, service standards and booking process.",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "DELIVER",
    text: "Our operations coordinate the journey and manage the service delivery.",
    icon: Navigation,
  },
  {
    step: "05",
    title: "DEVELOP",
    text: "We review performance, identify opportunities and build a stronger long-term partnership.",
    icon: TrendingUp,
  },
];

const WHY_MASEER = [
  {
    title: "Kingdom-Wide Reach",
    text: "A flexible operating capability designed to support transportation requirements across Saudi Arabia.",
    icon: MapPin,
  },
  {
    title: "Premium Vehicle Access",
    text: "A curated range of vehicles across economy, business, first-class, ultra-luxury, SUV, van and group transportation categories.",
    icon: Car,
  },
  {
    title: "Professional Chauffeur Experience",
    text: "Service delivered with professionalism, punctuality, discretion and hospitality.",
    icon: UserCheck,
  },
  {
    title: "Scalable Capacity",
    text: "Solutions designed for individual journeys, recurring corporate requirements and large-scale events.",
    icon: Layers,
  },
  {
    title: "One Accountable Partner",
    text: "A single point of coordination for transportation planning and execution.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible Partnership Model",
    text: "We work with clients, hotels, travel businesses, event companies and vehicle partners to build mutually valuable relationships.",
    icon: Handshake,
  },
  {
    title: "24/7 Availability",
    text: "Transportation support is available around the clock for planned and time-sensitive requirements.",
    icon: Clock,
  },
  {
    title: "Hospitality Mindset",
    text: "Our service is built around the experience of the guest, not simply the movement of the vehicle.",
    icon: Heart,
  },
];

const WHAT_WE_DO = [
  {
    title: "EXECUTIVE MOBILITY",
    text: "Professional chauffeur-driven transportation for executives, VIPs, business travelers and distinguished guests.",
    icon: Crown,
  },
  {
    title: "HOSPITALITY TRANSPORTATION",
    text: "Transportation solutions designed to complement the standards of hotels, resorts, residences and hospitality operators.",
    icon: Sparkles,
  },
  {
    title: "CORPORATE MOBILITY",
    text: "Reliable transportation for executives, employees, clients, delegations and business travel programmes.",
    icon: Briefcase,
  },
  {
    title: "EVENTS & MICE",
    text: "Planned, coordinated and scalable transportation for conferences, exhibitions, incentives, meetings and VIP occasions.",
    icon: Calendar,
  },
  {
    title: "TRAVEL & TOURISM TRANSPORTATION",
    text: "Ground transportation support for travel agencies, tour operators, DMCs and tourism businesses.",
    icon: Compass,
  },
  {
    title: "GROUP & SHUTTLE TRANSPORTATION",
    text: "Coordinated movement for groups, staff, guests and delegates using suitable vehicles and operational planning.",
    icon: Users,
  },
  {
    title: "INTERCITY MOBILITY",
    text: "Comfortable and professionally managed transportation between destinations across the Kingdom.",
    icon: MapPin,
  },
  {
    title: "PARTNER & FLEET SOLUTIONS",
    text: "A structured channel for vehicle owners and fleet operators to connect their vehicles with premium transportation demand.",
    icon: Car,
  },
];

const INDUSTRIES_WE_SERVE = [
  {
    title: "Hotels & Hospitality",
    text: "Enhance the guest experience with premium airport transfers, executive mobility, concierge transportation and white-label service options.",
    icon: Hotel,
  },
  {
    title: "Travel Agencies & Tour Operators",
    text: "Extend your travel product with dependable ground transportation, premium vehicles and professionally coordinated chauffeur services.",
    icon: Globe,
  },
  {
    title: "Destination Management Companies",
    text: "Support inbound programmes, VIP movements, tours, delegations and multi-city itineraries across the Kingdom.",
    icon: Compass,
  },
  {
    title: "Corporations & Multinational Companies",
    text: "Simplify business travel with reliable executive transportation, corporate billing and scalable mobility support.",
    icon: Building2,
  },
  {
    title: "Events & MICE Companies",
    text: "Move guests, speakers, executives and delegations with coordinated transportation built around the event programme.",
    icon: Calendar,
  },
  {
    title: "Government & Institutional Delegations",
    text: "Support high-standard movements with professional coordination, discretion and appropriate vehicle solutions.",
    icon: Landmark,
  },
  {
    title: "Tourism & Experience Companies",
    text: "Add dependable mobility to premium experiences, excursions and destination programmes.",
    icon: Sparkles,
  },
  {
    title: "Vehicle Owners & Fleet Operators",
    text: "Connect suitable vehicles with premium transportation demand through a structured vendor partnership model.",
    icon: Handshake,
  },
];

export function AboutPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative w-full min-h-[620px] overflow-hidden bg-maseer-green-deep max-md:min-h-[480px]">
        <HeroBackground
          image={images.about.hero}
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
          <h1 className="mt-3 font-serif text-figma-hero text-white max-md:text-[32px] max-md:leading-[1.15]">
            About Us
          </h1>
          <p className="mt-4 max-w-[580px] text-figma-body text-white/90">
            Maseer is a premium chauffeur and mobility company in Saudi Arabia
            offering luxury transportation services with a strong focus on
            comfort, reliability, and professionalism.
          </p>
          <p className="mt-3 max-w-[520px] font-lato text-[12px] leading-5 text-white/70">
            Imagery on this page is representative. Ultra-luxury vehicles such as
            Rolls-Royce are available on demand / subject to availability.
          </p>
        </div>
      </section>

      {/* <section className="border-b border-[#f0f0f0] bg-white py-[72px] max-md:py-12">
        <div className="page-container grid grid-cols-4 gap-8 max-md:grid-cols-2">
          {STATS.map((stat) => (
            <article key={stat.label} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center">
                {stat.icon}
              </div>
              <p className="mt-2 font-serif text-[23px] font-semibold leading-none text-maseer-green-text">
                {stat.value}
              </p>
              <p className="mt-2 text-[18px] text-maseer-muted">{stat.label}</p>
            </article>
          ))}
        </div>
      </section> */}

      {/* What We Do */}
      <section className="border-b border-maseer-line bg-gradient-to-b from-[#FAF9F5] to-white py-20 max-md:py-14">
        <div className="page-container">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.14em] text-primary">
                | WHAT WE DO
              </p>
            </div>
            <h2 className="mt-4 font-serif text-[40px] font-semibold leading-[1.2] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.25]">
              From one journey to a <span className="text-primary">complete transportation programme.</span>
            </h2>
          </div>

          {/* 8 Pillar Cards Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHAT_WE_DO.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-maseer-line/80 bg-white p-7 shadow-soft transition-all duration-300 hover:border-primary/50 hover:shadow-md flex flex-col justify-start"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-maseer-surface text-maseer-green mb-5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-lato text-[14.5px] font-bold tracking-wider text-maseer-green-text">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 font-lato text-[13px] leading-[21px] text-maseer-muted">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* <section className="bg-[#f5f5f5] py-[88px] max-md:py-12">
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-2 max-md:gap-10">
          <div className="relative">
            <GoldOffsetImage
              src={images.about.hospitality}
              alt="Chauffeur greeting guest"
              offset="right"
            />
            <span className="absolute bottom-8 right-10 z-20 rounded bg-maseer-gold-bright px-3 py-1.5 text-[25px] font-semibold text-white max-md:bottom-4 max-md:right-4 max-md:text-base">
              — Mr. Affan
            </span>
          </div>
          <div>
            <p className="eyebrow">THE MASEER EXPERIENCE</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              Hospitality on <span className="text-maseer-gold">wheels.</span>
            </h2>
            <p className="mt-5 text-[15.25px] leading-[25px] text-maseer-muted">
              We specialize in airport transfers, executive transportation,
              city-to-city travel, chauffeur services, and customized mobility
              solutions for corporates, hotels, travel management companies,
              event organizers, and VIP guests.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              At Maseer, we believe transportation is not just about moving
              people from one place to another. It is about creating a seamless
              experience that reflects professionalism, comfort, safety, and
              luxury.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              Our operations are designed to support business travelers,
              tourists, families, and high-profile clients with personalized
              service and premium transportation experiences across Saudi
              Arabia.
            </p>
          </div>
        </div>
      </section> */}

      {/* Industries We Serve */}
      <section className="relative overflow-hidden bg-maseer-green-deep py-24 max-md:py-16 text-white">
        {/* Ambient Luxury Glows */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-[110px] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-maseer-gold/10 blur-[110px] pointer-events-none" />

        <div className="page-container relative z-10">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.14em] text-primary">
                | INDUSTRIES WE SERVE
              </p>
            </div>
            <h2 className="mt-4 font-serif text-[40px] font-semibold leading-[1.2] text-white max-md:text-[28px] max-md:leading-[1.25]">
              Transportation designed around the way <span className="text-primary">your business operates.</span>
            </h2>
          </div>

          {/* 8 Industry Cards Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDUSTRIES_WE_SERVE.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.08] hover:shadow-float flex flex-col justify-start"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-maseer-green-deep">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-lato text-xs font-semibold text-white/30 group-hover:text-primary transition-colors">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-lato text-[16px] font-bold text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 font-lato text-[13px] leading-[22px] text-white/70">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Maseer */}
      <section className="border-t border-maseer-line bg-gradient-to-b from-white to-[#FAF9F5] py-20 max-md:py-14">
        <div className="page-container">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.14em] text-primary">
                | WHY MASEER
              </p>
            </div>
            <h2 className="mt-4 font-serif text-[40px] font-semibold leading-[1.2] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.25]">
              The difference is <span className="text-primary">in the details.</span>
            </h2>
          </div>

          {/* 2-Column Horizontal Cards (4 rows x 2 columns) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {WHY_MASEER.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex items-start gap-5 rounded-2xl border border-maseer-line/80 bg-white p-6 shadow-soft transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maseer-surface text-primary shadow-sm">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-lato text-[16px] font-bold text-maseer-green-text">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 font-lato text-[13.5px] leading-[22px] text-maseer-muted">
                      {item.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Saudi Arabia Coverage */}
      <section className="border-t border-maseer-line bg-[#FAF9F5] py-20 max-md:py-14">
        <div className="page-container">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.14em] text-primary">
                | SAUDI ARABIA COVERAGE
              </p>
            </div>
            <p className="mt-2 font-lato text-xs font-semibold text-maseer-green uppercase tracking-wider">
              One Kingdom. One chauffeur transportation partner.
            </p>
            <h2 className="mt-3 font-serif text-[40px] font-semibold leading-[1.2] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.25]">
              FROM THE CITY TO THE <span className="text-primary">DESTINATION.</span>
            </h2>
          </div>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 max-md:gap-8">
            {/* Left Narrative Column */}
            <div>
              <p className="font-lato text-[15.5px] leading-[28px] text-maseer-green-text/85">
                Maseer is built to support transportation requirements across Saudi Arabia. Our network-based operating model enables us to coordinate premium chauffeur chauffeur and transportation solutions across the Kingdom, subject to vehicle and operational availability.
              </p>

              {/* Hub Badges */}
              <div className="mt-8">
                <p className="font-lato text-xs font-bold uppercase tracking-wider text-maseer-muted mb-3.5">
                  Key Hubs & Destinations
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Riyadh",
                    "Jeddah",
                    "Makkah",
                    "Madinah",
                    "AlUla",
                    "Dammam",
                    "Khobar",
                    "Kingdom-Wide",
                  ].map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-2 rounded-xl border border-maseer-line bg-white px-4 py-2.5 font-lato text-xs font-semibold text-maseer-green-text shadow-soft"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Coverage Statement Card */}
              <div className="mt-8 rounded-2xl border border-maseer-line bg-white p-6 shadow-soft">
                <div className="flex items-center gap-2 border-b border-maseer-line pb-3">
                  <span className="h-0.5 w-6 bg-primary" aria-hidden />
                  <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
                    Coverage Statement
                  </p>
                </div>
                <p className="mt-3.5 font-serif text-[18px] font-medium leading-relaxed text-maseer-green-text">
                  Riyadh • Jeddah • Makkah • Madinah • AlUla • Dammam • Khobar • and destinations across Saudi Arabia
                </p>
              </div>
            </div>

            {/* Right Map Showcase Card */}
            <div className="relative overflow-hidden rounded-3xl bg-maseer-green-deep p-8 text-white shadow-card min-h-[420px] flex flex-col justify-between">
              {/* Ambient Glows */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-maseer-gold/15 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
                <span className="font-lato text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Kingdom-Wide Operations
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-lato text-[11px] font-medium text-white/80">
                  Saudi Arabia Network
                </span>
              </div>

              {/* Stylized Constellation Map of KSA */}
              <div className="relative z-10 my-8 flex items-center justify-center">
                <div className="relative h-[220px] w-full max-w-[360px]">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]" />

                  {/* SVG Routes */}
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 220" fill="none">
                    {/* Route Lines between major hubs */}
                    <path
                      d="M 80,65 L 105,95 L 115,140 L 190,110 L 270,95 L 285,105"
                      stroke="rgba(249, 187, 0, 0.4)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 190,110 L 105,95"
                      stroke="rgba(249, 187, 0, 0.3)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M 190,110 L 115,140"
                      stroke="rgba(249, 187, 0, 0.3)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>

                  {/* AlUla */}
                  <div className="absolute left-[70px] top-[50px] -translate-x-1/2 -translate-y-1/2 text-center group cursor-default">
                    <span className="relative flex h-3 w-3 mx-auto">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                    </span>
                    <span className="mt-1 block font-lato text-[10.5px] font-bold text-white/90">AlUla</span>
                  </div>

                  {/* Madinah */}
                  <div className="absolute left-[105px] top-[90px] -translate-x-1/2 -translate-y-1/2 text-center group cursor-default">
                    <span className="relative flex h-3 w-3 mx-auto">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                    </span>
                    <span className="mt-1 block font-lato text-[10.5px] font-bold text-white/90">Madinah</span>
                  </div>

                  {/* Jeddah & Makkah */}
                  <div className="absolute left-[110px] top-[140px] -translate-x-1/2 -translate-y-1/2 text-center group cursor-default">
                    <span className="relative flex h-3.5 w-3.5 mx-auto">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary" />
                    </span>
                    <span className="mt-1 block font-lato text-[10.5px] font-bold text-white">Jeddah / Makkah</span>
                  </div>

                  {/* Riyadh (Capital / Central Hub) */}
                  <div className="absolute left-[190px] top-[105px] -translate-x-1/2 -translate-y-1/2 text-center group cursor-default">
                    <span className="relative flex h-4 w-4 mx-auto">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-maseer-green-deep shadow-glow" />
                    </span>
                    <span className="mt-1 block font-lato text-[11px] font-extrabold text-primary">Riyadh</span>
                  </div>

                  {/* Dammam & Khobar */}
                  <div className="absolute left-[275px] top-[95px] -translate-x-1/2 -translate-y-1/2 text-center group cursor-default">
                    <span className="relative flex h-3 w-3 mx-auto">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                    </span>
                    <span className="mt-1 block font-lato text-[10.5px] font-bold text-white">Dammam / Khobar</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quote Badge */}
              <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 text-center">
                <p className="font-serif text-[15px] font-normal leading-relaxed text-white/95 italic">
                  “Premium chauffeur chauffeur and transportation solutions across the Kingdom.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="relative border-t border-maseer-line bg-gradient-to-b from-[#FBFBFA] via-white to-[#F7F6F1] py-24 max-md:py-16 overflow-hidden">
        {/* Subtle Decorative Background Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#062111_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
        
        <div className="page-container relative z-10">
          {/* Header Area with Top Badge */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-9 bg-primary" aria-hidden />
                <p className="font-lato text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  | HOW WE WORK
                </p>
              </div>
              <h2 className="mt-4 font-serif text-[42px] font-semibold leading-[1.18] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.25]">
                Simple for the client. <span className="text-primary block md:inline">Precise behind the scenes.</span>
              </h2>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-maseer-line bg-white/80 px-4 py-2 backdrop-blur-sm shadow-soft">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-lato text-xs font-semibold text-maseer-green-text">5-Stage Operational Framework</span>
            </div>
          </div>

          {/* Stepper Progression Rail (Visible on Desktop) */}
          <div className="relative mt-14 hidden lg:block">
            {/* Connecting Track Line */}
            <div className="absolute top-6 left-[6%] right-[6%] h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 z-0" />
            
            {/* 5 Milestone Nodes along the Track */}
            <div className="relative z-10 grid grid-cols-5 text-center">
              {HOW_WE_WORK.map((item, index) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-white text-maseer-green-deep shadow-md font-serif text-sm font-bold transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white">
                    {item.step}
                  </div>
                  <span className="mt-2 font-lato text-[11px] font-bold uppercase tracking-wider text-maseer-muted">
                    Step {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Cards Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
            {HOW_WE_WORK.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-maseer-line/90 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/80 hover:shadow-float"
                >
                  {/* Top Ambient Highlight Band */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Giant Ambient Watermark Number in background */}
                  <span className="pointer-events-none absolute -right-2 -top-3 select-none font-serif text-[64px] font-extrabold text-maseer-green/[0.04] transition-colors duration-300 group-hover:text-primary/10">
                    {item.step}
                  </span>

                  <div>
                    {/* Header: Icon & Mobile Step Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-maseer-surface text-maseer-green-text border border-maseer-line transition-all duration-300 group-hover:bg-primary group-hover:text-maseer-green-deep group-hover:border-primary group-hover:shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="lg:hidden rounded-full bg-maseer-surface border border-maseer-line px-2.5 py-0.5 font-lato text-[11px] font-bold text-primary">
                        Phase {item.step}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-lato text-[15.5px] font-bold tracking-wide text-maseer-green-text transition-colors group-hover:text-primary">
                      {index + 1}. {item.title}
                    </h3>

                    {/* Exact Text */}
                    <p className="mt-3 font-lato text-[13px] leading-[22px] text-maseer-muted">
                      {item.text}
                    </p>
                  </div>

                  {/* Bottom Flow Direction Indicator */}
                  <div className="mt-6 flex items-center justify-between border-t border-maseer-line/60 pt-3 text-[11.5px] font-lato font-medium text-maseer-muted/70">
                    <span className="group-hover:text-maseer-green-text transition-colors">
                      {index === 4 ? "Partnership" : "Next Phase"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="relative border-t border-maseer-line bg-white py-24 max-md:py-16 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute left-1/2 -top-24 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="page-container relative z-10">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.16em] text-primary">
                | KEY FACTS
              </p>
            </div>
            <h2 className="mt-4 font-serif text-[42px] font-semibold leading-[1.18] text-maseer-green-text max-md:text-[28px] max-md:leading-[1.25]">
              The numbers behind the <span className="text-primary">Maseer proposition.</span>
            </h2>
          </div>

          {/* 6 Key Facts Cards Grid */}
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
            {KEY_FACTS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.label}
                  className="group relative flex flex-col justify-between rounded-2xl border border-maseer-line/90 bg-gradient-to-b from-white to-[#FAF9F5] p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-float text-center"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-maseer-surface text-primary border border-maseer-line transition-all duration-300 group-hover:bg-primary group-hover:text-maseer-green-deep group-hover:border-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-serif text-[34px] font-bold leading-none tracking-tight text-maseer-green-text transition-colors group-hover:text-primary">
                    {item.value}
                  </p>
                  <p className="mt-2.5 font-lato text-[13px] font-medium leading-[18px] text-maseer-muted">
                    {item.label}
                  </p>
                  <div className="mt-4 mx-auto h-0.5 w-6 rounded-full bg-primary/30 transition-all duration-300 group-hover:w-12 group-hover:bg-primary" />
                </article>
              );
            })}
          </div>

          {/* Important Internal Note */}
          <div className="mt-12 rounded-2xl border border-maseer-line/80 bg-[#FAF9F5] p-5 md:p-6 shadow-soft flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <p className="font-lato text-xs font-bold uppercase tracking-[0.14em] text-maseer-green-text">
                Important Internal Note
              </p>
              <p className="mt-1 font-lato text-[13px] leading-relaxed text-maseer-muted">
                Before final publication, verify that all numerical claims are current, documented and approved for external corporate communications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
