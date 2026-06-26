import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";
import { LoadingButton } from "../../ui/Spinner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createGetInTouch } from "src/api/getInTouch";
import toast from "react-hot-toast";

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
      <svg
        width="25"
        height="35"
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32.1916 22.9735C30.0488 22.9735 27.9448 22.6383 25.951 21.9795C24.974 21.6462 23.7729 21.9519 23.1767 22.5643L19.2413 25.5351C14.6773 23.0989 11.866 20.2885 9.46303 15.7588L12.3464 11.926C13.0956 11.1779 13.3643 10.085 13.0423 9.05962C12.3806 7.05533 12.0445 4.95232 12.0445 2.80857C12.0446 1.25991 10.7846 0 9.23608 0H2.80848C1.25991 0 0 1.25991 0 2.80848C0 20.5591 14.441 35 32.1916 35C33.7402 35 35.0001 33.7401 35.0001 32.1915V25.7819C35 24.2334 33.7401 22.9735 32.1916 22.9735Z"
          fill="white"
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
      <svg
        width="25"
        height="35"
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_201_2920)">
          <path
            d="M20.425 20.944C19.5543 21.5245 18.5428 21.8313 17.5 21.8313C16.4572 21.8313 15.4458 21.5245 14.575 20.944L0.233037 11.3823C0.153467 11.3293 0.0759473 11.274 0 11.2171V26.8849C0 28.6812 1.45776 30.1069 3.22198 30.1069H31.7779C33.5743 30.1069 34.9999 28.6491 34.9999 26.8849V11.217C34.9238 11.2741 34.8462 11.3295 34.7664 11.3826L20.425 20.944Z"
            fill="white"
          />
          <path
            d="M1.37061 9.67585L15.7126 19.2375C16.2555 19.5995 16.8777 19.7805 17.4999 19.7805C18.1222 19.7805 18.7445 19.5994 19.2874 19.2375L33.6294 9.67585C34.4876 9.10402 35 8.14699 35 7.11408C35 5.33803 33.5551 3.89319 31.7791 3.89319H3.22089C1.44491 3.89326 0 5.3381 0 7.11579C0 8.14699 0.512422 9.10402 1.37061 9.67585Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_201_2920">
            <rect width="35" height="35" fill="white" />
          </clipPath>
        </defs>
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
      <svg
        width="25"
        height="35"
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 31.1111V35H17.5C27.15 35 35 27.15 35 17.5C35 7.84998 27.15 0 17.5 0C7.84998 0 0 7.84998 0 17.5C0 21.4345 1.32157 25.236 3.73696 28.3103C3.26796 29.949 1.77165 31.1111 0 31.1111ZM23.3333 15.5556H27.2222V19.4444H23.3333V15.5556ZM15.5556 15.5556H19.4444V19.4444H15.5556V15.5556ZM7.77778 15.5556H11.6667V19.4444H7.77778V15.5556Z"
          fill="white"
        />
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
      <svg
        width="30"
        height="35"
        viewBox="0 0 40 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.4844 9.34015H34.0296C31.9418 4.40615 27.3445 0.820542 22.052 0.135735C16.8071 -0.560191 11.6538 1.44905 8.28242 5.49367C7.29133 6.68281 6.50516 7.97559 5.92953 9.34015H3.51562C1.57703 9.34015 0 10.9098 0 12.8392V17.5047C0 19.4341 1.57703 21.0037 3.51562 21.0037H8.3282L7.82469 19.474C6.35867 15.0181 7.18383 10.4655 10.0872 6.98349C12.9402 3.5607 17.297 1.867 21.7476 2.44792C26.4544 3.05816 30.5399 6.37116 32.1587 10.8903L32.1685 10.9165C32.4295 11.6068 32.6126 12.3164 32.7178 13.0465C33.0691 15.2278 32.8689 17.4386 32.1399 19.4399L32.1348 19.4538C30.3253 24.567 25.4586 28.0019 20.0229 28.0019C18.0716 28.0019 16.4844 29.5715 16.4844 31.5009C16.4844 33.4304 18.0614 35 20 35C21.9386 35 23.5156 33.4304 23.5156 31.5009V29.9279C28.1948 28.821 32.1252 25.5196 34.0143 21.0036H36.4844C38.423 21.0036 40 19.434 40 17.5046V12.8391C40 10.9097 38.423 9.34015 36.4844 9.34015Z"
          fill="white"
        />
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
      const payload = {
        full_name: data.name.trim(),
        phone_number: data.phone.trim(),
        email_address: data.email.trim(),
        note: `Subject: ${data.subject.trim()}\nMessage: ${(data.message || "").trim()}`.trim(),
      };

      await createGetInTouch(payload);
      toast.success("Your message has been sent successfully! 🎉");
      reset();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to send message";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden bg-maseer-cream">
      <section className="relative w-full min-h-[480px] overflow-hidden bg-maseer-green-deep">
        <HeroBackground
          image={images.contact.hero}
          gradient="linear-gradient(90deg, rgba(7,18,11,0.88) 0%, rgba(7,18,11,0.45) 35%, rgba(7,58,11,0.15) 100%)"
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
                <div className="mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full bg-maseer-green text-white">
                  {card.icon}
                </div>
                <h3 className="mt-5 font-lato text-[18px] font-bold text-[#1a1a1a]">
                  {card.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[220px] font-lato text-[14px] leading-[18px] text-maseer-muted">
                  {card.desc}
                </p>
                <p
                  className={[
                    "mt-4 font-lato text-[18px] font-bold",
                    card.detailTone === "green"
                      ? "text-maseer-green"
                      : "text-[#1a1a1a]",
                  ].join(" ")}
                >
                  {card.detail}
                </p>
                <p className="mt-2 font-lato text-[14px] leading-[16px] text-black">
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
              <h2 className="max-w-[420px] font-lato text-[28px] font-bold leading-[1.25] text-maseer-green">
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
                className="btn-primary mt-6 !rounded-none !px-14 disabled:cursor-not-allowed disabled:opacity-70"
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
                  {openFaq === i ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
