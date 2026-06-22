import { Link } from 'react-router-dom'
import { images } from '../../assets/images'
import { SplitHeading } from '../../ui/SplitHeading'
import { HeroBackground } from '../../ui/HeroBackground'

const COVERAGE_LARGE = [
  { title: 'Airport Transfers Service', text: 'Enjoy professional and seamless airport transfers.', span: 'col-span-7', image: images.services.coverage[0] },
  { title: 'Limousine Service', text: 'Travel in luxury with our VIP limousine service.', span: 'col-span-5', image: images.services.coverage[1] },
]

const COVERAGE_SMALL = [
  { title: 'Intercity Travel service', text: 'Travel between cities with comfort.', image: images.services.coverage[2] },
  { title: 'Hire by the Hour', text: 'Book the hour for flexible rides.', image: images.services.coverage[3] },
  { title: 'Event transport', text: 'Luxury Chauffeur service for any occasion.', image: images.services.coverage[4] },
]

const ITINERARY_CARDS = [
  {
    title: 'Airport Transfers',
    text: 'Professional airport pickup and drop-off services with real-time coordination, meet and greet support, and premium chauffeur experience for business and leisure travelers.',
    icon: 'airplane',
  },
  {
    title: 'Hourly Chauffeur',
    text: 'transportation services connecting major cities across Saudi Arabia including Riyadh, Jeddah, Makkah, Madinah, Dammam, and AlUla',
    icon: 'clock',
  },
  {
    title: 'Corporate Mobility',
    text: 'transportation solutions for corporates, government entities, VIP guests, business meetings, conferences',
    icon: 'briefcase',
  },
  {
    title: 'VIP Tourism',
    text: 'Premium chauffeur services designed for executives, diplomats, celebrities, and high-profile guests requiring privacy, comfort, professionalism, and luxury.',
    icon: 'crown',
  },
  {
    title: 'Professional Chauffeurs',
    text: 'Comfortable and organized Ziyarah transportation services in Makkah and Madinah designed for families, groups, and international visitors',
    icon: 'chauffeur',
  },
  {
    title: 'Luxury Fleet',
    text: 'Luxury transportation management for conferences, corporate events, exhibitions, weddings, entertainment events, and VIP delegations.',
    icon: 'diamond',
  },
  {
    title: 'Zuarah tours',
    text: 'Comfortable and organized Ziyarah transportation services in Makkah and Madinah designed for families, groups, and international visitors',
    icon: 'medal',
  },
  {
    title: '24/7 Support',
    text: 'From AlUla to NEOM — bespoke journeys curated.',
    icon: 'support',
  },
] as const

type ItineraryIcon = (typeof ITINERARY_CARDS)[number]['icon']

function ItineraryIcon({ type }: { type: ItineraryIcon }) {
  const className = 'h-5 w-5 text-white'
  switch (type) {
    case 'airplane':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 2l2.5 6H18l-5 4 2 6-5-3.5L5 18l2-6-5-4h5.5L10 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )
    case 'clock':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
          <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="7" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 7V5.5A1.5 1.5 0 018.5 4h3A1.5 1.5 0 0113 5.5V7M3 10h14" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    case 'crown':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3 14h14M4 14l1.5-7 3 4 1.5-5 1.5 5 3-4L16 14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )
    case 'chauffeur':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M4 14h12M6 14V9a4 4 0 018 0v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M3 14h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    case 'diamond':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 3l7 7-7 7-7-7 7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )
    case 'medal':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7.5 11.5L6 17l4-2 4 2-1.5-5.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )
    case 'support':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5 10a5 5 0 0110 0v2.5a1.5 1.5 0 01-1.5 1.5H11v2.5l-2-1.5H6.5A1.5 1.5 0 015 12.5V10z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <text x="10" y="11.5" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="700">24</text>
        </svg>
      )
  }
}

const JOURNEY_STEPS = [
  {
    n: '1',
    title: 'Select Service',
    text: 'Choose the vehicle and service type that perfectly aligns with your requirements.',
  },
  {
    n: '2',
    title: 'Configure Details',
    text: 'Provide date, time, and specific requests to customize your chauffeur experience.',
  },
  {
    n: '3',
    title: 'Confirm & Relax',
    text: "Receive instant confirmation and your chauffeur's details before departure.",
  },
] as const

