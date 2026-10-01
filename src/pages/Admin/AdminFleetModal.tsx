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
  Info,
  Sparkles,
  Armchair,
  Eye,
  Sun,
  Leaf,
  Plus,
  Trash2
} from "lucide-react";
import { type FleetItem, type FleetParams, type Amenity } from "src/api/admin/fleet";
import { Spinner } from "src/ui/Spinner";
import { ImageUpload } from "src/ui/ImageUpload";

// Map backend categories to approved website labels
const CATEGORY_MAP = {
  economy_executive_sedans: "Economy & Executive Sedans",
  business_class_sedans: "Business-Class Sedans",
  premium_suvs: "Premium SUVs",
  luxury_ultra_luxury: "Luxury & Ultra-Luxury Vehicles",
  coasters_buses: "Coasters & Buses",
  electric_mobility: "Electric Mobility",
} as const;

const CATEGORIES = Object.entries(CATEGORY_MAP) as [keyof typeof CATEGORY_MAP, string][];

// Map backend vehicle types to display names
const TYPE_MAP = {
  sedan: "Sedan",
  suv: "SUV",
  van: "Van",
} as const;

const TYPES = Object.entries(TYPE_MAP) as [keyof typeof TYPE_MAP, string][];

export const AVAILABLE_AMENITIES: Amenity[] = [
  { name: "WiFi", icon_key: "wifi" },
  { name: "USB Charger", icon_key: "usb" },
  { name: "Water", icon_key: "water" },
  { name: "Tissue Box", icon_key: "tissue" },
  { name: "Leather Seats", icon_key: "leather" },
  { name: "Privacy Glass", icon_key: "privacy" },
  { name: "Massage Seats", icon_key: "massage" },
  { name: "Ambient Lighting", icon_key: "lighting" },
  { name: "Available in Riyadh only", icon_key: "riyadh" },
  { name: "Professional Chauffeur", icon_key: "chauffeur" },
  { name: "Climate Control", icon_key: "climate" },
  { name: "Premium Audio", icon_key: "audio" },
  { name: "360° Camera", icon_key: "camera" },
  { name: "Rear Screen", icon_key: "screen" },
];

export const AVAILABLE_ICON_CHOICES = [
  { key: "wifi", label: "WiFi", icon: Wifi },
  { key: "usb", label: "USB / Charger", icon: Zap },
  { key: "water", label: "Water", icon: Droplets },
  { key: "tissue", label: "Tissue Box", icon: Sparkles },
  { key: "leather", label: "Leather Seats", icon: Armchair },
  { key: "privacy", label: "Privacy Glass", icon: Eye },
  { key: "massage", label: "Massage Seats", icon: Armchair },
  { key: "lighting", label: "Ambient Lighting", icon: Sun },
  { key: "riyadh", label: "Riyadh Only / Leaf", icon: Leaf },
  { key: "chauffeur", label: "Chauffeur", icon: UserCheck },
  { key: "climate", label: "Climate Control", icon: Snowflake },
  { key: "audio", label: "Premium Audio", icon: Music },
  { key: "camera", label: "360° Camera", icon: Camera },
  { key: "screen", label: "Rear Screen", icon: Tv },
  { key: "info", label: "Standard Feature", icon: Info },
];

