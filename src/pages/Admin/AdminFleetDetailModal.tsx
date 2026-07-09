import React, { useEffect, useState } from "react";
import { 
  X, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Save, 
  ShieldAlert,
  Loader2,
  Calendar,
  Gem,
  UserCheck,
  Shield,
  Award,
  Clock
} from "lucide-react";
import { type FleetItem } from "src/api/admin/fleet";
import { 
  fetchFleetDetails, 
  createFleetDetail, 
  updateFleetDetail, 
  deleteFleetDetail, 
  type Highlight 
} from "src/api/admin/fleetDetail";
import { ImageUpload } from "src/ui/ImageUpload";

type AdminFleetDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fleetItem: FleetItem | null;
};

const AVAILABLE_ICONS = [
  { key: "booking", label: "Booking Checkmark", icon: Calendar },
  { key: "diamond", label: "Diamond Luxury", icon: Gem },
  { key: "chauffeur", label: "Professional Chauffeur", icon: UserCheck },
  { key: "safety", label: "Shield / Safety", icon: Shield },
  { key: "quality", label: "Award / Quality", icon: Award },
  { key: "clock", label: "24/7 Clock", icon: Clock },
];

export function AdminFleetDetailModal({
  isOpen,
  onClose,
  fleetItem,
}: AdminFleetDetailModalProps) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && fleetItem) {
      loadDetails();
    } else {
      // Reset state
      setDetailId(null);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setHighlights([]);
      setIsFeatured(false);
      setIsActive(true);
      setDisplayOrder(1);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, fleetItem]);

  const loadDetails = async () => {
    if (!fleetItem) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchFleetDetails({ fleet: fleetItem.id });
      if (response && response.success && response.data && response.data.length > 0) {
        const item = response.data[0];
        setDetailId(item.id);
        setTitle(item.title);
        setDescription(item.description);
        setImageUrl(item.vehicle_image_url);
        setHighlights(item.highlights || []);
        setIsFeatured(item.is_featured);
        setIsActive(item.is_active);
        setDisplayOrder(item.display_order);
      } else {
        // Keep empty for new detail configs
        setDetailId(null);
        setTitle("");
        setDescription("");
        setImageUrl("");
        setHighlights([]);
        setIsFeatured(false);
        setIsActive(true);
        setDisplayOrder(1);
      }
    } catch (err) {
      console.error("Failed to load details:", err);
      setError("Unable to sync details with server. Populated default settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHighlight = () => {
    if (highlights.length >= 6) {
      setError("You can specify a maximum of 6 page highlights.");
      return;
    }
    setHighlights([
      ...highlights,
      { title: "New Highlight", description: "", icon_key: "diamond" },
    ]);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, idx) => idx !== index));
  };

  const handleHighlightChange = (index: number, field: keyof Highlight, val: string) => {
    setHighlights(
      highlights.map((h, idx) => (idx === index ? { ...h, [field]: val } : h))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fleetItem) return;
    if (!title.trim()) {
      setError("Showcase Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Showcase Description is required.");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Showcase Image is required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      fleet: fleetItem.id,
      title,
      description,
      vehicle_image_url: imageUrl,
      highlights,
      is_featured: isFeatured,
      is_active: isActive,
      display_order: displayOrder,
    };

    try {
      if (detailId) {
        // Update
        const response = await updateFleetDetail(detailId, payload);
        if (response && response.success) {
          setSuccess("Page details updated successfully.");
        }
      } else {
        // Create
        const response = await createFleetDetail(payload);
        if (response && response.success && response.data) {
          setDetailId(response.data.id);
          setSuccess("Page details created successfully.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save page details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDetails = async () => {
    if (!detailId) return;
    if (!confirm("Are you sure you want to delete these page details? The vehicle details view will revert to static defaults.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await deleteFleetDetail(detailId);
      if (response && response.success) {
        setDetailId(null);
        setTitle("");
        setDescription("");
        setImageUrl("");
        setHighlights([]);
        setIsFeatured(false);
        setIsActive(true);
        setDisplayOrder(1);
        setSuccess("Page details removed successfully.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete page details.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !fleetItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-maseer-green-deep/70 backdrop-blur-[4px] transition-opacity"
        onClick={() => !isSaving && !isDeleting && onClose()}
      />

      {/* Content Container */}
      <div className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white border border-maseer-line p-6 shadow-float transition-all duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-maseer-line">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maseer-gold/10">
              <Gem className="h-5 w-5 text-maseer-gold" />
            </div>
            <div>
              <h3 className="font-serif text-[20px] font-bold text-maseer-green-text">
                Manage Details: {fleetItem.vehicle_name}
              </h3>
              <p className="font-lato text-xs text-maseer-muted">
                Configure highlights and showcase details for this listing's public view.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSaving || isDeleting}
            onClick={onClose}
            className="rounded-lg p-1 text-maseer-muted hover:bg-maseer-surface hover:text-[#1a2e1f] transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="my-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 font-lato text-xs font-semibold text-red-800 shrink-0 animate-fade-in">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="my-3 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3.5 font-lato text-xs font-semibold text-green-800 shrink-0 animate-fade-in">
            <div className="h-4.5 w-4.5 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</div>
            <div>{success}</div>
          </div>
        )}

        {/* Form Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-maseer-gold" />
            <p className="font-lato text-sm text-maseer-muted">Fetching page detail configurations...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 font-lato">
            
            {/* Title & Description */}
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Showcase Header Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unmatched Luxury Experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Showcase Summary Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe details, safety features, premium sound, climate controls..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold resize-none"
                />
              </div>
            </div>

            {/* Banner/Showcase Image */}
            <ImageUpload 
              value={imageUrl} 
              onChange={setImageUrl} 
              label="Showcase Display Image *" 
            />

            {/* Custom Highlights */}
            <div className="border-t border-maseer-line pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-maseer-green-text">Showcase Highlights ({highlights.length}/6)</h4>
                  <p className="text-[10px] text-maseer-muted">Define feature indicators shown around the vehicle semicircle arch.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  disabled={highlights.length >= 6}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-maseer-green/20 bg-white hover:bg-maseer-green/5 px-3 py-1.5 text-xs font-bold text-maseer-green transition disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Highlight</span>
                </button>
              </div>

              {highlights.length === 0 ? (
                <div className="rounded-xl border border-dashed border-maseer-line bg-maseer-cream/30 p-6 text-center text-xs text-maseer-muted italic">
                  No custom highlights added. (Click Add Highlight to configure up to 6 visual details).
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {highlights.map((h, index) => {
                    const matchedIcon = AVAILABLE_ICONS.find(i => i.key === h.icon_key);
                    const RenderIcon = matchedIcon ? matchedIcon.icon : HelpCircle;
                    
                    return (
                      <div 
                        key={index}
                        className="p-3 border border-maseer-line/80 rounded-xl bg-maseer-cream/20 flex gap-3 items-start justify-between"
                      >
                        <div className="flex-1 grid gap-3 sm:grid-cols-12 items-center">
                          {/* Title */}
                          <div className="sm:col-span-4 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-maseer-muted uppercase tracking-wider">Highlight Title</span>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Chilled Water"
                              value={h.title}
                              onChange={(e) => handleHighlightChange(index, "title", e.target.value)}
                              className="rounded-lg border border-maseer-line bg-white px-2.5 py-1.5 text-xs font-medium text-maseer-green-text focus:outline-none"
                            />
                          </div>

                          {/* Description */}
                          <div className="sm:col-span-5 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-maseer-muted uppercase tracking-wider">Sub-description (optional)</span>
                            <input
                              type="text"
                              placeholder="e.g. Always cold"
                              value={h.description}
                              onChange={(e) => handleHighlightChange(index, "description", e.target.value)}
                              className="rounded-lg border border-maseer-line bg-white px-2.5 py-1.5 text-xs font-medium text-maseer-green-text focus:outline-none"
                            />
                          </div>

                          {/* Icon Selector */}
                          <div className="sm:col-span-3 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-maseer-muted uppercase tracking-wider">Icon Badge</span>
                            <div className="flex gap-2 items-center">
                              <div className="h-7.5 w-7.5 rounded-lg bg-maseer-green text-white flex items-center justify-center shrink-0">
                                <RenderIcon className="h-4.5 w-4.5" />
                              </div>
                              <select
                                value={h.icon_key}
                                onChange={(e) => handleHighlightChange(index, "icon_key", e.target.value)}
                                className="flex-1 rounded-lg border border-maseer-line bg-white px-1.5 py-1.5 text-xs font-semibold text-maseer-green-text focus:outline-none"
                              >
                                {AVAILABLE_ICONS.map((opt) => (
                                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          className="mt-4 rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition shrink-0 self-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Display Order & Active Switches */}
            <div className="border-t border-maseer-line pt-4 grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Display Order</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
                />
              </div>

              {/* Switches */}
              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-maseer-line text-maseer-green focus:ring-maseer-gold"
                />
                <label htmlFor="is_featured" className="text-xs font-bold text-maseer-green-text uppercase tracking-wider cursor-pointer">
                  Featured Detail Page
                </label>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-maseer-line text-maseer-green focus:ring-maseer-gold"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-maseer-green-text uppercase tracking-wider cursor-pointer">
                  Details Page Active
                </label>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-maseer-line pt-4 gap-4">
              <div>
                {detailId && (
                  <button
                    type="button"
                    disabled={isSaving || isDeleting}
                    onClick={handleDeleteDetails}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    <span>Delete Page Config</span>
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isSaving || isDeleting}
                  onClick={onClose}
                  className="rounded-xl border border-maseer-line bg-white px-5 py-2.5 text-xs font-bold text-maseer-muted hover:bg-maseer-surface transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isDeleting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-maseer-green hover:bg-maseer-green-light px-5 py-2.5 text-xs font-bold text-white shadow-soft transition disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span>Save Page Config</span>
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
