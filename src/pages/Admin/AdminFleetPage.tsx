import { useEffect, useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Wifi, 
  User, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Car, 
  RefreshCw, 
  Droplets,
  Snowflake,
  Music,
  UserCheck,
  Zap,
  Camera,
  Tv,
  Info
} from "lucide-react";
import { 
  fetchFleets, 
  createFleet, 
  updateFleet, 
  deleteFleet, 
  type FleetItem, 
  type FleetParams 
} from "src/api/admin/fleet";
import { FLEET_VEHICLES } from "src/data/fleetData";
import { Spinner } from "src/ui/Spinner";
import { AdminFleetModal } from "./AdminFleetModal";
import { AdminFleetDetailModal } from "./AdminFleetDetailModal";

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

// Fallback fleet items mapped from local static data
const FALLBACK_FLEET: FleetItem[] = FLEET_VEHICLES.map((v, index) => {
  let catKey: FleetItem["category"] = "economy_class";
  if (v.category === "Green Class") catKey = "green_class";
  else if (v.category === "Ultra Luxury") catKey = "ultra_luxury";
  else if (v.category === "Business Van") catKey = "business_van";
  else if (v.category === "VIP / Business Class") catKey = "vip_business_class";
  
  let typeKey: FleetItem["vehicle_type"] = "sedan";
  if (v.bodyType === "SUV") typeKey = "suv";
  else if (v.bodyType === "VAN") typeKey = "van";

  return {
    id: v.id,
    vehicle_name: v.name,
    vehicle_type: typeKey,
    category: catKey,
    image_url: v.image,
    seat_count: v.seats,
    luggage_capacity: v.bags,
    amenities: v.features.map(f => {
      let icon = "info";
      if (f.toLowerCase().includes("wifi") || f.toLowerCase().includes("hotspot")) icon = "wifi";
      else if (f.toLowerCase().includes("water") || f.toLowerCase().includes("drink")) icon = "droplet";
      else if (f.toLowerCase().includes("seats") || f.toLowerCase().includes("heated")) icon = "snowflake";
      else if (f.toLowerCase().includes("sound") || f.toLowerCase().includes("audio")) icon = "music";
      else if (f.toLowerCase().includes("chauffeur") || f.toLowerCase().includes("driver")) icon = "user-check";
      else if (f.toLowerCase().includes("charging") || f.toLowerCase().includes("ports")) icon = "zap";
      else if (f.toLowerCase().includes("camera")) icon = "camera";
      else if (f.toLowerCase().includes("tablet") || f.toLowerCase().includes("screen")) icon = "tv";
      return { name: f, icon_key: icon };
    }),
    is_active: true,
    display_order: index + 1,
  };
});

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

