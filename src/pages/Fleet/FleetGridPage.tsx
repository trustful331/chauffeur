import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FLEET_GRID_CATEGORIES,
  getFleetGridVehicles,
  type FleetGridCategory,
  type FleetVehicle,
} from "../../data/fleetData";
import {
  FleetCta,
  FleetFilterBar,
  FleetHero,
  FleetStandards,
} from "./FleetShared";

function PersonIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-maseer-gold"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H3z" />
    </svg>
  );
}

function LuggageIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-maseer-gold"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="10"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6 5V4a2 2 0 014 0v1M8 8v3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FeatureIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-maseer-gold"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.5 8l2 2 3-3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VehicleCard({ vehicle }: { vehicle: FleetVehicle }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <div className="relative h-[210px] bg-[#f3f4f2]">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 rounded-md bg-maseer-gold px-2.5 py-1 font-lato text-[10px] font-bold uppercase tracking-wide text-white">
          {vehicle.bodyType}
        </span>
      </div>
      <div className="p-7">
        <h3 className="font-serif text-[22px] font-semibold leading-tight text-maseer-green-text">
          {vehicle.name}
        </h3>
        <div className="mt-3 flex gap-6 font-lato text-[12px] text-maseer-muted">
          <span className="flex items-center gap-1.5">
            <PersonIcon />
            {vehicle.seats} Seats
          </span>
          <span className="flex items-center gap-1.5">
            <LuggageIcon />
            {vehicle.bagLabel}
          </span>
        </div>
        <ul className="mt-4 space-y-2.5">
          {vehicle.features.slice(0, 3).map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 font-lato text-[12px] leading-[18px] text-maseer-green-text/85"
            >
              <FeatureIcon />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-3">
          <Link
            to={`/fleet/${vehicle.id}`}
            className="link-arrow shrink-0 pb-1 font-lato text-xs font-semibold"
          >
            View Details <span aria-hidden>↗</span>
          </Link>
          <Link
            to={`/booking?vehicle=${vehicle.id}`}
            className="block flex-1 rounded-lg bg-primary py-3.5 text-center font-lato text-sm font-bold text-white transition hover:brightness-105"
          >
            Book This Vehicle
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FleetGridPage() {
  const [category, setCategory] = useState<FleetGridCategory>("All Vehicles");

  const vehicles = useMemo(() => getFleetGridVehicles(category), [category]);

  return (
    <div className="overflow-hidden bg-maseer-cream">
      <FleetHero tagline="EXPERIENCE LUXURY" />
      <FleetFilterBar
        categories={FLEET_GRID_CATEGORIES}
        active={category}
        onChange={(cat) => setCategory(cat as FleetGridCategory)}
        showLabel
        variant="grid"
      />

      <section className="page-container pb-20 pt-4">
        <div className="grid grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={`${vehicle.id}-${index}`} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <FleetStandards />
      <FleetCta buttonLabel="Reserve Your Ride" />
    </div>
  );
}
