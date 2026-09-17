import { useEffect, useMemo, useState } from "react";
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
  mapFleetItemToVehicle,
  type FleetGridCategory,
  type FleetVehicle,
} from "../../data/fleetData";
import {
  FleetCta,
  FleetFilterBar,
  FleetHero,
  FleetStandards,
} from "./FleetShared";
import { Link, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useAppSelector } from "src/store/hooks";
import { selectAuthUser } from "src/store/slices/auth/selectors";
import type { AuthUser } from "src/store/slices/auth/types";
import { fetchFleets } from "src/api/admin/fleet";
import { Spinner } from "src/ui/Spinner";

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

function VehicleCard({ vehicle, isAdmin, onEdit }: { vehicle: FleetVehicle; isAdmin: boolean; onEdit: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article className="overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition duration-300 hover:shadow-card">
        <div className="relative h-[210px] bg-[#f3f4f2]">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800";
            }}
          />
          <span className="absolute right-3 top-3 rounded-md bg-maseer-gold px-2.5 py-1 font-lato text-[10px] font-bold uppercase tracking-wide text-white">
            {vehicle.bodyType}
          </span>
          {/* Admin edit button */}
          {isAdmin && (
            <button
              type="button"
              aria-label={`Edit ${vehicle.name}`}
              title="Edit in admin panel"
              onClick={onEdit}
              className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md text-maseer-green transition hover:bg-maseer-green hover:text-white"
            >
              <Pencil size={13} />
            </button>
          )}
        </div>
        <div className="p-7 max-md:p-5">
          <h3 className="font-serif text-[22px] font-semibold leading-tight text-maseer-green-text max-md:text-lg">
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
          {vehicle.availabilityNote ? (
            <p className="mt-3 font-lato text-[11px] font-semibold uppercase tracking-wide text-maseer-gold">
              {vehicle.availabilityNote}
            </p>
          ) : null}
          <p className="mt-2 font-lato text-[11px] leading-4 text-maseer-muted">
            Vehicle shown for illustration; an equivalent model may be supplied.
          </p>

          <div className="mt-6 flex items-center gap-3 max-md:flex-col max-md:items-stretch">
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
              Book a Ride
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
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser) as AuthUser | "";
  const isAdmin = authUser && typeof authUser === "object" && authUser.currentRole === "admin";
  const [category, setCategory] = useState<FleetGridCategory>("All Vehicles");
  const [liveVehicles, setLiveVehicles] = useState<FleetVehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveFleet() {
      setIsLoading(true);
      try {
        console.log("[FleetGridPage] Fetching live fleets from API...");
        const response = await fetchFleets({ is_active: true });
        console.log("[FleetGridPage] API response:", response);

        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
          const mapped = response.data.map(mapFleetItemToVehicle);
          console.log("[FleetGridPage] Successfully mapped live fleets:", mapped);
          if (isMounted) setLiveVehicles(mapped);
        } else {
          console.warn("[FleetGridPage] API returned no active items. Loading mock fallback.");
          const fallback = getFleetGridVehicles("All Vehicles");
          if (isMounted) setLiveVehicles(fallback);
        }
      } catch (err) {
        console.error("[FleetGridPage] Error fetching live fleets from API:", err);
        const fallback = getFleetGridVehicles("All Vehicles");
        if (isMounted) setLiveVehicles(fallback);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLiveFleet();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    if (category === "All Vehicles") {
      return liveVehicles;
    }
    return liveVehicles.filter((v) => 
      v.category === category || 
      (v.gridTags && v.gridTags.includes(category as FleetGridCategory))
    );
  }, [category, liveVehicles]);

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
        {isLoading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
            <Spinner size="lg" className="text-maseer-gold" />
            <p className="font-lato text-sm font-semibold text-maseer-muted">Loading fleet inventory...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-maseer-line bg-white p-16 text-center">
            <h3 className="font-serif text-[18px] font-bold text-[#1a2e1f]">No listings match criteria</h3>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
            {filteredVehicles.map((vehicle, index) => (
              <VehicleCard
                key={`${vehicle.id}-${index}`}
                vehicle={vehicle}
                isAdmin={!!isAdmin}
                onEdit={() => navigate("/admin/fleet")}
              />
            ))}
          </div>
        )}
      </section>

      <FleetStandards />
      <FleetCta buttonLabel="Book a Ride" />
    </div>
  );
}
