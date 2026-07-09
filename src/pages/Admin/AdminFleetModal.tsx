import React, { useEffect, useState } from "react";
import { 
  Car, 
  X, 
  AlertCircle, 
  Wifi, 
  Droplets, 
  Snowflake, 
  Music, 
  UserCheck, 
  Zap, 
  Camera, 
  Tv, 
  Info 
} from "lucide-react";
import { type FleetItem, type FleetParams, type Amenity } from "src/api/admin/fleet";
import { Spinner } from "src/ui/Spinner";
import { ImageUpload } from "src/ui/ImageUpload";

// Map backend categories to display names
const CATEGORY_MAP = {
  green_class: "Green Class",
  ultra_luxury: "Ultra Luxury",
  business_van: "Business Van",
  vip_business_class: "VIP / Business Class",
  economy_class: "Economy Class",
} as const;

const CATEGORIES = Object.entries(CATEGORY_MAP) as [keyof typeof CATEGORY_MAP, string][];

// Map backend vehicle types to display names
const TYPE_MAP = {
  sedan: "Sedan",
  suv: "SUV",
  van: "Van",
} as const;

const TYPES = Object.entries(TYPE_MAP) as [keyof typeof TYPE_MAP, string][];

const AVAILABLE_AMENITIES = [
  { name: "WiFi", icon_key: "wifi" },
  { name: "Mineral Water", icon_key: "droplet" },
  { name: "Climate Control", icon_key: "snowflake" },
  { name: "Premium Audio", icon_key: "music" },
  { name: "Professional Chauffeur", icon_key: "user-check" },
  { name: "Charging Ports", icon_key: "zap" },
  { name: "360° Camera", icon_key: "camera" },
  { name: "Rear Screen", icon_key: "tv" },
];

function getAmenityIcon(iconKey: string) {
  const className = "h-3.5 w-3.5 shrink-0 text-maseer-gold";
  switch (iconKey) {
    case "wifi":
      return <Wifi className={className} />;
    case "droplet":
      return <Droplets className={className} />;
    case "snowflake":
      return <Snowflake className={className} />;
    case "music":
      return <Music className={className} />;
    case "user-check":
      return <UserCheck className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "camera":
      return <Camera className={className} />;
    case "tv":
      return <Tv className={className} />;
    default:
      return <Info className={className} />;
  }
}

type AdminFleetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingItem: FleetItem | null;
  defaultDisplayOrder: number;
  onSave: (payload: FleetParams) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  setError: (err: string | null) => void;
};

