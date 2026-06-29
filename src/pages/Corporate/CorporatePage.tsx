import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";
import { GoldOffsetImage } from "../../ui/GoldOffsetImage";

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
    text: "Dependable service you can count on, whether it's day or night, rain or shine.",
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
      <section className="relative w-full min-h-[560px] overflow-hidden bg-maseer-green-deep max-md:min-h-[420px]">
        <HeroBackground
          image={images.corporate.hero}
          gradient="linear-gradient(90deg, rgba(7,18,11,0.88) 0%, rgba(7,18,11,0.45) 35%, rgba(7,58,11,0.15) 100%)"
        />
        <div className="page-container relative flex min-h-[560px] flex-col justify-end pb-16 pt-28 max-md:min-h-[420px] max-md:pb-12 max-md:pt-20">
          <p className="eyebrow">UNMATCHED LUXURY</p>
          <h1 className="mt-3 font-serif text-figma-hero text-white max-md:text-[32px] max-md:leading-[1.15]">
            Our VISION
          </h1>
          <p className="mt-4 max-w-[560px] text-figma-body text-white/90">
            Our goal is to become a trusted long-term mobility partner for
            organizations looking for premium service standards and reliable
            operational execution.
          </p>
        </div>
      </section>

      <section className="bg-[#f5f5f0] py-[88px] max-md:py-12">
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-2 max-md:gap-10">
          <div>
            <p className="eyebrow">OUR MISSION</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              Corporate &amp; partners.
            </h2>
            <p className="font-serif text-figma-h2 text-maseer-gold max-md:text-[28px] max-md:leading-[1.2]">
              Solution.
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
        <div className="page-container grid grid-cols-4 gap-8 max-md:grid-cols-1">
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

      <section className="bg-[#f5f5f0] py-[88px] max-md:py-12">
        <div className="page-container grid items-center gap-[97px] lg:grid-cols-2 max-md:gap-10">
          <GoldOffsetImage
            src={images.corporate.sustainability}
            alt="Sustainability and corporate partnership"
            offset="left"
          />
          <div>
            <p className="eyebrow">OUR VISION</p>
            <h2 className="mt-3 font-serif text-figma-h2 text-maseer-green-text max-md:text-[28px] max-md:leading-[1.2]">
              Sustainability &amp; Vision
            </h2>
            <p className="font-serif text-figma-h2 text-maseer-gold max-md:text-[28px] max-md:leading-[1.2]">2030.</p>
            <p className="mt-6 text-[15.25px] leading-[25px] text-maseer-muted">
              Maseer supports the vision of a smarter and more sustainable
              transportation future in Saudi Arabia. Through our Green Class
              category, we aim to promote environmentally conscious mobility
              solutions while maintaining luxury and performance standards.
            </p>
            <p className="mt-4 text-[15.25px] leading-[25px] text-maseer-muted">
              Our focus aligns with Saudi Vision 2030 by contributing toward
              innovation, premium tourism experiences, sustainable mobility, and
              world-class hospitality services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