export function AdminFleetPage() {
  const [fleets, setFleets] = useState<FleetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FleetItem | null>(null);

  // Details Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<FleetItem | null>(null);

  const handleOpenDetails = (item: FleetItem) => {
    setSelectedDetailItem(item);
    setDetailModalOpen(true);
  };

  const loadFleetData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchFleets();
      if (response && response.success && Array.isArray(response.data)) {
        setFleets(response.data);
        setIsUsingFallback(false);
      } else {
        setFleets(FALLBACK_FLEET);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.error("Error fetching fleet, loading mock registry:", err);
      setFleets(FALLBACK_FLEET);
      setIsUsingFallback(true);
      setError("Unable to sync with live database. Showing local offline registry.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load fleets on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFleetData();
  }, []);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: FleetItem) => {
    setEditingItem(item);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (payload: FleetParams) => {
    setIsSaving(true);
    setError(null);

    try {
      if (editingItem) {
        // Edit Action
        if (isUsingFallback) {
          setFleets(prev =>
            prev.map(item =>
              item.id === editingItem.id ? { ...item, ...payload } : item
            )
          );
          notifySuccess("Vehicle updated locally (Offline Mode)");
          setModalOpen(false);
        } else {
          // API live update
          const response = await updateFleet(editingItem.id, payload);
          if (response && response.success) {
            notifySuccess(response.message || "Vehicle updated successfully");
            loadFleetData();
            setModalOpen(false);
          } else {
            throw new Error(response.message || "Update request rejected by server");
          }
        }
      } else {
        // Create Action
        if (isUsingFallback) {
          const newLocalItem: FleetItem = {
            id: `local-${Date.now()}`,
            ...payload
          };
          setFleets(prev => [...prev, newLocalItem]);
          notifySuccess("Vehicle created locally (Offline Mode)");
          setModalOpen(false);
        } else {
          // API live create
          const response = await createFleet(payload);
          if (response && response.success) {
            notifySuccess(response.message || "Vehicle created successfully");
            loadFleetData();
            setModalOpen(false);
          } else {
            throw new Error(response.message || "Create request rejected by server");
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred while saving the vehicle.";
      console.error("Error saving fleet vehicle:", err);
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      if (isUsingFallback) {
        setFleets(prev => prev.filter(item => item.id !== id));
        notifySuccess("Vehicle removed locally (Offline Mode)");
      } else {
        const response = await deleteFleet(id);
        if (response && response.success) {
          notifySuccess(response.message || "Vehicle deleted successfully");
          loadFleetData();
        } else {
          throw new Error(response.message || "Delete request rejected by server");
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete vehicle";
      console.error("Error deleting vehicle:", err);
      alert(errorMsg);
    }
  };

  // Filter logic
  const filteredFleets = fleets.filter((car) => {
    const matchesCategory = filterCategory === "all" || car.category === filterCategory;
    const matchesType = filterType === "all" || car.vehicle_type === filterType;
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "active" && car.is_active) || 
      (filterStatus === "inactive" && !car.is_active);
    
    return matchesCategory && matchesType && matchesStatus;
  }).sort((a, b) => a.display_order - b.display_order);

  // Statistics calculation
  const totalCount = fleets.length;
  const activeCount = fleets.filter(c => c.is_active).length;
  const inactiveCount = totalCount - activeCount;
  const luxuryCount = fleets.filter(c => c.category === "ultra_luxury" || c.category === "vip_business_class").length;

  return (
    <div className="space-y-8 font-sans">
      {/* Success Notification Bar */}
      {successMessage && (
        <div className="fixed right-6 top-24 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 shadow-float animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <span className="font-lato text-sm font-semibold text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow !text-maseer-gold">FLEET LOGISTICS</p>
          <h1 className="mt-2 font-serif text-[32px] font-semibold text-maseer-green-text tracking-wide">
            Fleet Operations
          </h1>
          <p className="mt-1 font-lato text-[14px] text-maseer-muted">
            Configure vehicles, capacities, custom amenities, and organize the consumer grid layout.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-maseer-green hover:bg-maseer-green-light px-5 py-3 font-lato text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-[1px]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Create Vehicle</span>
        </button>
      </div>

      {/* Sync State Banner */}
      {isUsingFallback && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-yellow-200 bg-yellow-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div className="text-sm text-yellow-800">
              <span className="font-bold">Offline Sandbox Mode: </span>
              Your changes will update instantly in your local browser storage. Make sure your local or live API server is accessible to persist changes permanently.
            </div>
          </div>
          <button 
            onClick={loadFleetData} 
            className="flex items-center gap-1.5 rounded-lg border border-yellow-300 bg-white px-3.5 py-1.5 font-lato text-xs font-bold text-yellow-800 hover:bg-yellow-100/50 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Fleet size", value: totalCount, icon: "🚙", color: "text-maseer-green-text" },
          { label: "Active Chauffeurs", value: activeCount, icon: "✅", color: "text-green-600" },
          { label: "Inactive Vehicles", value: inactiveCount, icon: "💤", color: "text-maseer-muted" },
          { label: "Luxury Tier", value: luxuryCount, icon: "👑", color: "text-maseer-gold" },
        ].map((stat, idx) => (
          <div key={idx} className="card !p-5 flex items-center justify-between bg-white border border-maseer-line shadow-soft hover:shadow-card transition duration-300">
            <div>
              <p className="font-lato text-[11px] text-maseer-muted font-bold uppercase tracking-[0.08em]">
                {stat.label}
              </p>
              <p className={`mt-1.5 font-serif text-[28px] font-bold ${stat.color}`}>
                {isLoading ? "—" : stat.value}
              </p>
            </div>
            <span className="text-3xl filter saturate-[0.85]">{stat.icon}</span>
          </div>
        ))}
      </div>

      {/* Filters Dashboard */}
      <div className="rounded-2xl border border-maseer-line bg-white p-5 shadow-soft flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="font-lato text-[11px] font-bold text-maseer-muted uppercase tracking-[0.05em]">Category</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border border-maseer-line bg-maseer-cream px-3 py-2 font-lato text-xs font-semibold text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="font-lato text-[11px] font-bold text-maseer-muted uppercase tracking-[0.05em]">Vehicle Type</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border border-maseer-line bg-maseer-cream px-3 py-2 font-lato text-xs font-semibold text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
            >
              <option value="all">All Types</option>
              {TYPES.map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {/* Active Status Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="font-lato text-[11px] font-bold text-maseer-muted uppercase tracking-[0.05em]">Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-maseer-line bg-maseer-cream px-3 py-2 font-lato text-xs font-semibold text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
            >
              <option value="all">All States</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="font-lato text-xs font-bold text-maseer-muted">
          Showing {filteredFleets.length} of {totalCount} registry listings
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
          <Spinner size="lg" className="text-maseer-gold" />
          <p className="font-lato text-sm font-medium text-maseer-muted">Loading fleet inventory...</p>
        </div>
      ) : filteredFleets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-maseer-line bg-white p-16 text-center">
          <Car className="mx-auto h-12 w-12 text-maseer-muted/50" />
          <h3 className="mt-4 font-serif text-[18px] font-bold text-[#1a2e1f]">No listings match criteria</h3>
          <p className="mt-1 font-lato text-xs text-maseer-muted max-w-sm mx-auto">
            Try adjusting your filters, or click "Create Vehicle" to add a new luxury vehicle to this directory.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFleets.map((car) => (
            <article 
              key={car.id} 
              className="group overflow-hidden rounded-xl border border-maseer-line bg-white shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              {/* Cover Image & Type badge */}
              <div className="relative h-[180px] bg-maseer-surface overflow-hidden">
                <img
                  src={car.image_url}
                  alt={car.vehicle_name}
                  className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                
                {/* Vehicle Type overlay tag */}
                <span className="absolute right-3.5 top-3.5 rounded-lg bg-black/60 px-2.5 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-[2px]">
                  {TYPE_MAP[car.vehicle_type] || car.vehicle_type}
                </span>

                {/* Active Indicator overlay */}
                <span className={`absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-lato text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-[2px] ${
                  car.is_active ? "bg-green-600/80" : "bg-red-600/80"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full bg-white ${car.is_active ? "animate-pulse" : ""}`} />
                  {car.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details Body */}
              <div className="p-6">
                {/* Category & Display Order */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-maseer-surface border border-maseer-line px-2.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-maseer-gold">
                    {CATEGORY_MAP[car.category] || car.category}
                  </span>
                  <span className="font-lato text-[10px] font-bold text-maseer-muted">
                    Order: <span className="text-[#1a2e1f] font-extrabold">#{car.display_order}</span>
                  </span>
                </div>

                {/* Name */}
                <h3 className="mt-3 font-serif text-[19px] font-semibold text-maseer-green-text leading-snug">
                  {car.vehicle_name}
                </h3>

                {/* Specs */}
                <div className="mt-3 flex gap-5 font-lato text-[11px] font-bold text-maseer-muted">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-maseer-gold" />
                    <span>{car.seat_count} Seats</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-maseer-gold" />
                    <span>{car.luggage_capacity} Luggage Bags</span>
                  </span>
                </div>

                {/* Amenities */}
                <div className="mt-4 border-t border-maseer-line pt-4">
                  <p className="font-lato text-[10px] font-bold text-maseer-muted uppercase tracking-[0.05em] mb-2.5">
                    Amenities ({car.amenities.length})
                  </p>
                  {car.amenities.length === 0 ? (
                    <span className="text-[11px] italic text-maseer-muted font-lato">No amenities configured</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto pr-1">
                      {car.amenities.map((item, index) => (
                        <div 
                          key={index}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-maseer-surface border border-maseer-line/50 px-2 py-1 font-lato text-[10px] font-semibold text-maseer-green-text"
                        >
                          {getAmenityIcon(item.icon_key)}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-6 border-t border-maseer-line pt-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenEdit(car)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-maseer-gold/30 hover:bg-maseer-gold/5 px-3 py-2 font-lato text-xs font-bold text-maseer-gold transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(car.id, car.vehicle_name)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 hover:bg-red-50 px-3 py-2 font-lato text-xs font-bold text-red-600 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleOpenDetails(car)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-maseer-green/30 hover:bg-maseer-green/5 px-3 py-2 font-lato text-xs font-bold text-maseer-green transition"
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>Manage Details Page</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminFleetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
        defaultDisplayOrder={fleets.length + 1}
        onSave={handleSave}
        isSaving={isSaving}
        error={error}
        setError={setError}
      />

      <AdminFleetDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        fleetItem={selectedDetailItem}
      />
    </div>
  );
}