export function getAmenityIcon(iconKey: string, name?: string) {
  const className = "h-3.5 w-3.5 shrink-0 text-maseer-gold";
  const key = (iconKey || "").toLowerCase();
  const label = (name || "").toLowerCase();

  if (key === "wifi" || label.includes("wifi")) return <Wifi className={className} />;
  if (
    key === "usb" ||
    key === "zap" ||
    key === "charger" ||
    label.includes("usb") ||
    label.includes("charg")
  ) {
    return <Zap className={className} />;
  }
  if (
    key === "droplet" ||
    key === "water" ||
    label.includes("water") ||
    label.includes("drink")
  ) {
    return <Droplets className={className} />;
  }
  if (
    key === "tissue" ||
    key === "tissue-box" ||
    key === "tissues" ||
    label.includes("tissue")
  ) {
    return <Sparkles className={className} />;
  }
  if (
    key === "leather" ||
    key === "leather-seats" ||
    label.includes("leather")
  ) {
    return <Armchair className={className} />;
  }
  if (
    key === "privacy" ||
    key === "privacy-glass" ||
    key === "eye" ||
    label.includes("privacy") ||
    label.includes("glass")
  ) {
    return <Eye className={className} />;
  }
  if (
    key === "massage" ||
    key === "massage-seats" ||
    label.includes("massage")
  ) {
    return <Armchair className={className} />;
  }
  if (
    key === "lighting" ||
    key === "ambient-lighting" ||
    key === "sun" ||
    label.includes("lighting") ||
    label.includes("ambient")
  ) {
    return <Sun className={className} />;
  }
  if (
    key === "riyadh" ||
    key === "riyadh-only" ||
    key === "leaf" ||
    label.includes("riyadh")
  ) {
    return <Leaf className={className} />;
  }
  if (
    key === "snowflake" ||
    key === "climate" ||
    label.includes("climate") ||
    label.includes("ac") ||
    label.includes("cold")
  ) {
    return <Snowflake className={className} />;
  }
  if (
    key === "music" ||
    key === "audio" ||
    label.includes("audio") ||
    label.includes("music") ||
    label.includes("sound")
  ) {
    return <Music className={className} />;
  }
  if (
    key === "user-check" ||
    key === "chauffeur" ||
    label.includes("chauffeur") ||
    label.includes("driver")
  ) {
    return <UserCheck className={className} />;
  }
  if (key === "camera" || label.includes("camera")) return <Camera className={className} />;
  if (key === "tv" || key === "screen" || label.includes("screen") || label.includes("tv")) {
    return <Tv className={className} />;
  }

  return <Info className={className} />;
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

  // Custom amenity input state
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmenityName, setCustomAmenityName] = useState("");
  const [customAmenityIcon, setCustomAmenityIcon] = useState("info");

  // Synchronize internal state with editingItem or defaults when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
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
      setShowCustomInput(false);
      setCustomAmenityName("");
    }
  }, [isOpen, editingItem, defaultDisplayOrder]);

  const handleToggleAmenity = (amenity: { name: string; icon_key: string }) => {
    const exists = amenities.some((a) => a.name.toLowerCase() === amenity.name.toLowerCase());
    if (exists) {
      setAmenities(amenities.filter((a) => a.name.toLowerCase() !== amenity.name.toLowerCase()));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmenityName.trim()) return;

    const trimmed = customAmenityName.trim();
    const alreadyExists = amenities.some((a) => a.name.toLowerCase() === trimmed.toLowerCase());

    if (!alreadyExists) {
      setAmenities([...amenities, { name: trimmed, icon_key: customAmenityIcon }]);
    }
    setCustomAmenityName("");
    setShowCustomInput(false);
  };

  const handleRemoveCustomAmenity = (amenityName: string) => {
    setAmenities(amenities.filter((a) => a.name !== amenityName));
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

  // Custom amenities that are not in the predefined list
  const customItems = amenities.filter(
    (a) => !AVAILABLE_AMENITIES.some((preset) => preset.name.toLowerCase() === a.name.toLowerCase())
  );

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
                {editingItem
                  ? "Update details for the selected vehicle registry."
                  : "Register a brand new executive ride in the fleet directory."}
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
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-5 pr-1 font-lato"
        >
          {/* Row 1: Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
              Vehicle Name *
            </label>
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
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
                Vehicle Type *
              </label>
              <select
                value={type}
                required
                onChange={(e) => setType(e.target.value as FleetItem["vehicle_type"])}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              >
                <option value="" disabled>
                  Select vehicle type...
                </option>
                {TYPES.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
                Fleet Category *
              </label>
              <select
                value={category}
                required
                onChange={(e) => setCategory(e.target.value as FleetItem["category"])}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              >
                <option value="" disabled>
                  Select category...
                </option>
                {CATEGORIES.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
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
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
                Seats count *
              </label>
              <input
                type="number"
                required
                min={1}
                max={15}
                value={seatCount}
                onChange={(e) =>
                  setSeatCount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
                Luggage capacity *
              </label>
              <input
                type="number"
                required
                min={0}
                max={15}
                value={luggageCapacity}
                onChange={(e) =>
                  setLuggageCapacity(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
                Display Order *
              </label>
              <input
                type="number"
                required
                min={1}
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(e.target.value === "" ? "" : Number(e.target.value))
                }
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
            <label
              htmlFor="isActive"
              className="text-sm font-bold text-maseer-green-text select-none cursor-pointer"
            >
              Activate this vehicle listing immediately for ride bookings
            </label>
          </div>

          {/* Row 6: Amenities Selection Grid */}
          <div className="flex flex-col gap-2 pt-2 border-t border-maseer-line">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
                Select Amenities ({amenities.length} selected)
              </label>
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-maseer-green hover:text-maseer-gold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{showCustomInput ? "Hide Custom Input" : "Add Custom Amenity"}</span>
              </button>
            </div>

            {/* Custom Amenity Creator Box */}
            {showCustomInput && (
              <div className="p-3 rounded-xl border border-maseer-gold/40 bg-maseer-surface-card flex flex-col sm:flex-row items-center gap-2 mb-2 animate-in fade-in">
                <input
                  type="text"
                  placeholder="Enter custom amenity (e.g. Baby Seat, Free Snack)..."
                  value={customAmenityName}
                  onChange={(e) => setCustomAmenityName(e.target.value)}
                  className="flex-1 w-full rounded-lg border border-maseer-line bg-white px-3 py-2 text-xs font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomAmenity(e);
                    }
                  }}
                />
                <select
                  value={customAmenityIcon}
                  onChange={(e) => setCustomAmenityIcon(e.target.value)}
                  className="rounded-lg border border-maseer-line bg-white px-2.5 py-2 text-xs font-semibold text-maseer-green-text focus:outline-none"
                >
                  {AVAILABLE_ICON_CHOICES.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="w-full sm:w-auto rounded-lg bg-maseer-green hover:bg-maseer-green-light px-4 py-2 text-xs font-bold text-white transition shrink-0"
                >
                  Add
                </button>
              </div>
            )}

            {/* Custom Added Amenities Chips */}
            {customItems.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {customItems.map((item) => (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-maseer-gold bg-maseer-gold/10 px-2.5 py-1.5 text-xs font-bold text-maseer-green-text"
                  >
                    {getAmenityIcon(item.icon_key, item.name)}
                    <span>{item.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomAmenity(item.name)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Predefined Approved Amenities Grid */}
            <div className="grid gap-2 sm:grid-cols-2">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = amenities.some(
                  (a) => a.name.toLowerCase() === amenity.name.toLowerCase()
                );
                return (
                  <button
                    type="button"
                    key={amenity.name}
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition select-none cursor-pointer ${
                      isSelected
                        ? "border-maseer-gold bg-maseer-surface shadow-glow text-[#1a2e1f]"
                        : "border-maseer-line bg-white hover:bg-maseer-surface/50 text-maseer-muted"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        isSelected ? "bg-maseer-gold/15" : "bg-maseer-surface"
                      }`}
                    >
                      {getAmenityIcon(amenity.icon_key, amenity.name)}
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
