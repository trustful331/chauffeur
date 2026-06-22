import { images } from '../../assets/images'
import { HeroBackground } from '../../ui/HeroBackground'
import { GoldOffsetImage } from '../../ui/GoldOffsetImage'

const VALUES = [
  {
    title: 'Safety First',
    text: 'We prioritize the safety and security of our passengers and drivers above everything else.',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M16 4L6 8v8c0 6.5 4.3 12.5 10 14 5.7-1.5 10-7.5 10-14V8l-10-4z" stroke="#073a0b" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Customer Focus',
    text: 'Every decision we make is centered around delivering exceptional customer experiences.',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M16 26s-10-6.2-10-14a6 6 0 0112 0c0 7.8-10 14-10 14z" stroke="#073a0b" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Reliability',
    text: 'Dependable service you can count on, whether it is day or night, rain or shine.',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M18 4L8 18h8l-2 10 12-18h-8l2-6z" stroke="#073a0b" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Innovation',
    text: 'Continuously improving our technology and services to better serve our community.',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M16 6v4M16 22v4M6 16h4M22 16h4M9 9l3 3M20 20l3 3M23 9l-3 3M12 20l-3 3" stroke="#073a0b" strokeWidth="1.8" />
        <circle cx="16" cy="16" r="4" stroke="#073a0b" strokeWidth="1.8" />
      </svg>
    ),
  },
]

export function CorporatePage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative w-full min-h-[560px] overflow-hidden bg-maseer-green-deep">
        <HeroBackground
          image={images.corporate.hero}
          gradient="linear-gradient(180deg, rgba(7,58,11,0.15) 0%, rgba(7,58,11,0.55) 55%, rgba(7,58,11,0.88) 100%)"
        />
        <div className="page-container relative flex min-h-[560px] flex-col justify-end pb-16 pt-28">
          <p className="eyebrow">UNMATCHED LUXURY</p>
          <h1 className="mt-3 font-serif text-figma-hero text-white">Our VISION</h1>
          <p className="mt-4 max-w-[560px] text-figma-body text-white/90">
            Our goal is to become a trusted long-term mobility partner for organizations looking for premium
            service standards and reliable operational execution.
          </p>
        </div>
      </section>

      <section className="bg-[#f5f5f0] py-[88px]">
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-2">
          <div>
            <p className="eyebrow">OUR MISSION</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text">Corporate &amp; partners.</h2>
            <p className="font-serif text-figma-h2 text-maseer-gold">Solution.</p>
            <p className="mt-6 text-[15.25px] leading-[25px] text-maseer-muted">
              Maseer works closely with corporates, travel management companies, tourism operators, hotels,
              serviced residences, event organizers, and government entities to provide reliable transportation
              solutions across Saudi Arabia.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              We offer dedicated operational handling, flexible booking support, professional chauffeurs, and
              scalable transportation solutions tailored to partner requirements.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              Our team ensures consistent service quality, transparent communication, and dependable execution
              for every corporate mobility program we support.
            </p>
          </div>
          <GoldOffsetImage src={images.corporate.partners} alt="Chauffeur greeting corporate guest" offset="right" className="justify-self-end" />
        </div>
      </section>

      <section className="bg-white py-[88px]">
        <div className="page-container grid grid-cols-4 gap-8">
          {VALUES.map((item) => (
            <article key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center">{item.icon}</div>
              <h3 className="mt-5 text-lg font-bold text-maseer-green">{item.title}</h3>
              <p className="mx-auto mt-3 max-w-[220px] text-[13px] leading-5 text-maseer-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5f0] py-[88px]">
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-2">
          <GoldOffsetImage src={images.corporate.sustainability} alt="Sustainability and corporate partnership" offset="left" />
          <div>
            <p className="eyebrow">OUR VISION</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text">Sustainability &amp; Vision</h2>
            <p className="font-serif text-figma-h2 text-maseer-gold">2030.</p>
            <p className="mt-6 text-[15.25px] leading-[25px] text-maseer-muted">
              Aligned with Saudi Vision 2030, Maseer is committed to advancing sustainable mobility through
              modern fleet management, operational efficiency, and responsible service practices.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              We continue investing in eco-conscious transportation solutions while maintaining the premium
              chauffeur experience our partners and guests expect.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
