import { useEffect, useMemo, useState } from "react";
import { BookingModal } from "../../ui/BookingModal";
import {
  FLEET_CATEGORIES,
  FLEET_VEHICLES,
  mapFleetItemToVehicle,
  SHOWCASE_FEATURES,
  type FleetCategory,
  type FleetVehicle,
} from "../../data/fleetData";
import {
  FleetCta,
  FleetFilterBar,
  FleetHero,
  FleetStandards,
} from "./FleetShared";
import { fetchFleets } from "src/api/admin/fleet";

function FeatureIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" />
      <path
        d="M7 10l2 2 4-4"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Version 1 — interactive arc showcase with carousel */
export function FleetPage() {
  const [category, setCategory] = useState<FleetCategory>("All Vehicles");
  const [slide, setSlide] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [liveFleets, setLiveFleets] = useState<FleetVehicle[]>(FLEET_VEHICLES);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveFleet() {
      try {
        console.log("[FleetPage] Fetching live fleets from API...");
        const response = await fetchFleets({ is_active: true });
        console.log("[FleetPage] API response:", response);

        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
          const mapped = response.data.map(mapFleetItemToVehicle);
          console.log("[FleetPage] Mapped live fleets for showcase:", mapped);
          if (isMounted) setLiveFleets(mapped);
        }
      } catch (err) {
        console.warn("[FleetPage] Live API fetch failed, keeping fallback:", err);
      }
    }

    loadLiveFleet();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      category === "All Vehicles"
        ? liveFleets
        : liveFleets.filter((v) => v.category === category),
    [category, liveFleets],
  );

  const current = filtered[slide] ?? filtered[0];

  const onCategoryChange = (cat: string) => {
    setCategory(cat as FleetCategory);
    setSlide(0);
  };

  return (
    <div className="overflow-hidden bg-maseer-cream">
      <FleetHero tagline="UNMATCHED LUXURY" />

      <FleetFilterBar
        categories={FLEET_CATEGORIES}
        active={category}
        onChange={onCategoryChange}
      />

      <section className="section-pad bg-white">
        <div className="relative mx-auto h-[520px] max-w-[980px] max-md:h-auto max-md:min-h-[300px] max-md:pb-8">
          {SHOWCASE_FEATURES.map((feat) => (
            <div
              key={feat.label}
              className={`absolute ${feat.pos} z-10 flex max-w-[140px] flex-col items-center gap-2 text-center max-md:hidden`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maseer-green shadow-soft">
                <FeatureIcon />
              </div>
              <p className="text-[10px] font-semibold leading-snug text-maseer-green">
                {feat.label}
              </p>
            </div>
          ))}

          <div className="absolute bottom-0 left-1/2 w-[720px] -translate-x-1/2 max-md:relative max-md:w-full max-md:translate-x-0">
            <div
              className="mx-auto h-[120px] w-[620px] rounded-t-full bg-maseer-line max-md:h-[80px] max-md:w-[min(100%,360px)]"
              aria-hidden
            />
            {current && (
              <img
                src={current.image}
                alt={current.name}
                className="relative -mt-[100px] mx-auto h-[220px] w-[480px] object-contain drop-shadow-float max-md:-mt-[60px] max-md:h-[160px] max-md:w-full max-md:max-w-[340px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800";
                }}
              />
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setBookingModalOpen(true)}
            className="btn-gold !rounded-full !uppercase !tracking-wide"
          >
            Book a Ride
            <span aria-hidden>→</span>
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            {filtered.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show vehicle ${i + 1}`}
                onClick={() => setSlide(i)}
                className={[
                  "h-2.5 rounded-full transition-all duration-300",
                  slide === i
                    ? "w-8 bg-maseer-green"
                    : "w-2.5 bg-maseer-line hover:bg-maseer-muted/40",
                ].join(" ")}
              />
            ))}
          </div>

          {current && (
            <div className="mt-4">
              <p className="heading-md">{current.name}</p>
              {current.availabilityNote ? (
                <p className="mt-2 font-lato text-[11px] font-semibold uppercase tracking-wide text-maseer-gold">
                  {current.availabilityNote}
                </p>
              ) : null}
              <p className="mt-1 font-lato text-[11px] leading-4 text-maseer-muted">
                Vehicle shown for illustration; an equivalent model may be supplied.
              </p>
            </div>
          )}
        </div>
      </section>

      <FleetStandards />
      <FleetCta buttonLabel="Book a Ride" />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        vehicleId={current?.id}
        vehicleName={current?.name}
      />
    </div>
  );
}