export function AdminFleetModal({
  isOpen,
  onClose,
  editingItem,
  defaultDisplayOrder,
  onSave,
  isSaving,
  error,
  setError,
}: AdminFleetModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FleetItem["vehicle_type"] | "">("");
  const [category, setCategory] = useState<FleetItem["category"] | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [seatCount, setSeatCount] = useState<number | "">("");
  const [luggageCapacity, setLuggageCapacity] = useState<number | "">("");
  const [displayOrder, setDisplayOrder] = useState<number | "">("");
  const [isActive, setIsActive] = useState(true);
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  // Synchronize internal state with editingItem or defaults when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(editingItem.vehicle_name);
        setType(editingItem.vehicle_type);
        setCategory(editingItem.category);
        setImageUrl(editingItem.image_url);
        setSeatCount(editingItem.seat_count);
        setLuggageCapacity(editingItem.luggage_capacity);
        setDisplayOrder(editingItem.display_order);
        setIsActive(editingItem.is_active);
        setAmenities([...editingItem.amenities]);
      } else {
        setName("");
        setType("");
        setCategory("");
        setImageUrl("");
        setSeatCount("");
        setLuggageCapacity("");
        setDisplayOrder(defaultDisplayOrder);
        setIsActive(true);
        setAmenities([]);
      }
    }
  }, [isOpen, editingItem, defaultDisplayOrder]);

  const handleToggleAmenity = (amenity: { name: string; icon_key: string }) => {
    const exists = amenities.some((a) => a.name === amenity.name);
    if (exists) {
      setAmenities(amenities.filter((a) => a.name !== amenity.name));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vehicle Name is required.");
      return;
    }
    if (!type) {
      setError("Vehicle Type is required.");
      return;
    }
    if (!category) {
      setError("Fleet Category is required.");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Vehicle Image is required.");
      return;
    }
    if (seatCount === "" || Number(seatCount) < 1) {
      setError("Seats count must be at least 1.");
      return;
    }
    if (luggageCapacity === "" || Number(luggageCapacity) < 0) {
      setError("Luggage capacity cannot be negative.");
      return;
    }
    if (displayOrder === "" || Number(displayOrder) < 1) {
      setError("Display order must be at least 1.");
      return;
    }

    onSave({
      vehicle_name: name,
      vehicle_type: type,
      category,
      image_url: imageUrl,
      seat_count: Number(seatCount),
      luggage_capacity: Number(luggageCapacity),
      amenities,
      is_active: isActive,
      display_order: Number(displayOrder),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-maseer-green-deep/70 backdrop-blur-[4px] transition-opacity"
        onClick={() => !isSaving && onClose()}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white border border-maseer-line p-6 shadow-float transition-all duration-300 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-maseer-line">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maseer-tint-green">
              <Car className="h-5 w-5 text-maseer-green" />
            </div>
            <div>
              <h3 className="font-serif text-[20px] font-bold text-maseer-green-text">
                {editingItem ? "Edit Fleet Vehicle" : "Create Fleet Listing"}
              </h3>
              <p className="font-lato text-xs text-maseer-muted">
                {editingItem ? "Update details for the selected vehicle registry." : "Register a brand new executive ride in the fleet directory."}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-lg p-1 text-maseer-muted hover:bg-maseer-surface hover:text-[#1a2e1f] transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="my-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 font-lato text-xs font-semibold text-red-800">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 font-lato">
          {/* Row 1: Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Vehicle Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mercedes-Benz S-Class"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text placeholder-maseer-muted/65 focus:outline-none focus:ring-1 focus:ring-maseer-gold"
            />
          </div>

          {/* Row 2: Type & Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Vehicle Type *</label>
              <select
                value={type}
                required
                onChange={(e) => setType(e.target.value as FleetItem["vehicle_type"])}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              >
                <option value="" disabled>Select vehicle type...</option>
                {TYPES.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Fleet Category *</label>
              <select
                value={category}
                required
                onChange={(e) => setCategory(e.target.value as FleetItem["category"])}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              >
                <option value="" disabled>Select category...</option>
                {CATEGORIES.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Drag & Drop Image Upload */}
          <ImageUpload 
            value={imageUrl} 
            onChange={setImageUrl} 
            label="Vehicle Image *" 
          />

          {/* Row 4: Seats, Luggage, Display Order */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Seats count *</label>
              <input
                type="number"
                required
                min={1}
                max={15}
                value={seatCount}
                onChange={(e) => setSeatCount(e.target.value === "" ? "" : Number(e.target.value))}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Luggage capacity *</label>
              <input
                type="number"
                required
                min={0}
                max={15}
                value={luggageCapacity}
                onChange={(e) => setLuggageCapacity(e.target.value === "" ? "" : Number(e.target.value))}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Display Order *</label>
              <input
                type="number"
                required
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value === "" ? "" : Number(e.target.value))}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>
          </div>

          {/* Row 5: Active Status */}
          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-maseer-line bg-maseer-cream text-maseer-green focus:outline-none focus:ring-1 focus:ring-maseer-gold cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-maseer-green-text select-none cursor-pointer">
              Activate this vehicle listing immediately for ride bookings
            </label>
          </div>

          {/* Row 6: Amenities Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Select Amenities</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = amenities.some((a) => a.name === amenity.name);
                return (
                  <button
                    type="button"
                    key={amenity.name}
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition select-none ${
                      isSelected
                        ? "border-maseer-gold bg-maseer-surface shadow-glow text-[#1a2e1f]"
                        : "border-maseer-line bg-white hover:bg-maseer-surface/50 text-maseer-muted"
                    }`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                      isSelected ? "bg-maseer-gold/15" : "bg-maseer-surface"
                    }`}>
                      {getAmenityIcon(amenity.icon_key)}
                    </div>
                    <span className="text-xs font-bold leading-none">{amenity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="border-t border-maseer-line pt-5 flex items-center justify-end gap-3.5">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="rounded-xl border border-maseer-line bg-white hover:bg-maseer-surface px-5 py-3 font-lato text-sm font-bold text-maseer-muted transition disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-maseer-green hover:bg-maseer-green-light px-6 py-3 font-lato text-sm font-bold text-white shadow-soft transition disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSaving && <Spinner size="sm" className="text-white" />}
              <span>{editingItem ? "Save Changes" : "Create Vehicle"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
