import { useMemo, useState } from "react";
import { BookingModal } from "../../ui/BookingModal";
import {
  Wifi,
  Snowflake,
  Shield,
  Music,
  Droplets,
  UserCheck,
  Briefcase,
  Zap,
  Camera,
  Sparkles,
  Info,
  Tv,
  User,
  Luggage,
} from "lucide-react";
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
import { Link } from "react-router-dom";

function PersonIcon() {
  return <User className="h-3.5 w-3.5 text-maseer-gold" />;
}

function LuggageIcon() {
  return <Luggage className="h-3.5 w-3.5 text-maseer-gold" />;
}

function getFeatureIcon(feature: string) {
  const feat = feature.toLowerCase();
  const className = "h-3.5 w-3.5 shrink-0 text-maseer-gold";

  if (feat.includes("wifi") || feat.includes("hotspot")) {
    return <Wifi className={className} />;
  }
  if (
    feat.includes("climate") ||
    feat.includes("seats") ||
    feat.includes("heated") ||
    feat.includes("ventilated")
  ) {
    return <Snowflake className={className} />;
  }
  if (
    feat.includes("privacy") ||
    feat.includes("safety") ||
    feat.includes("awd") ||
    feat.includes("shield") ||
    feat.includes("glass")
  ) {
    return <Shield className={className} />;
  }
  if (
    feat.includes("sound") ||
    feat.includes("audio") ||
    feat.includes("music") ||
    feat.includes("premium sound")
  ) {
    return <Music className={className} />;
  }
  if (
    feat.includes("water") ||
    feat.includes("drink") ||
    feat.includes("mineral")
  ) {
    return <Droplets className={className} />;
  }
  if (
    feat.includes("chauffeur") ||
    feat.includes("driver") ||
    feat.includes("professional")
  ) {
    return <UserCheck className={className} />;
  }
  if (
    feat.includes("table") ||
    feat.includes("work") ||
    feat.includes("lounge")
  ) {
    return <Briefcase className={className} />;
  }
  if (
    feat.includes("charging") ||
    feat.includes("ports") ||
    feat.includes("power") ||
    feat.includes("usb")
  ) {
    return <Zap className={className} />;
  }
  if (
    feat.includes("camera") ||
    feat.includes("vision") ||
    feat.includes("360")
  ) {
    return <Camera className={className} />;
  }
  if (
    feat.includes("lighting") ||
    feat.includes("led") ||
    feat.includes("ambient") ||
    feat.includes("mood")
  ) {
    return <Sparkles className={className} />;
  }
  if (
    feat.includes("tablet") ||
    feat.includes("screen") ||
    feat.includes("device")
  ) {
    return <Tv className={className} />;
  }
  return <Info className={className} />;
}

function VehicleCard({ vehicle }: { vehicle: FleetVehicle }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
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
                {getFeatureIcon(feature)}
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
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="block flex-1 rounded-lg bg-primary py-3.5 text-center font-lato text-sm font-bold text-white transition hover:brightness-105"
            >
              Book This Vehicle 
            </button>
          </div>
        </div>
      </article>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicleId={vehicle.id}
        vehicleName={vehicle.name}
      />
    </>
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
