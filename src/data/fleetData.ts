export type FleetCategory =
  | "All Vehicles"
  | "Economy & Executive Sedans"
  | "Business-Class Sedans"
  | "First-Class Sedans"
  | "Premium SUVs"
  | "Luxury & Ultra-Luxury Vehicles"
  | "Vans & Minivans"
  | "Coasters & Buses"
  | "Electric Mobility";

import type { FleetItem } from "../api/admin/fleet";

export type VehicleBodyType = "SEDAN" | "SUV" | "VAN" | "BUS";

export const FLEET_GRID_CATEGORIES = [
  "All Vehicles",
  "Economy & Executive Sedans",
  "Business-Class Sedans",
  "First-Class Sedans",
  "Premium SUVs",
  "Luxury & Ultra-Luxury Vehicles",
  "Vans & Minivans",
  "Coasters & Buses",
  "Electric Mobility",
] as const;

export type FleetGridCategory = (typeof FLEET_GRID_CATEGORIES)[number];

export type FleetVehicle = {
  id: string;
  name: string;
  category: Exclude<FleetCategory, "All Vehicles">;
  bodyType: VehicleBodyType;
  seats: number;
  bags: number;
  bagLabel: string;
  transmission: string;
  fuel: string;
  features: string[];
  image: string;
  gridTags: FleetGridCategory[];
  isNew?: boolean;
  availabilityNote?: string;
};

export const FLEET_CATEGORIES: FleetCategory[] = [...FLEET_GRID_CATEGORIES];

/** Approved API category values (exact BE enum). */
export type FleetCategoryApiValue =
  | "economy_executive_sedans"
  | "business_class_sedans"
  | "first_class_sedans"
  | "premium_suvs"
  | "luxury_ultra_luxury"
  | "vans_minivans"
  | "coasters_buses"
  | "electric_mobility";

/** Maps approved website labels → BE API category values. */
export const FLEET_CATEGORY_BACKEND_MAP: Record<
  Exclude<FleetCategory, "All Vehicles">,
  FleetCategoryApiValue
> = {
  "Economy & Executive Sedans": "economy_executive_sedans",
  "Business-Class Sedans": "business_class_sedans",
  "First-Class Sedans": "first_class_sedans",
  "Premium SUVs": "premium_suvs",
  "Luxury & Ultra-Luxury Vehicles": "luxury_ultra_luxury",
  "Vans & Minivans": "vans_minivans",
  "Coasters & Buses": "coasters_buses",
  "Electric Mobility": "electric_mobility",
};

/** Maps BE API category values → website labels (includes legacy keys for safety). */
export const FLEET_CATEGORY_LABEL_BY_API: Record<string, Exclude<FleetCategory, "All Vehicles">> = {
  economy_executive_sedans: "Economy & Executive Sedans",
  business_class_sedans: "Business-Class Sedans",
  first_class_sedans: "First-Class Sedans",
  premium_suvs: "Premium SUVs",
  luxury_ultra_luxury: "Luxury & Ultra-Luxury Vehicles",
  vans_minivans: "Vans & Minivans",
  coasters_buses: "Coasters & Buses",
  electric_mobility: "Electric Mobility",
  // legacy (pre-migration)
  economy_class: "Economy & Executive Sedans",
  vip_business_class: "First-Class Sedans",
  ultra_luxury: "Premium SUVs",
  business_van: "Vans & Minivans",
  green_class: "Electric Mobility",
};

export const FLEET_CATEGORY_DESCRIPTIONS: Record<
  Exclude<FleetCategory, "All Vehicles">,
  string
> = {
  "Economy & Executive Sedans":
    "Efficient and comfortable transportation for airport transfers, business travel and everyday executive mobility.",
  "Business-Class Sedans":
    "Premium comfort for corporate guests, executives and high-value journeys.",
  "First-Class Sedans":
    "A higher level of comfort and refinement for VIP and executive requirements.",
  "Premium SUVs":
    "Spacious and versatile for executives, families, VIPs and demanding road conditions.",
  "Luxury & Ultra-Luxury Vehicles":
    "Exceptional vehicles for high-profile guests, special occasions and premium experiences.",
  "Vans & Minivans":
    "Comfortable solutions for families, small groups, airport movements and hospitality requirements.",
  "Coasters & Buses":
    "Scalable group transportation for events, staff movements, tours and delegations.",
  "Electric Mobility":
    "Selected electric vehicle solutions where available and suitable for the journey.",
};

export const FLEET_VEHICLES: FleetVehicle[] = [];

/** Default grid order when "All Vehicles" is selected. */
export const FLEET_GRID_DISPLAY_IDS: string[] = [];

export function mapFleetItemToVehicle(item: FleetItem): FleetVehicle {
  const catName =
    FLEET_CATEGORY_LABEL_BY_API[item.category] ||
    (item.category as Exclude<FleetCategory, "All Vehicles">) ||
    "Economy & Executive Sedans";

  const bodyTypeRaw = (item.vehicle_type || "sedan").toUpperCase();
  const bodyType: VehicleBodyType =
    bodyTypeRaw === "SUV" || bodyTypeRaw === "VAN" || bodyTypeRaw === "BUS"
      ? bodyTypeRaw
      : "SEDAN";

  return {
    id: item.id,
    name: item.vehicle_name,
    category: catName,
    bodyType,
    seats: item.seat_count ?? 4,
    bags: item.luggage_capacity ?? 2,
    bagLabel: `${item.luggage_capacity ?? 2} checked`,
    transmission: "Automatic",
    fuel: "Petrol",
    features: (item.amenities || []).map((a) => a.name),
    image: item.image_url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    gridTags: [catName],
  };
}

export function getFleetVehicleById(id: string): FleetVehicle | undefined {
  return FLEET_VEHICLES.find((vehicle) => vehicle.id === id);
}

export function getFleetGridVehicles(category: FleetGridCategory): FleetVehicle[] {
  if (category === "All Vehicles") {
    return FLEET_GRID_DISPLAY_IDS.map(
      (id) => FLEET_VEHICLES.find((v) => v.id === id)!,
    ).filter(Boolean) as FleetVehicle[];
  }
  return FLEET_VEHICLES.filter((v) => v.gridTags.includes(category));
}

export const SHOWCASE_FEATURES = [
  { label: "Secure booking in minutes", side: "left" as const, pos: "top-[8%] left-[8%]" },
  { label: "Professional chauffeurs at your service", side: "left" as const, pos: "top-[38%] left-[2%]" },
  { label: "Transparent pricing", side: "left" as const, pos: "top-[68%] left-[8%]" },
  { label: "Approved luxury options", side: "right" as const, pos: "top-[8%] right-[8%]" },
  { label: "Safety-focused journeys", side: "right" as const, pos: "top-[38%] right-[2%]" },
  { label: "Available 24 hours a day", side: "right" as const, pos: "top-[68%] right-[8%]" },
];
