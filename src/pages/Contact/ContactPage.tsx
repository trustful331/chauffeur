import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";
import { LoadingButton } from "../../ui/Spinner";

type ContactForm = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const CONTACT_CARDS = [
  {
    title: "Safety First",
    desc: "Speak directly with our customer service team",
    detail: "(555) 123-RIDE",
    note: "Available 24/7 for bookings and support",
    detailTone: "dark" as const,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6.5 4h3l1.5 4-2 1.2a12 12 0 005.3 5.3L16.5 13l4 1.5v3a2 2 0 01-2.2 2 16 16 0 01-12-12A2 2 0 016.5 4z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    title: "Email Support",
    desc: "Send us a message and we'll respond within 2 hour",
    detail: "support@maseer.com",
    note: "For general inquiries and feedback",
    detailTone: "green" as const,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Live Chat",
    desc: "Get instant help through our website chat",
    detail: "Available on website",
    note: "Fastest response time during business hours",
    detailTone: "dark" as const,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 5h16v10H8l-4 4V5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="10" r="0.8" fill="currentColor" />
        <circle cx="12" cy="10" r="0.8" fill="currentColor" />
        <circle cx="15" cy="10" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Emergency Line",
    desc: "For urgent safety or emergency situations",
    detail: "(555) 123-HELP",
    note: "24/7 emergency assistance",
    detailTone: "dark" as const,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 14a8 8 0 0116 0v2H4v-2z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M8 18h8M12 6v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const FAQ_ITEMS = [
  {
    q: "How flexible are Maseer booking and cancellation policies?",
    a: "We offer flexible rescheduling and cancellation options for most bookings. Corporate clients receive tailored terms aligned with their mobility programs and service agreements.",
  },
  {
    q: "What corporate and event transportation options do you provide?",
    a: "",
  },
  {
    q: "Can I schedule a consultation before setting up a corporate account?",
    a: "",
  },
  {
    q: "Do you provide transportation for large groups and delegations?",
    a: "",
  },
];

function FormField({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-figma border border-[#e0e0e0] bg-white px-4 py-3.5 transition-all focus-within:border-maseer-gold">
      <div className="min-w-0 flex-1">{children}</div>
      <span className="shrink-0 text-maseer-green/55">{icon}</span>
    </div>
  );
}

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<ContactForm>();

  const onContactSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log("Contact form payload:", data);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden bg-maseer-cream">
      <section className="relative w-full min-h-[480px] overflow-hidden bg-maseer-green-deep">
        <HeroBackground
          image={images.contact.hero}
          gradient="linear-gradient(180deg, rgba(7,58,11,0.2) 0%, rgba(7,58,11,0.55) 55%, rgba(7,58,11,0.88) 100%)"
        />
        <div className="page-container relative flex min-h-[480px] flex-col justify-end pb-14 pt-8">
          <p className="eyebrow">UNMATCHED LUXURY</p>
          <h1 className="mt-3 font-serif text-figma-hero text-white">
            Contact Us
          </h1>
          <p className="mt-4 max-w-[560px] text-figma-body text-white/90">
            Get in touch with Maseer for bookings, partnerships, and corporate
            transportation solutions.
          </p>
        </div>
      </section>

      <section className="bg-maseer-cream py-[80px]">
        <div className="page-container">
          <div className="grid grid-cols-4 gap-10">
            {CONTACT_CARDS.map((card) => (
              <article key={card.title} className="text-center">
                <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-maseer-green text-white">
                  {card.icon}
                </div>
                <h3 className="mt-5 font-lato text-[15px] font-bold text-[#1a1a1a]">
                  {card.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[220px] font-lato text-[12px] leading-[18px] text-maseer-muted">
                  {card.desc}
                </p>
                <p
                  className={[
                    "mt-4 font-lato text-[15px] font-bold",
                    card.detailTone === "green" ? "text-maseer-green" : "text-[#1a1a1a]",
                  ].join(" ")}
                >
                  {card.detail}
                </p>
                <p className="mt-2 font-lato text-[11px] leading-[16px] text-[#9ca3af]">
                  {card.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-maseer-cream pb-[88px] pt-6">
        <div className="page-container">
          <div className="grid grid-cols-[1fr_1.15fr] items-start gap-14">
            <div className="pt-4">
              <h2 className="max-w-[340px] font-lato text-[32px] font-bold leading-[1.25] text-maseer-green">
                We&apos;re Excited To Hear From You!
              </h2>
              <div className="mt-8">
                <img
                  src={images.contact.illustration}
                  alt=""
                  className="max-h-[300px] w-full max-w-[380px] object-contain"
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onContactSubmit)}
              className="rounded-2xl border border-[#e8e8e8] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] lg:p-10"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    icon={
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <circle
                          cx="8"
                          cy="5"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    }
                  >
                    <input
                      {...register("name", { required: true })}
                      placeholder="Your name"
                      className="w-full bg-transparent font-lato text-[13px] outline-none placeholder:text-[#aaa]"
                    />
                  </FormField>
                  <FormField
                    icon={
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M4 2h2l1 3-1.5 1a7 7 0 003 3L10 8l3 1v2a1.5 1.5 0 01-1.5 1.5A8 8 0 014 3.5 2 2 0 014 2z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    }
                  >
                    <input
                      {...register("phone", { required: true })}
                      placeholder="Phone"
                      className="w-full bg-transparent font-lato text-[13px] outline-none placeholder:text-[#aaa]"
                    />
                  </FormField>
                </div>
                <FormField
                  icon={
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <rect
                        x="1.5"
                        y="3.5"
                        width="13"
                        height="9"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M1.5 5l6.5 4 6.5-4"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  }
                >
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent font-lato text-[13px] outline-none placeholder:text-[#aaa]"
                  />
                </FormField>
                <input
                  {...register("subject", { required: true })}
                  placeholder="Subject"
                  className="input-field font-lato text-[13px] placeholder:text-[#aaa]"
                />
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Write something"
                  className="input-field resize-none font-lato text-[13px] placeholder:text-[#aaa]"
                />
              </div>
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                loadingText="Sending..."
                className="btn-primary mt-6 !rounded-lg !px-7 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="inline-flex items-center gap-2">
                  Send message
                  <span aria-hidden>→</span>
                </span>
              </LoadingButton>
            </form>
          </div>
        </div>
      </section>

      <section className="page-container pb-20">
        <p className="eyebrow !text-maseer-green">QUESTION ABOUT OUR SERVICE</p>
        <h2 className="mt-2 font-serif text-[40px] font-bold leading-[52px] text-maseer-green">
          Frequently asked Questions
        </h2>
        <div className="mt-8 divide-y divide-maseer-green/25 border-t border-maseer-green/25">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className="py-5">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div>
                  <p className="text-[15.91px] font-bold text-maseer-green">
                    {item.q}
                  </p>
                  {openFaq === i && item.a && (
                    <p className="mt-3 max-w-[913px] text-[15.91px] leading-7 text-maseer-green/85">
                      {item.a}
                    </p>
                  )}
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-maseer-green text-maseer-green">
                  {openFaq === i ? "˄" : "˅"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
