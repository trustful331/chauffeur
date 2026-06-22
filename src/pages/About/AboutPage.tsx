import { images } from '../../assets/images'
import { HeroBackground } from '../../ui/HeroBackground'
import { GoldOffsetImage } from '../../ui/GoldOffsetImage'

const STATS = [
  { value: '50K+', label: 'Happy customers', icon: (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="11" cy="10" r="4" stroke="#073a0b" strokeWidth="1.6" />
      <circle cx="21" cy="10" r="4" stroke="#073a0b" strokeWidth="1.6" />
      <path d="M4 26c0-5 3.5-8 7-8s7 3 7 8M14 26c0-5 3.5-8 7-8s7 3 7 8" stroke="#073a0b" strokeWidth="1.6" />
    </svg>
  )},
  { value: '200+', label: 'Professional Drivers', icon: (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="8" r="4" stroke="#073a0b" strokeWidth="1.6" />
      <path d="M8 28v-4c0-3 2.5-5 8-5s8 2 8 5v4" stroke="#073a0b" strokeWidth="1.6" />
      <path d="M22 14l4 2v4h-3" stroke="#073a0b" strokeWidth="1.6" />
    </svg>
  )},
  { value: '24/7', label: 'Service Hours', icon: (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="10" stroke="#073a0b" strokeWidth="1.6" />
      <path d="M16 10v6l4 2" stroke="#073a0b" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )},
  { value: '99.8%', label: 'Safety Record', icon: (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 4L6 8v8c0 6.5 4.3 12.5 10 14 5.7-1.5 10-7.5 10-14V8l-10-4z" stroke="#073a0b" strokeWidth="1.6" />
    </svg>
  )},
]

const VALUES = [
  { title: 'Safety First', text: 'We prioritize the safety and security of our passengers and drivers above everything else.', icon: (
    <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M14 3L5 7v6c0 5.5 3.8 10.6 9 12 5.2-1.4 9-6.5 9-12V7l-9-4z" stroke="#073a0b" strokeWidth="1.5" />
    </svg>
  )},
  { title: 'Customer Focus', text: 'Every decision we make is centered around delivering exceptional customer experiences.', icon: (
    <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M14 23s-8-5-8-11a5 5 0 0110 0c0 6-8 11-8 11z" stroke="#073a0b" strokeWidth="1.5" />
    </svg>
  )},
  { title: 'Reliability', text: 'Dependable service you can count on, whether it is day or night, rain or shine.', icon: (
    <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M15 3L7 16h7l-1.5 9 9-14h-7l2.5-8z" stroke="#073a0b" strokeWidth="1.5" />
    </svg>
  )},
  { title: 'Innovation', text: 'Continuously improving our technology and services to better serve our community.', icon: (
    <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none" aria-hidden>
      <circle cx="14" cy="14" r="4" stroke="#073a0b" strokeWidth="1.5" />
      <path d="M14 4v3M14 21v3M4 14h3M21 14h3" stroke="#073a0b" strokeWidth="1.5" />
    </svg>
  )},
]

export function AboutPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative w-full min-h-[520px] overflow-hidden bg-maseer-green-deep">
        <HeroBackground
          image={images.about.hero}
          gradient="linear-gradient(180deg, rgba(7,58,11,0.25) 0%, rgba(7,58,11,0.6) 55%, rgba(7,58,11,0.9) 100%)"
        />
        <div className="page-container relative flex min-h-[520px] flex-col justify-end pb-16 pt-8">
          <p className="eyebrow">UNMATCHED LUXURY</p>
          <h1 className="mt-3 font-serif text-figma-hero text-white">About US</h1>
          <p className="mt-4 max-w-[580px] text-figma-body text-white/90">
            Maseer is a premium chauffeur and mobility company in Saudi Arabia offering luxury transportation
            services with a strong focus on comfort, reliability, and professionalism.
          </p>
        </div>
      </section>

      <section className="border-b border-[#f0f0f0] bg-white py-[72px]">
        <div className="page-container grid grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <article key={stat.label} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center">{stat.icon}</div>
              <p className="mt-5 font-serif text-[36px] font-semibold leading-none text-maseer-green-text">{stat.value}</p>
              <p className="mt-2 text-[14px] text-maseer-muted">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-[88px]">
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-2">
          <div className="relative">
            <GoldOffsetImage src={images.about.hospitality} alt="Chauffeur greeting guest" offset="right" />
            <span className="absolute bottom-6 right-0 z-20 rounded bg-maseer-gold-bright px-3 py-1.5 text-[11px] font-semibold text-maseer-green-text">
              — Mr. Affan
            </span>
          </div>
          <div>
            <p className="eyebrow">THE MASEER EXPERIENCE</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text">
              Hospitality on <span className="text-maseer-gold">wheels.</span>
            </h2>
            <p className="mt-5 text-[15.25px] leading-[25px] text-maseer-muted">
              We specialize in airport transfers, executive transportation, city-to-city travel, chauffeur
              services, and customized mobility solutions for corporates, hotels, travel management companies,
              event organizers, and VIP guests.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              At Maseer, we believe transportation is not just about moving people from one place to another.
              It is about creating a seamless experience that reflects professionalism, comfort, safety, and luxury.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              Every journey is choreographed — chilled water, scented cabin, climate prepared, music to your
              taste. The car is ready before you ever step out.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-[88px]">
        <div className="page-container grid grid-cols-4 gap-8">
          {VALUES.map((item) => (
            <article key={item.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center">{item.icon}</div>
              <h3 className="mt-5 text-lg font-bold text-maseer-green">{item.title}</h3>
              <p className="mx-auto mt-3 max-w-[220px] text-[13px] leading-5 text-maseer-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