function CoverageCard({ title, text, image, height = 'h-[314px]' }: { title: string; text: string; image: string; height?: string }) {
  return (
    <article
      className={`card-image ${height}`}
      style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 54.21%, rgba(0,0,0,0.84) 100%), url(${image})` }}
    >
      <div className="absolute bottom-6 left-6 right-6 text-white">
        <h3 className="font-serif text-[29.48px] leading-[35px]">{title}</h3>
        <p className="mt-2 max-w-[90%] text-[16.09px] leading-[19px] text-white/90">{text}</p>
      </div>
    </article>
  )
}

function ItineraryCard({ title, text, icon }: { title: string; text: string; icon: ItineraryIcon }) {
  return (
    <article className="flex min-h-[248px] flex-col rounded-2xl bg-[#F1F1EF] p-8">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
        <ItineraryIcon type={icon} />
      </div>
      <h3 className="font-lato text-[18px] font-bold leading-[22px] text-maseer-green-text">{title}</h3>
      <p className="mt-3 flex-1 font-lato text-[12.5px] leading-[18px] text-maseer-muted">{text}</p>
      <span className="mt-6 text-[14px] text-maseer-green-text" aria-hidden>→</span>
    </article>
  )
}

export function ServicesPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative w-full min-h-[620px] overflow-hidden bg-maseer-green-deep">
        <HeroBackground
          image={images.services.hero}
          gradient="linear-gradient(90deg, rgba(7,58,11,0.92) 0%, rgba(7,58,11,0.72) 42%, rgba(7,58,11,0.35) 100%)"
        />
        <div className="page-container relative pb-24 pt-[72px]">
          <p className="eyebrow">EXCELLENCE IN MOTION</p>
          <h1 className="mt-4 max-w-[640px] font-serif text-figma-hero font-semibold text-white">
            Tailored Travel Solutions
          </h1>
          <p className="mt-5 max-w-[520px] text-figma-body text-white/85">
            We specialize in airport transfers, executive transportation, city-to-city travel, chauffeur
            services, and customized mobility solutions for corporates, hotels, travel management companies,
            event organizers, and VIP guests.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/booking" className="btn-gold min-w-[180px]">Make a Booking</Link>
            <Link to="/fleet" className="btn-outline min-w-[160px]">Explore Fleet</Link>
          </div>
        </div>
      </section>

      <section className="page-container py-[100px]">
        <div className="text-center">
          <SplitHeading before="Our " accent="Service Coverage" align="center" />
          <p className="mx-auto mt-4 max-w-[640px] text-center text-[18px] leading-[26px] text-maseer-green-text">
            From the door of your residence to the door of your private jet every detail attended to.
          </p>
        </div>
        <div className="mt-[52px] space-y-3">
          <div className="grid grid-cols-12 gap-3">
            {COVERAGE_LARGE.map((card) => (
              <div key={card.title} className={card.span}>
                <CoverageCard title={card.title} text={card.text} image={card.image} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {COVERAGE_SMALL.map((card) => (
              <CoverageCard
                key={card.title}
                title={card.title}
                text={card.text}
                image={card.image}
                height="h-[260px]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-maseer-cream py-[88px]">
        <div className="page-container">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-0.5 w-9 bg-primary" aria-hidden />
              <p className="font-lato text-xs font-bold uppercase tracking-[0.12em] text-primary">
                SERVICES
              </p>
            </div>
            <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text">
              An itinerary, <span className="text-primary">composed.</span>
            </h2>
            <p className="mt-4 max-w-[560px] font-lato text-[14px] leading-[22px] text-maseer-green-text/80">
              Professional airport pickup and drop-off services with real-time coordination, meet and
              greet support, and premium chauffeur experience for business and leisure travelers.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-4 gap-6">
            {ITINERARY_CARDS.map((card) => (
              <ItineraryCard key={card.title} title={card.title} text={card.text} icon={card.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-maseer-cream py-[100px]">
        <div className="page-container">
          <div className="grid grid-cols-2 items-center gap-[80px]">
            <div>
              <h2 className="font-serif text-[42px] font-semibold leading-[1.15] text-maseer-green-text">
                Your Journey, Simplified.
              </h2>
              <p className="mt-4 max-w-[480px] font-lato text-[14px] leading-[22px] text-maseer-muted">
                Our seamless booking process ensures you spend less time planning and more time enjoying
                the ride.
              </p>
              <ol className="mt-10 space-y-10">
                {JOURNEY_STEPS.map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-maseer-gold font-lato text-base font-semibold text-maseer-gold">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="font-lato text-base font-bold text-maseer-green-text">{step.title}</h3>
                      <p className="mt-2 max-w-[420px] font-lato text-[13px] leading-[20px] text-maseer-muted">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative flex justify-end">
              <img
                src={images.services.sync}
                alt="Maseer app booking and instant sync"
                className="w-full max-w-[400px] rounded-2xl border-4 border-white object-cover shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-[100px]">
        <div className="rounded-[20px] bg-maseer-green px-12 py-16 text-center">
          <h2 className="font-serif text-[40px] font-semibold leading-[48px] text-white">Need a custom solution?</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-6 text-white/75">
            Contact our dedicated team to find the best bespoke options for your unique travel requirements.
          </p>
          <Link to="/contact" className="btn-gold mt-8">
            Contact for a Request
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
