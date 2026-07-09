import { useEffect, useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Plane,
  Clock,
  Briefcase,
  Crown,
  UserCheck,
  Gem,
  Award,
  Headphones
} from "lucide-react";
import { 
  fetchServiceCoverages, 
  createServiceCoverage, 
  updateServiceCoverage, 
  deleteServiceCoverage, 
  type ServiceCoverageItem, 
  type ServiceCoverageParams 
} from "src/api/admin/serviceCoverage";
import { Spinner } from "src/ui/Spinner";
import { AdminServiceCoverageModal } from "./AdminServiceCoverageModal";

// Local static items for fallback if API is not working or empty
const FALLBACK_COVERAGE: ServiceCoverageItem[] = [
  {
    id: "fb-1",
    section_type: "featured",
    section_heading: "Our Services",
    section_subtitle: "What we offer",
    title: "Airport Transfer Service",
    description: "Enjoy professional and seamless airport transfers.",
    image_url: "https://images.unsplash.com/photo-1441716842240-00d33e54911d?auto=format&fit=crop&q=80&w=600",
    is_active: true,
    display_order: 1
  },
  {
    id: "fb-2",
    section_type: "featured",
    section_heading: "Our Services",
    section_subtitle: "What we offer",
    title: "Limousine Service",
    description: "Travel in Luxury with our VIP limousine service.",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600",
    is_active: true,
    display_order: 2
  },
  {
    id: "fb-3",
    section_type: "featured",
    section_heading: "Our Services",
    section_subtitle: "What we offer",
    title: "Intercity Travel service",
    description: "Travel Between cities with comfort.",
    image_url: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=600",
    is_active: true,
    display_order: 3
  },
  {
    id: "fb-4",
    section_type: "featured",
    section_heading: "Our Services",
    section_subtitle: "What we offer",
    title: "Hire by the Hour",
    description: "Book the hour for flexible rides.",
    image_url: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600",
    is_active: true,
    display_order: 4
  },
  {
    id: "fb-5",
    section_type: "featured",
    section_heading: "Our Services",
    section_subtitle: "What we offer",
    title: "Event transport",
    description: "Luxury Chauffeur service for any occasion.",
    image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600",
    is_active: true,
    display_order: 5
  },
  {
    id: "fb-6",
    section_type: "itinerary",
    title: "Airport Transfers",
    description: "Professional airport pickup and drop-off services with real-time coordination, meet and greet support, and premium chauffeur experience for business and leisure travelers.",
    icon_key: "airplane",
    is_active: true,
    display_order: 6
  },
  {
    id: "fb-7",
    section_type: "itinerary",
    title: "Hourly Chauffeur",
    description: "Transportation services connecting major cities across Saudi Arabia including Riyadh, Jeddah, Makkah, Madinah, Dammam, and AlUla.",
    icon_key: "clock",
    is_active: true,
    display_order: 7
  },
  {
    id: "fb-8",
    section_type: "itinerary",
    title: "Corporate Mobility",
    description: "Transportation solutions for corporates, government entities, VIP guests, business meetings, conferences.",
    icon_key: "briefcase",
    is_active: true,
    display_order: 8
  },
  {
    id: "fb-9",
    section_type: "itinerary",
    title: "VIP Tourism",
    description: "Premium chauffeur services designed for executives, diplomats, celebrities, and high-profile guests requiring privacy, comfort, professionalism, and luxury.",
    icon_key: "crown",
    is_active: true,
    display_order: 9
  }
];

function getIconComponent(iconKey?: string) {
  const className = "h-5 w-5 text-maseer-gold shrink-0";
  const key = iconKey ? iconKey.toLowerCase() : "";
  if (key === "airplane" || key === "plane") return <Plane className={className} />;
  if (key === "clock") return <Clock className={className} />;
  if (key === "briefcase") return <Briefcase className={className} />;
  if (key === "crown") return <Crown className={className} />;
  if (key === "chauffeur") return <UserCheck className={className} />;
  if (key === "diamond") return <Gem className={className} />;
  if (key === "medal") return <Award className={className} />;
  if (key === "support") return <Headphones className={className} />;
  return <HelpCircle className={className} />;
}

