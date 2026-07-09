import React, { useEffect, useState } from "react";
import { MapPin, X, AlertCircle } from "lucide-react";
import { type ServiceCoverageItem, type ServiceCoverageParams } from "src/api/admin/serviceCoverage";
import { Spinner } from "src/ui/Spinner";
import { ImageUpload } from "src/ui/ImageUpload";

const SECTION_TYPE_MAP = {
  featured: "Featured (Image Cards)",
  itinerary: "Itinerary (Icon Cards)",
} as const;

const SECTION_TYPES = Object.entries(SECTION_TYPE_MAP) as [keyof typeof SECTION_TYPE_MAP, string][];

const AVAILABLE_ICONS = [
  { key: "airplane", name: "Airplane" },
  { key: "clock", name: "Hourly Clock" },
  { key: "briefcase", name: "Corporate Briefcase" },
  { key: "crown", name: "VIP Crown" },
  { key: "chauffeur", name: "Chauffeur Hat" },
  { key: "diamond", name: "Luxury Diamond" },
  { key: "medal", name: "Ziarah Medal" },
  { key: "support", name: "24/7 Support" },
];

type AdminServiceCoverageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingItem: ServiceCoverageItem | null;
  defaultDisplayOrder: number;
  onSave: (payload: ServiceCoverageParams) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  setError: (err: string | null) => void;
};

export function AdminServiceCoverageModal({
  isOpen,
  onClose,
  editingItem,
  defaultDisplayOrder,
  onSave,
  isSaving,
  error,
  setError,
}: AdminServiceCoverageModalProps) {
  const [sectionType, setSectionType] = useState<ServiceCoverageItem["section_type"]>("featured");
  const [sectionHeading, setSectionHeading] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [iconKey, setIconKey] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number | "">("");

  // Synchronize internal state with editingItem or defaults when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setSectionType(editingItem.section_type);
        setSectionHeading(editingItem.section_heading || "");
        setSectionSubtitle(editingItem.section_subtitle || "");
        setTitle(editingItem.title);
        setDescription(editingItem.description);
        setImageUrl(editingItem.image_url || "");
        setIconKey(editingItem.icon_key || "");
        setIsActive(editingItem.is_active);
        setDisplayOrder(editingItem.display_order);
      } else {
        setSectionType("featured");
        setSectionHeading("");
        setSectionSubtitle("");
        setTitle("");
        setDescription("");
        setImageUrl("");
        setIconKey("");
        setIsActive(true);
        setDisplayOrder(defaultDisplayOrder);
      }
    }
  }, [isOpen, editingItem, defaultDisplayOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (sectionType === "featured" && !imageUrl.trim()) {
      setError("Featured cards require an image URL.");
      return;
    }
    if (sectionType === "itinerary" && !iconKey) {
      setError("Itinerary cards require an icon key.");
      return;
    }
    if (displayOrder === "" || Number(displayOrder) < 1) {
      setError("Display order must be at least 1.");
      return;
    }

    const payload: ServiceCoverageParams = {
      section_type: sectionType,
      section_heading: sectionHeading.trim() || undefined,
      section_subtitle: sectionSubtitle.trim() || undefined,
      title: title.trim(),
      description: description.trim(),
      image_url: sectionType === "featured" ? imageUrl.trim() : undefined,
      icon_key: sectionType === "itinerary" ? iconKey : undefined,
      is_active: isActive,
      display_order: Number(displayOrder),
    };

    onSave(payload);
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
              <MapPin className="h-5 w-5 text-maseer-green" />
            </div>
            <div>
              <h3 className="font-serif text-[20px] font-bold text-maseer-green-text">
                {editingItem ? "Edit Service Coverage" : "Create Service Coverage"}
              </h3>
              <p className="font-lato text-xs text-maseer-muted">
                {editingItem ? "Update details for the selected service coverage registry." : "Register a brand new service or location card."}
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
          {/* Row 1: Section Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Card Section Type *</label>
              <select
                value={sectionType}
                required
                onChange={(e) => {
                  setSectionType(e.target.value as ServiceCoverageItem["section_type"]);
                  setError(null);
                }}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              >
                {SECTION_TYPES.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
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

          {/* Row 2: Title & Headings */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Card Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Airport Transfers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text placeholder-maseer-muted/65 focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Section Heading (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Our Services"
                value={sectionHeading}
                onChange={(e) => setSectionHeading(e.target.value)}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text placeholder-maseer-muted/65 focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>
          </div>

          {/* Row 3: Subtitle & Icon/Image conditional selector */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Section Subtitle (Optional)</label>
              <input
                type="text"
                placeholder="e.g. What we offer"
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text placeholder-maseer-muted/65 focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>

            {sectionType === "itinerary" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Card Icon *</label>
                <select
                  value={iconKey}
                  required
                  onChange={(e) => setIconKey(e.target.value)}
                  className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
                >
                  <option value="" disabled>Select an icon...</option>
                  {AVAILABLE_ICONS.map((ico) => (
                    <option key={ico.key} value={ico.key}>{ico.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Row 4: Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a detailed description of this service or coverage card."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text placeholder-maseer-muted/65 focus:outline-none focus:ring-1 focus:ring-maseer-gold resize-none"
            />
          </div>

          {/* Row 5: Conditional Image Upload for Featured */}
          {sectionType === "featured" && (
            <ImageUpload 
              value={imageUrl} 
              onChange={setImageUrl} 
              label="Card Background Image *" 
            />
          )}

          {/* Row 6: Active Status Toggle */}
          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-maseer-line bg-maseer-cream text-maseer-green focus:outline-none focus:ring-1 focus:ring-maseer-gold cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-maseer-green-text select-none cursor-pointer">
              Activate this coverage listing immediately to display on the public website
            </label>
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
              <span>{editingItem ? "Save Changes" : "Create Card"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
