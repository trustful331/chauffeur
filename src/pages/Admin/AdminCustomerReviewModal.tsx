import React, { useEffect, useState } from "react";
import { MessageSquare, X, AlertCircle } from "lucide-react";
import { type CustomerReviewItem, type CustomerReviewParams } from "src/api/admin/customerReview";
import { Spinner } from "src/ui/Spinner";
import { ImageUpload } from "src/ui/ImageUpload";

type AdminCustomerReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingItem: CustomerReviewItem | null;
  defaultDisplayOrder: number;
  onSave: (payload: CustomerReviewParams) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  setError: (err: string | null) => void;
};

export function AdminCustomerReviewModal({
  isOpen,
  onClose,
  editingItem,
  defaultDisplayOrder,
  onSave,
  isSaving,
  error,
  setError,
}: AdminCustomerReviewModalProps) {
  const [sectionTitle, setSectionTitle] = useState("What Our Clients Say");
  const [sectionSubtitle, setSectionSubtitle] = useState("Real reviews");
  const [customerName, setCustomerName] = useState("");
  const [customerImageUrl, setCustomerImageUrl] = useState("");
  const [starRating, setStarRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number | "">("");

  // Synchronize internal state with editingItem or defaults when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setSectionTitle(editingItem.section_title || "What Our Clients Say");
        setSectionSubtitle(editingItem.section_subtitle || "Real reviews");
        setCustomerName(editingItem.customer_name);
        setCustomerImageUrl(editingItem.customer_image_url || "");
        setStarRating(editingItem.star_rating);
        setReviewTitle(editingItem.review_title);
        setReviewContent(editingItem.review_content);
        setIsActive(editingItem.is_active);
        setDisplayOrder(editingItem.display_order);
      } else {
        setSectionTitle("What Our Clients Say");
        setSectionSubtitle("Real reviews");
        setCustomerName("");
        setCustomerImageUrl("");
        setStarRating(5);
        setReviewTitle("");
        setReviewContent("");
        setIsActive(true);
        setDisplayOrder(defaultDisplayOrder);
      }
    }
  }, [isOpen, editingItem, defaultDisplayOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!reviewTitle.trim()) {
      setError("Review title is required.");
      return;
    }
    if (!reviewContent.trim()) {
      setError("Review content is required.");
      return;
    }
    if (displayOrder === "" || Number(displayOrder) < 1) {
      setError("Display order must be at least 1.");
      return;
    }

    const payload: CustomerReviewParams = {
      section_title: sectionTitle.trim() || "What Our Clients Say",
      section_subtitle: sectionSubtitle.trim() || "Real reviews",
      customer_name: customerName.trim(),
      customer_image_url: customerImageUrl.trim() || undefined,
      star_rating: starRating,
      review_title: reviewTitle.trim(),
      review_content: reviewContent.trim(),
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
              <MessageSquare className="h-5 w-5 text-maseer-green" />
            </div>
            <div>
              <h3 className="font-serif text-[20px] font-bold text-maseer-green-text">
                {editingItem ? "Edit Customer Review" : "Create Customer Review"}
              </h3>
              <p className="font-lato text-xs text-maseer-muted">
                {editingItem ? "Update details for the selected customer testimonial." : "Add a brand new customer feedback entry."}
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
          {/* Row 1: Section Title & Subtitle */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Section Title *</label>
              <input
                type="text"
                required
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="What Our Clients Say"
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Section Subtitle *</label>
              <input
                type="text"
                required
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                placeholder="Real reviews"
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>
          </div>

          {/* Row 2: Customer Name, Star Rating, Display Order */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Emily Rodriguez"
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Star Rating *</label>
              <select
                value={starRating}
                onChange={(e) => setStarRating(Number(e.target.value))}
                className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★</option>
                <option value={3}>3 Stars ★★★</option>
                <option value={2}>2 Stars ★★</option>
                <option value={1}>1 Star ★</option>
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

          {/* Row 3: Review Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Review Title *</label>
            <input
              type="text"
              required
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="e.g. It is always a pleasure"
              className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-2.5 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
            />
          </div>

          {/* Row 4: Review Content / Quote */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Review Content *</label>
            <textarea
              required
              rows={4}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Write the quote or testimonial content details here..."
              className="rounded-xl border border-maseer-line bg-maseer-cream px-4 py-3 text-sm font-medium text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold resize-none"
            />
          </div>

          {/* Row 5: Customer Image (Avatar) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">Customer Image / Avatar</label>
            <ImageUpload 
              value={customerImageUrl} 
              onChange={(url) => setCustomerImageUrl(url)} 
            />
            <p className="text-[11px] text-maseer-muted">
              Select or drag an image representing the customer. If left blank, a fallback standard user image will be displayed.
            </p>
          </div>

          {/* Row 6: Active Status checkbox */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-maseer-line bg-maseer-cream text-maseer-green focus:ring-maseer-gold"
            />
            <label htmlFor="is_active" className="text-sm font-bold text-maseer-green-text cursor-pointer select-none">
              Publish Review (Visible on Website)
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-maseer-line">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-xl border border-maseer-line px-5 py-2.5 text-sm font-semibold text-maseer-green-text hover:bg-maseer-surface transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-maseer-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#152518] transition disabled:opacity-50"
          >
            {isSaving && <Spinner className="h-4 w-4 text-white" />}
            {editingItem ? "Save Changes" : "Create Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