export function AdminServiceCoveragePage() {
  const [items, setItems] = useState<ServiceCoverageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Filter states
  const [filterSection, setFilterSection] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceCoverageItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchServiceCoverages();
      if (response && response.success && Array.isArray(response.data)) {
        // Sort items by display order
        const sorted = response.data.sort((a, b) => a.display_order - b.display_order);
        setItems(sorted);
        setIsUsingFallback(false);
      } else {
        setItems(FALLBACK_COVERAGE);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.error("Error fetching service coverage, loading mock registry:", err);
      setItems(FALLBACK_COVERAGE);
      setIsUsingFallback(true);
      setError("Unable to sync with live database. Showing local offline registry.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleOpenEdit = (item: ServiceCoverageItem) => {
    setEditingItem(item);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (payload: ServiceCoverageParams) => {
    setIsSaving(true);
    setError(null);

    try {
      if (editingItem) {
        // Edit Action
        if (isUsingFallback) {
          setItems(prev =>
            prev.map(item =>
              item.id === editingItem.id ? { ...item, ...payload } : item
            ).sort((a, b) => a.display_order - b.display_order)
          );
          notifySuccess("Card updated locally (Offline Mode)");
          setModalOpen(false);
        } else {
          // API live update
          const response = await updateServiceCoverage(editingItem.id, payload);
          if (response && response.success) {
            notifySuccess(response.message || "Card updated successfully");
            loadData();
            setModalOpen(false);
          } else {
            throw new Error(response.message || "Update request rejected by server");
          }
        }
      } else {
        // Create Action
        if (isUsingFallback) {
          const newLocalItem: ServiceCoverageItem = {
            id: `local-${Date.now()}`,
            ...payload
          };
          setItems(prev => [...prev, newLocalItem].sort((a, b) => a.display_order - b.display_order));
          notifySuccess("Card created locally (Offline Mode)");
          setModalOpen(false);
        } else {
          // API live create
          const response = await createServiceCoverage(payload);
          if (response && response.success) {
            notifySuccess(response.message || "Card created successfully");
            loadData();
            setModalOpen(false);
          } else {
            throw new Error(response.message || "Create request rejected by server");
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred while saving the card.";
      console.error("Error saving service coverage:", err);
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      if (isUsingFallback) {
        setItems(prev => prev.filter(item => item.id !== id));
        notifySuccess("Card deleted locally (Offline Mode)");
      } else {
        const response = await deleteServiceCoverage(id);
        if (response && response.success) {
          notifySuccess(response.message || "Card deleted successfully");
          loadData();
        } else {
          throw new Error(response.message || "Delete request rejected by server");
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete card.";
      console.error("Error deleting service coverage:", err);
      setError(errorMsg);
    }
  };

  const getNextDisplayOrder = () => {
    if (items.length === 0) return 1;
    const orders = items.map(item => item.display_order);
    return Math.max(...orders) + 1;
  };

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchesSection = filterSection === "all" || item.section_type === filterSection;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && item.is_active) || 
      (filterStatus === "inactive" && !item.is_active);
    
    return matchesSection && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 font-lato">
      {/* Upper header action row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-maseer-green-text">
            Service Coverage Registry
          </h1>
          <p className="text-sm text-maseer-muted">
            Configure featured and itinerary cards displayed across the public website pages.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-maseer-green hover:bg-maseer-green-light px-5 py-3 text-sm font-bold text-white shadow-soft transition"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Warning/Notification Center */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-maseer-gold/30 bg-maseer-surface/60 p-4 font-semibold text-maseer-green-text">
          <CheckCircle2 className="h-5 w-5 text-maseer-gold" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <div>{error}</div>
        </div>
      )}

      {isUsingFallback && !error && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-xs font-semibold text-yellow-800">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-yellow-600 mt-0.5" />
          <div>
            <strong>Offline Local Registry:</strong> Live database connection could not be established. Running in simulated state. All changes are local.
          </div>
        </div>
      )}

      {/* Filter Toolbar Panel */}
      <div className="flex flex-col gap-4 rounded-2xl border border-maseer-line bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-maseer-muted uppercase tracking-wider">Section Type</span>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="rounded-xl border border-maseer-line bg-[#F8FAF8] px-3.5 py-2 text-xs font-bold text-maseer-green-text focus:outline-none"
            >
              <option value="all">All Sections</option>
              <option value="featured">Featured Cards</option>
              <option value="itinerary">Itinerary Cards</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-maseer-muted uppercase tracking-wider">Active Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-maseer-line bg-[#F8FAF8] px-3.5 py-2 text-xs font-bold text-maseer-green-text focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-maseer-line hover:bg-maseer-surface transition text-maseer-muted disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Database Listing Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-maseer-line bg-white shadow-sm">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-maseer-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-medium text-maseer-green-text">
              <thead className="bg-[#F8FAF8] border-b border-maseer-line font-bold text-maseer-muted uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Visual Icon/Img</th>
                  <th className="px-6 py-4">Card Title / Info</th>
                  <th className="px-6 py-4">Section Type</th>
                  <th className="px-6 py-4">Headings Context</th>
                  <th className="px-6 py-4 text-center">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maseer-line font-medium text-sm">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-maseer-muted font-bold">
                      No service coverage items found. Try adjusting filters or create a new card.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-maseer-surface/20 transition">
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.section_type === "featured" ? (
                          item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-10 w-16 rounded-lg object-cover border border-maseer-line bg-gray-50"
                            />
                          ) : (
                            <span className="text-xs text-red-500 italic">No Image</span>
                          )
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-maseer-tint-green border border-maseer-line">
                            {getIconComponent(item.icon_key)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#1a2e1f] text-sm">{item.title}</div>
                        <div className="max-w-xs truncate text-xs text-maseer-muted mt-0.5" title={item.description}>
                          {item.description}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.section_type === "featured" 
                            ? "bg-purple-50 text-purple-700 border border-purple-200" 
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {item.section_type === "featured" ? "Featured" : "Itinerary"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {item.section_heading ? (
                          <div>
                            <span className="text-maseer-muted font-bold">H:</span> {item.section_heading}
                          </div>
                        ) : null}
                        {item.section_subtitle ? (
                          <div className="mt-0.5">
                            <span className="text-maseer-muted font-bold">S:</span> {item.section_subtitle}
                          </div>
                        ) : null}
                        {!item.section_heading && !item.section_subtitle ? (
                          <span className="text-maseer-muted italic">None</span>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center font-bold">
                        {item.display_order}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.is_active 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 border border-maseer-line hover:bg-maseer-surface hover:text-[#1a2e1f] transition text-maseer-muted"
                            title="Edit Card"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="rounded-lg p-1.5 border border-red-100 hover:bg-red-50 hover:text-red-600 transition text-red-400"
                            title="Delete Card"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Creation and Edit modal */}
      <AdminServiceCoverageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
        defaultDisplayOrder={getNextDisplayOrder()}
        onSave={handleSave}
        isSaving={isSaving}
        error={error}
        setError={setError}
      />
    </div>
  );
}
