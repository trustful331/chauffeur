import { BookingFormBody } from "src/ui/BookingModal";

export function BookingPage() {
  return (
    <section className="page-container py-10 max-md:py-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#eaecf0] bg-white shadow-soft overflow-hidden">
        {/* header */}
        <div className="bg-gradient-to-r from-maseer-green-deep to-[#05280b] p-8 text-white max-md:p-5">
          <h2 className="font-serif text-[28px] font-semibold leading-tight text-maseer-gold max-md:text-xl">
            Book Your Ride
          </h2>
          <p className="mt-2 text-xs font-lato text-white/70 tracking-wide uppercase">
            Airport Transfer · A to B Transfer · Hourly &amp; Daily Chauffeur Services
          </p>
        </div>

        {/* Form Body */}
        <div className="bg-white">
          <BookingFormBody />
        </div>
      </div>
    </section>
  );
}
