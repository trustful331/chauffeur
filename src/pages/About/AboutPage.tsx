import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";
import { GoldOffsetImage } from "../../ui/GoldOffsetImage";
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

const STATS = [
  {
    value: "Trusted",
    label: "by travelers across KSA",
    icon: (
      <svg
        width="30"
        height="35"
        viewBox="0 0 40 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.6213 13.3364C23.3041 13.3364 26.2895 10.3509 26.2895 6.66819C26.2895 2.98545 23.3041 0 19.6213 0C15.9386 0 12.9531 2.98545 12.9531 6.66819C12.9531 10.3509 15.9386 13.3364 19.6213 13.3364Z"
          fill="#002703"
        />
        <path
          d="M33.114 13.3363C35.4421 13.3363 37.3295 11.449 37.3295 9.1208C37.3295 6.79263 35.4421 4.90527 33.114 4.90527C30.7858 4.90527 28.8984 6.79263 28.8984 9.1208C28.8984 11.449 30.7858 13.3363 33.114 13.3363Z"
          fill="#002703"
        />
        <path
          d="M6.12959 13.3363C8.45776 13.3363 10.3451 11.449 10.3451 9.1208C10.3451 6.79263 8.45776 4.90527 6.12959 4.90527C3.80142 4.90527 1.91406 6.79263 1.91406 9.1208C1.91406 11.449 3.80142 13.3363 6.12959 13.3363Z"
          fill="#002703"
        />
        <path
          d="M10.2851 17.1219C8.62573 15.7624 7.12293 15.9423 5.20426 15.9423C2.33463 15.9423 0 18.2632 0 21.1152V29.4857C0 30.7243 1.01096 31.7314 2.25416 31.7314C7.62136 31.7314 6.97478 31.8285 6.97478 31.4999C6.97478 25.5686 6.27224 21.2189 10.2851 17.1219Z"
          fill="#002703"
        />
        <path
          d="M21.4456 15.9729C18.0943 15.6934 15.1814 15.9761 12.6689 18.05C8.46429 21.4178 9.27344 25.9524 9.27344 31.4998C9.27344 32.9675 10.4676 34.184 11.9576 34.184C28.1361 34.184 28.78 34.7058 29.7394 32.5813C30.0541 31.8628 29.9678 32.0911 29.9678 25.2179C29.9678 19.7587 25.2408 15.9729 21.4456 15.9729Z"
          fill="#002703"
        />
        <path
          d="M34.034 15.9423C32.1048 15.9423 30.6103 15.7641 28.9531 17.1218C32.936 21.1884 32.2635 25.2413 32.2635 31.4998C32.2635 31.8305 31.7267 31.7313 36.9036 31.7313C38.1913 31.7313 39.2382 30.6882 39.2382 29.4059V21.1151C39.2382 18.2631 36.9036 15.9423 34.034 15.9423Z"
          fill="#002703"
        />
      </svg>
    ),
  },
  {
    value: "Professional",
    label: "trained chauffeurs",
    icon: (
      <svg
        width="24"
        height="39"
        viewBox="0 0 34 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M33.0665 32.2674L33.0647 32.2969C32.9486 34.2213 31.6483 35.8655 29.8068 36.436C25.7846 37.6821 21.2991 38.3771 16.5696 38.3771C11.8412 38.3771 7.35707 37.6813 3.33452 36.4363C1.4924 35.8661 0.192053 34.2209 0.077427 32.296L0.0727492 32.2174C0.0272741 31.5765 0 30.931 0 30.29C0 28.8399 0.118197 27.3943 0.336388 25.9441C0.545507 24.6349 1.4865 23.4849 2.74116 23.0166C4.10036 22.4939 5.50957 22.0211 6.76877 21.2892L9.80085 19.6163C10.4782 19.6163 11.0555 20.0846 11.2101 20.7119L14.568 28.0848C14.6799 28.3304 15.0446 28.2701 15.0715 28.0016L15.4968 23.7485C14.924 23.5394 14.5058 23.0166 14.5058 22.3893V21.7074C14.5058 21.3392 14.6104 21.0801 14.8195 20.8164C15.3922 20.9755 16.0196 21.0801 16.5969 21.0801C17.1697 21.0801 17.797 20.9755 18.3743 20.8164C18.5834 21.0801 18.688 21.3937 18.688 21.7074V22.3893C18.688 23.0166 18.2698 23.5394 17.6924 23.7485L18.1178 28.0016C18.1446 28.2701 18.5094 28.3304 18.6212 28.0848L21.9792 20.7119C22.1383 20.0846 22.7111 19.6163 23.3929 19.6163L26.425 21.2892C27.6797 22.0211 29.0934 22.4939 30.4526 23.0166C31.7073 23.4849 32.5937 24.6349 32.8029 25.9942C33.1165 28.0853 33.2211 30.1763 33.0665 32.2674Z"
          fill="#002703"
        />
        <path
          d="M9.443 10.7617C9.65229 10.9871 9.79133 11.2686 9.84269 11.5718C10.6022 16.0563 13.8648 18.5589 16.5974 18.5589C19.3369 18.5589 22.609 16.0437 23.3578 11.5817C23.4048 11.3013 23.5225 11.0342 23.7135 10.8237C23.9623 10.5494 24.0759 9.88113 24.0759 9.1544C24.0759 8.30399 24.2702 7.10341 23.8817 6.75325C23.736 6.6532 23.5903 6.6532 23.3475 6.70322C22.7162 2.60125 20.6766 0 16.5974 0C12.5182 0 10.4786 2.60125 9.8473 6.70322C9.60449 6.60317 9.41024 6.6532 9.31312 6.75325C8.92463 7.10342 9.11887 8.25397 9.11887 9.1544C9.0823 9.83249 9.18343 10.4822 9.443 10.7617Z"
          fill="#002703"
        />
      </svg>
    ),
  },
  {
    value: "24/7",
    label: "Service Hours",
    icon: (
      <svg
        width="28"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.9349 5.68079C16.3133 5.68079 13.7505 6.45819 11.5707 7.9147C9.3909 9.3712 7.69195 11.4414 6.68869 13.8635C5.68543 16.2855 5.42293 18.9507 5.93439 21.522C6.44585 24.0932 7.70828 26.4551 9.56206 28.3089C11.4158 30.1627 13.7777 31.4251 16.349 31.9366C18.9202 32.448 21.5854 32.1855 24.0075 31.1823C26.4296 30.179 28.4997 28.48 29.9562 26.3002C31.4128 24.1204 32.1902 21.5577 32.1902 18.936C32.1863 15.4217 30.7886 12.0524 28.3036 9.56739C25.8185 7.08238 22.4493 5.68462 18.9349 5.68079ZM24.9692 23.5059C24.8517 23.6548 24.7022 23.7752 24.5317 23.8583C24.3612 23.9413 24.1742 23.9849 23.9845 23.9856C23.6991 23.9879 23.4219 23.8896 23.2017 23.7079L18.1521 19.9207C18.0034 19.8031 17.8831 19.6535 17.8001 19.483C17.717 19.3126 17.6735 19.1256 17.6725 18.936V10.0992C17.6725 9.76439 17.8055 9.44329 18.0423 9.20654C18.279 8.9698 18.6001 8.83679 18.9349 8.83679C19.2697 8.83679 19.5908 8.9698 19.8276 9.20654C20.0643 9.44329 20.1973 9.76439 20.1973 10.0992V18.3301L24.7674 21.7386C24.8988 21.8398 25.0085 21.9664 25.0901 22.1109C25.1716 22.2554 25.2233 22.4147 25.2422 22.5795C25.261 22.7444 25.2465 22.9113 25.1996 23.0704C25.1527 23.2295 25.0744 23.3776 24.9692 23.5059Z"
          fill="#002703"
        />
        <path
          d="M18.9361 0C15.1909 0 11.5298 1.11058 8.41575 3.1913C5.30173 5.27202 2.87465 8.22943 1.44143 11.6895C0.00820487 15.1496 -0.366792 18.9571 0.363859 22.6303C1.09451 26.3035 2.89799 29.6776 5.54625 32.3259C8.1945 34.9741 11.5686 36.7776 15.2418 37.5082C18.915 38.2389 22.7225 37.8639 26.1826 36.4307C29.6427 34.9974 32.6001 32.5704 34.6808 29.4564C36.7615 26.3423 37.8721 22.6812 37.8721 18.936C37.866 13.9158 35.869 9.10286 32.3191 5.55298C28.7692 2.00311 23.9563 0.00610689 18.9361 0ZM18.9361 34.8002C15.7984 34.8002 12.7312 33.8698 10.1224 32.1266C7.51354 30.3835 5.48019 27.9058 4.27947 25.007C3.07874 22.1082 2.76458 18.9184 3.3767 15.8411C3.98883 12.7638 5.49974 9.93702 7.71839 7.71838C9.93703 5.49973 12.7638 3.98882 15.8411 3.37669C18.9185 2.76457 22.1082 3.07874 25.007 4.27946C27.9058 5.48018 30.3835 7.51353 32.1266 10.1224C33.8698 12.7312 34.8002 15.7984 34.8002 18.936C34.7962 23.1422 33.1235 27.175 30.1492 30.1492C27.175 33.1235 23.1423 34.7962 18.9361 34.8002Z"
          fill="#002703"
        />
      </svg>
    ),
  },
  {
    value: "Safety",
    label: "focused operations",
    icon: (
      <svg
        width="25"
        height="41"
        viewBox="0 0 35 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M34.36 10.9607L34.3588 10.9293C34.3412 10.5412 34.3295 10.1307 34.3224 9.67396C34.2894 7.44658 32.5188 5.60414 30.2911 5.47962C25.6465 5.22042 22.0535 3.70591 18.9835 0.713568L18.9573 0.688603C17.9559 -0.229534 16.4454 -0.229534 15.4437 0.688603L15.4175 0.713568C12.3475 3.70591 8.7545 5.22042 4.10988 5.47993C1.88249 5.60414 0.111555 7.44658 0.0785775 9.67427C0.071797 10.1279 0.059777 10.5385 0.0422095 10.9293L0.0403603 11.0023C-0.0499433 15.7385 -0.162129 21.6329 1.80976 26.983C2.89401 29.9251 4.53612 32.4825 6.69015 34.5848C9.14345 36.9789 12.3568 38.8796 16.2408 40.2339C16.3671 40.2779 16.4984 40.3137 16.6322 40.3405C16.8208 40.3781 17.0106 40.3969 17.2005 40.3969C17.3904 40.3969 17.5805 40.3781 17.7688 40.3405C17.9026 40.3137 18.0348 40.2776 18.1618 40.2332C22.0411 38.8765 25.2511 36.9749 27.7022 34.5811C29.8553 32.4782 31.4974 29.9201 32.5826 26.9774C34.5619 21.6113 34.45 15.7058 34.36 10.9607Z"
          fill="#002703"
        />
      </svg>
    ),
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
      <section className="relative w-full min-h-[520px] overflow-hidden bg-maseer-green-deep max-md:min-h-[420px]">
        <HeroBackground
          image={images.about.hero}
          gradient="linear-gradient(90deg, rgba(7,18,11,0.88) 0%, rgba(7,18,11,0.45) 35%, rgba(7,58,11,0.15) 100%)"
        />
        <div className="page-container relative flex min-h-[520px] flex-col justify-end pb-16 pt-8 max-md:min-h-[420px] max-md:pb-12">
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
