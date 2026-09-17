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

import { images } from "../assets/images";

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

/** Maps approved website categories → existing backend enum values. */
export const FLEET_CATEGORY_BACKEND_MAP: Record<
  Exclude<FleetCategory, "All Vehicles">,
  string
> = {
  "Economy & Executive Sedans": "economy_class",
  "Business-Class Sedans": "vip_business_class",
  "First-Class Sedans": "vip_business_class",
  "Premium SUVs": "ultra_luxury",
  "Luxury & Ultra-Luxury Vehicles": "ultra_luxury",
  "Vans & Minivans": "business_van",
  "Coasters & Buses": "business_van",
  "Electric Mobility": "green_class",
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

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: "ford-taurus",
    name: "Ford Taurus",
    category: "Economy & Executive Sedans",
    bodyType: "SEDAN",
    seats: 4,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Climate control", "Professional chauffeur", "On-board charging"],
    image: images.fleet.slide,
    gridTags: ["Economy & Executive Sedans"],
  },
  {
    id: "lexus-es",
    name: "Lexus ES 350",
    category: "Economy & Executive Sedans",
    bodyType: "SEDAN",
    seats: 4,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Heated & ventilated seats", "Premium sound", "Mood lighting"],
    image: images.fleet.slide,
    gridTags: ["Economy & Executive Sedans"],
    isNew: true,
  },
  {
    id: "toyota-camry",
    name: "Toyota Camry",
    category: "Economy & Executive Sedans",
    bodyType: "SEDAN",
    seats: 4,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Smooth ride", "Climate control", "Professional chauffeur"],
    image: images.home.fleet[0],
    gridTags: ["Economy & Executive Sedans"],
  },
  {
    id: "mercedes-e",
    name: "Mercedes-Benz E-Class",
    category: "Business-Class Sedans",
    bodyType: "SEDAN",
    seats: 3,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Executive seating", "Quiet cabin", "Wi-Fi hotspot"],
    image: images.fleet.grid[0],
    gridTags: ["Business-Class Sedans"],
  },
  {
    id: "bmw-5",
    name: "BMW 5 Series",
    category: "Business-Class Sedans",
    bodyType: "SEDAN",
    seats: 3,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Business comfort", "Ambient lighting", "On-board charging"],
    image: images.home.fleet[1],
    gridTags: ["Business-Class Sedans"],
  },
  {
    id: "mercedes-s",
    name: "Mercedes-Benz S-Class",
    category: "First-Class Sedans",
    bodyType: "SEDAN",
    seats: 3,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["High-speed Wi-Fi", "Chilled mineral water", "Professional chauffeur"],
    image: images.fleet.grid[0],
    gridTags: ["First-Class Sedans"],
    isNew: true,
  },
  {
    id: "bmw-7",
    name: "BMW 7 Series",
    category: "First-Class Sedans",
    bodyType: "SEDAN",
    seats: 3,
    bags: 3,
    bagLabel: "3 checked",
    transmission: "Automatic",
    fuel: "Hybrid",
    features: ["Executive lounge seating", "Ambient lighting", "Wi-Fi hotspot"],
    image: images.home.fleet[1],
    gridTags: ["First-Class Sedans"],
  },
  {
    id: "chevrolet-tahoe",
    name: "Chevrolet Tahoe",
    category: "Premium SUVs",
    bodyType: "SUV",
    seats: 6,
    bags: 4,
    bagLabel: "4 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Spacious cabin", "Captain chairs", "Climate zones"],
    image: images.fleet.grid[1],
    gridTags: ["Premium SUVs"],
  },
  {
    id: "chevrolet-suburban",
    name: "Chevrolet Suburban",
    category: "Premium SUVs",
    bodyType: "SUV",
    seats: 7,
    bags: 6,
    bagLabel: "6 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Third-row comfort", "Captain chairs", "360° camera"],
    image: images.home.fleet[0],
    gridTags: ["Premium SUVs"],
  },
  {
    id: "gmc-yukon-xl",
    name: "GMC Yukon XL",
    category: "Premium SUVs",
    bodyType: "SUV",
    seats: 7,
    bags: 5,
    bagLabel: "5 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Extended cabin", "Premium sound", "Privacy glass"],
    image: images.fleet.grid[1],
    gridTags: ["Premium SUVs"],
  },
  {
    id: "mercedes-vito",
    name: "Mercedes-Benz Vito",
    category: "Premium SUVs",
    bodyType: "VAN",
    seats: 7,
    bags: 6,
    bagLabel: "6 checked",
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["Flexible seating", "Luggage space", "Professional chauffeur"],
    image: images.fleet.grid[2],
    gridTags: ["Premium SUVs", "Vans & Minivans"],
  },
  {
    id: "maybach-s",
    name: "Mercedes-Maybach S-Class",
    category: "Luxury & Ultra-Luxury Vehicles",
    bodyType: "SEDAN",
    seats: 3,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Ultra-luxury cabin", "Executive rear lounge", "Concierge coordination"],
    image: images.home.fleet[2],
    gridTags: ["Luxury & Ultra-Luxury Vehicles"],
    availabilityNote: "On demand / subject to availability",
  },
  {
    id: "rolls-royce-ghost",
    name: "Rolls-Royce Ghost",
    category: "Luxury & Ultra-Luxury Vehicles",
    bodyType: "SEDAN",
    seats: 3,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Ultra-luxury cabin", "Privacy focus", "Concierge coordination"],
    image: images.home.fleet[2],
    gridTags: ["Luxury & Ultra-Luxury Vehicles"],
    availabilityNote: "On demand / subject to availability",
  },
  {
    id: "hyundai-staria",
    name: "Hyundai Staria",
    category: "Vans & Minivans",
    bodyType: "VAN",
    seats: 7,
    bags: 5,
    bagLabel: "5 checked",
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["Group seating", "Airport-ready luggage space", "USB charging"],
    image: images.fleet.grid[2],
    gridTags: ["Vans & Minivans"],
    availabilityNote: "Or similar",
  },
  {
    id: "toyota-hiace",
    name: "Toyota HiAce",
    category: "Coasters & Buses",
    bodyType: "BUS",
    seats: 12,
    bags: 8,
    bagLabel: "8 checked",
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["Group transport", "Event support", "Professional chauffeur"],
    image: images.fleet.grid[2],
    gridTags: ["Coasters & Buses"],
  },
  {
    id: "king-long-bus",
    name: "King Long Bus",
    category: "Coasters & Buses",
    bodyType: "BUS",
    seats: 30,
    bags: 20,
    bagLabel: "Group luggage",
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["Delegation capacity", "Tour support", "Staff movements"],
    image: images.fleet.grid[2],
    gridTags: ["Coasters & Buses"],
  },
  {
    id: "lucid-air",
    name: "Lucid Air",
    category: "Electric Mobility",
    bodyType: "SEDAN",
    seats: 4,
    bags: 2,
    bagLabel: "2 checked",
    transmission: "Automatic",
    fuel: "Electric",
    features: ["Electric drivetrain", "Quiet cabin", "Premium interior"],
    image: images.home.fleet[1],
    gridTags: ["Electric Mobility"],
    availabilityNote: "Where available",
  },
];

/** Default grid order when "All Vehicles" is selected. */
export const FLEET_GRID_DISPLAY_IDS = [
  "lexus-es",
  "mercedes-e",
  "mercedes-s",
  "chevrolet-suburban",
  "rolls-royce-ghost",
  "hyundai-staria",
  "toyota-hiace",
  "lucid-air",
] as const;

export function getFleetVehicleById(id: string): FleetVehicle | undefined {
  return FLEET_VEHICLES.find((vehicle) => vehicle.id === id);
}

export function getFleetGridVehicles(category: FleetGridCategory): FleetVehicle[] {
  if (category === "All Vehicles") {
    return FLEET_GRID_DISPLAY_IDS.map(
      (id) => FLEET_VEHICLES.find((v) => v.id === id)!,
    );
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
