export type FleetCategory =
  | 'All Vehicles'
  | 'Green Class'
  | 'Ultra Luxury'
  | 'Business Van'
  | 'VIP / Business Class'
  | 'Economy Class'

import { images } from '../assets/images'

export type VehicleBodyType = 'SEDAN' | 'SUV' | 'VAN'

export const FLEET_GRID_CATEGORIES = [
  'All Vehicles',
  'Green Class',
  'Ultra Luxury',
  'Business Van',
  'VIP / Business Class',
  'Economy Class',
] as const

export type FleetGridCategory = (typeof FLEET_GRID_CATEGORIES)[number]

export type FleetVehicle = {
  id: string
  name: string
  category: Exclude<FleetCategory, 'All Vehicles'>
  bodyType: VehicleBodyType
  seats: number
  bags: number
  bagLabel: string
  transmission: string
  fuel: string
  features: string[]
  image: string
  gridTags: FleetGridCategory[]
  isNew?: boolean
}

export const FLEET_CATEGORIES: FleetCategory[] = [
  'All Vehicles',
  'Green Class',
  'Ultra Luxury',
  'Business Van',
  'VIP / Business Class',
  'Economy Class',
]

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'lexus-es',
    name: 'Lexus ES',
    category: 'Economy Class',
    bodyType: 'SEDAN',
    seats: 4,
    bags: 2,
    bagLabel: '2 Large',
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Heated & Ventilated Seats', 'Premium Sound', 'Mood Lighting'],
    image: images.fleet.slide,
    gridTags: ['Economy Class'],
    isNew: true,
  },
  {
    id: 'mercedes-s',
    name: 'Mercedes S-Class',
    category: 'VIP / Business Class',
    bodyType: 'SEDAN',
    seats: 3,
    bags: 2,
    bagLabel: '2 Large',
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['High-speed WiFi', 'Chilled Mineral Water', 'Professional Chauffeur'],
    image: images.fleet.grid[0],
    gridTags: ['VIP / Business Class'],
    isNew: true,
  },
  {
    id: 'cadillac-escalade',
    name: 'Cadillac Escalade',
    category: 'Ultra Luxury',
    bodyType: 'SUV',
    seats: 6,
    bags: 4,
    bagLabel: '4 Large',
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Complimentary Hotspot', 'Multi-zone Climate Control', 'Extended Privacy Glass'],
    image: images.fleet.grid[1],
    gridTags: ['Ultra Luxury'],
  },
  {
    id: 'bmw-7',
    name: 'BMW 7 Series',
    category: 'Green Class',
    bodyType: 'SEDAN',
    seats: 4,
    bags: 3,
    bagLabel: '3 Large',
    transmission: 'Automatic',
    fuel: 'Hybrid',
    features: ['Ambient lighting', 'Executive lounge', 'WiFi hotspot'],
    image: images.home.fleet[1],
    gridTags: ['Green Class'],
  },
  {
    id: 'mercedes-v',
    name: 'Mercedes V-Class',
    category: 'Business Van',
    bodyType: 'VAN',
    seats: 7,
    bags: 6,
    bagLabel: '6 Medium',
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['Executive Work Table', 'On-board Charging Ports', 'Silent Cabin Tech'],
    image: images.fleet.grid[2],
    gridTags: ['Business Van'],
  },
  {
    id: 'audi-a8',
    name: 'Audi A8 L',
    category: 'VIP / Business Class',
    bodyType: 'SEDAN',
    seats: 3,
    bags: 3,
    bagLabel: '3 Large',
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Quattro AWD', 'Matrix LED', 'Rear tablet'],
    image: images.home.fleet[2],
    gridTags: ['VIP / Business Class'],
    isNew: true,
  },
  {
    id: 'chevrolet-suburban',
    name: 'Chevrolet Suburban',
    category: 'Economy Class',
    bodyType: 'SUV',
    seats: 7,
    bags: 6,
    bagLabel: '6 Medium',
    transmission: 'Automatic',
    fuel: 'Petrol',
    features: ['Third-row Comfort', 'Captain Chairs', '360° Camera System'],
    image: images.home.fleet[0],
    gridTags: ['Economy Class'],
  },
]

/** Default grid order when "All Vehicles" is selected (matches Figma). */
export const FLEET_GRID_DISPLAY_IDS = [
  'mercedes-s',
  'cadillac-escalade',
  'mercedes-v',
  'lexus-es',
  'cadillac-escalade',
  'chevrolet-suburban',
] as const

export function getFleetVehicleById(id: string): FleetVehicle | undefined {
  return FLEET_VEHICLES.find((vehicle) => vehicle.id === id)
}

export function getFleetGridVehicles(category: FleetGridCategory): FleetVehicle[] {
  if (category === 'All Vehicles') {
    return FLEET_GRID_DISPLAY_IDS.map(
      (id) => FLEET_VEHICLES.find((v) => v.id === id)!,
    )
  }
  return FLEET_VEHICLES.filter((v) => v.gridTags.includes(category))
}

export const SHOWCASE_FEATURES = [
  { label: 'Secure booking in minutes', side: 'left' as const, pos: 'top-[8%] left-[8%]' },
  { label: 'Professional drivers at your service', side: 'left' as const, pos: 'top-[38%] left-[2%]' },
  { label: 'Price vs Quality', side: 'left' as const, pos: 'top-[68%] left-[8%]' },
  { label: 'Multiple Luxury Option', side: 'right' as const, pos: 'top-[8%] right-[8%]' },
  { label: 'We care about your safety on your journey', side: 'right' as const, pos: 'top-[38%] right-[2%]' },
  { label: 'Available 24 hours a day', side: 'right' as const, pos: 'top-[68%] right-[8%]' },
]
