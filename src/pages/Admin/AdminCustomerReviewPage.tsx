import { useEffect, useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Star,
  Search,
  MessageSquare
} from "lucide-react";
import { 
  fetchCustomerReviews, 
  createCustomerReview, 
  updateCustomerReview, 
  deleteCustomerReview, 
  type CustomerReviewItem, 
  type CustomerReviewParams 
} from "src/api/admin/customerReview";
import { Spinner } from "src/ui/Spinner";
import { AdminCustomerReviewModal } from "./AdminCustomerReviewModal";

// Local static reviews for fallback if API is not working or empty
const FALLBACK_REVIEWS: CustomerReviewItem[] = [
  {
    id: "fb-rev-1",
    section_title: "What Our Clients Say",
    section_subtitle: "Real reviews",
    customer_name: "Emily Rodriguez",
    customer_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    star_rating: 5,
    review_title: "It is always a pleasure",
    review_content: '"Absolutely fantastic service! The driver was professional, the car was spotless, and they handled my luggage with care. Will definitely use again for airport transfers."',
    is_active: true,
    display_order: 1
  },
  {
    id: "fb-rev-2",
    section_title: "What Our Clients Say",
    section_subtitle: "Real reviews",
    customer_name: "James Al-Farsi",
    customer_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    star_rating: 5,
    review_title: "Highly recommended",
    review_content: '"Best chauffeur experience in Riyadh. On time, courteous, and the S-Class was immaculate. Will definitely use again for airport transfers and corporate travel."',
    is_active: true,
    display_order: 2
  },
  {
    id: "fb-rev-3",
    section_title: "What Our Clients Say",
    section_subtitle: "Real reviews",
    customer_name: "Sarah Mitchell",
    customer_image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    star_rating: 5,
    review_title: "Flawless coordination",
    review_content: '"Used Maseer for corporate events multiple times. Flawless coordination and VIP treatment every single trip. Will definitely use again for airport transfers."',
    is_active: true,
    display_order: 3
  }
];

export function AdminCustomerReviewPage() {
  const [items, setItems] = useState<CustomerReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerReviewItem | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadReviews() {
    setIsLoading(true);
    setError(null);
    setIsUsingFallback(false);
    try {
      const response = await fetchCustomerReviews();
      if (response && response.success && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          // Empty dynamic registry -> fallback warning
          setItems(FALLBACK_REVIEWS);
          setIsUsingFallback(true);
        } else {
          setItems(response.data.sort((a, b) => a.display_order - b.display_order));
        }
      } else {
        throw new Error(response?.message || "Invalid payload format received.");
      }
    } catch (err: any) {
      console.warn("Failed to load reviews from API, using offline fallback registry:", err);
      setItems(FALLBACK_REVIEWS);
      setIsUsingFallback(true);
      setError("Unable to connect to reviews database. Displaying local static fallbacks.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CustomerReviewItem) => {
    setEditingItem(item);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (payload: CustomerReviewParams) => {
    if (isUsingFallback) {
      setError("Cannot save modifications while in offline fallback mode.");
      setIsModalOpen(false);
      return;
    }
    setIsSaving(true);
    setModalError(null);
    try {
      if (editingItem) {
        // Edit update API
        const response = await updateCustomerReview(editingItem.id, payload);
        if (response && response.success) {
          setSuccessMessage("Customer review updated successfully!");
          setIsModalOpen(false);
          loadReviews();
        } else {
          throw new Error(response.message || "Failed to update item.");
        }
      } else {
        // Create review API
        const response = await createCustomerReview(payload);
        if (response && response.success) {
          setSuccessMessage("New customer review added successfully!");
          setIsModalOpen(false);
          loadReviews();
        } else {
          throw new Error(response.message || "Failed to create item.");
        }
      }
    } catch (err: any) {
      setModalError(err.message || "An error occurred while saving the review.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (item: CustomerReviewItem) => {
    if (isUsingFallback) {
      // Local toggles in fallback mode
      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, is_active: !i.is_active } : i))
      );
      setSuccessMessage(`Local status toggled for ${item.customer_name}.`);
      return;
    }
    try {
      const response = await updateCustomerReview(item.id, { is_active: !item.is_active });
      if (response && response.success) {
        setSuccessMessage(`Status updated for ${item.customer_name}.`);
        loadReviews();
      } else {
        throw new Error(response.message || "Failed to toggle status.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update review status.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (isUsingFallback) {
      // Local delete in fallback mode
      setItems(prev => prev.filter(i => i.id !== id));
      setSuccessMessage("Review entry removed from local fallback registry.");
      setDeletingId(null);
      return;
    }
    setIsSaving(true);
    try {
      const response = await deleteCustomerReview(id);
      if (response && response.success) {
        setSuccessMessage("Customer review entry deleted successfully.");
        setDeletingId(null);
        loadReviews();
      } else {
        throw new Error(response.message || "Failed to delete item.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete customer review.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter items based on search and status selects
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.review_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.review_content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && item.is_active) ||
      (filterStatus === "inactive" && !item.is_active);

    return matchesSearch && matchesStatus;
  });

  const nextDisplayOrder = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 1;

  return (
    <div className="flex-1 space-y-6 bg-maseer-cream p-6 max-md:p-4 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-maseer-line pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maseer-tint-green shadow-soft">
            <MessageSquare className="h-6 w-6 text-maseer-green" />
          </div>
          <div>
            <h1 className="font-serif text-[24px] font-bold text-maseer-green-text">
              Customer Reviews Registry
            </h1>
            <p className="font-lato text-sm text-maseer-muted">
              Configure dynamic client testimonials, feedback ratings, and testimonials sliders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadReviews}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-maseer-line bg-white text-maseer-green-text hover:bg-maseer-surface transition shadow-soft disabled:opacity-50"
            title="Refresh Registry"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-maseer-green hover:bg-maseer-green-light px-5 py-3 font-lato text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-[1px]"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* Fallback & Info Warnings */}
      {isUsingFallback && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 font-lato text-xs font-semibold text-amber-800 shadow-soft">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-amber-900">Database Offline / Empty Registry</p>
            <p className="mt-1 font-normal text-amber-800/90">
              The dashboard is currently reading a local fallback reviews list. New additions or deletions will affect local displays but cannot save to the server until connection is restored.
            </p>
          </div>
        </div>
      )}

      {/* Success / Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-lato text-xs font-bold text-emerald-800 shadow-soft">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
          <div className="flex-1">{successMessage}</div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-950 font-bold px-1 text-sm">×</button>
        </div>
      )}

      {error && !isUsingFallback && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 font-lato text-xs font-bold text-red-800 shadow-soft">
          <AlertCircle className="h-4.5 w-4.5 text-red-600" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-950 font-bold px-1 text-sm">×</button>
        </div>
      )}

      {/* Filtering Controls */}
      <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr] bg-white border border-maseer-line p-4 rounded-xl shadow-soft">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-maseer-muted" />
          <input
            type="text"
            placeholder="Search by customer name, review title or quote contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-maseer-line pl-10 pr-4 py-2 font-lato text-sm text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold bg-maseer-cream/35"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider whitespace-nowrap">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-lg border border-maseer-line px-3 py-2 font-lato text-sm text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold bg-maseer-cream/35"
          >
            <option value="all">All Reviews</option>
            <option value="active">Active (Visible)</option>
            <option value="inactive">Inactive (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Grid List representation of Reviews */}
      {isLoading ? (
        <div className="flex py-20 justify-center items-center">
          <Spinner className="h-10 w-10 text-maseer-green" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-maseer-line bg-white py-16 text-center shadow-soft">
          <MessageSquare className="mx-auto h-12 w-12 text-maseer-muted opacity-40" />
          <h3 className="mt-4 font-serif text-[18px] font-bold text-maseer-green-text">No reviews found</h3>
          <p className="mt-1 font-lato text-xs text-maseer-muted">
            Try adjusting your search criteria or register a new customer feedback entry.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article 
              key={item.id} 
              className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-soft transition-all duration-300 ${
                item.is_active ? "border-maseer-line hover:border-maseer-green" : "border-red-200 bg-red-50/20"
              }`}
            >
              {/* Card Header Info */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.customer_image_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
                      alt={item.customer_name}
                      className="h-12 w-12 rounded-full border border-maseer-line object-cover shadow-soft"
                    />
                    <div>
                      <h4 className="font-serif text-[16px] font-bold text-maseer-green-text leading-tight">
                        {item.customer_name}
                      </h4>
                      <p className="font-lato text-[11px] text-maseer-muted mt-0.5">
                        Order: {item.display_order} • Header: {item.section_subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status pills */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      item.is_active 
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                    title="Toggle Publish Status"
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* Rating stars */}
                <div className="mt-4 flex gap-0.5 text-primary">
                  {Array.from({ length: item.star_rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current stroke-none" />
                  ))}
                </div>

                {/* Review Heading & Quote */}
                <h5 className="mt-3 font-serif text-[16px] font-bold text-maseer-green-text">
                  {item.review_title}
                </h5>
                <p className="mt-2 font-lato text-xs leading-relaxed text-maseer-muted italic">
                  {item.review_content}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-maseer-line/80 pt-4.5">
                <span className="font-lato text-[10px] font-bold text-maseer-green uppercase tracking-wide">
                  {item.section_title}
                </span>

                <div className="flex items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-maseer-line text-maseer-green-text hover:bg-maseer-surface hover:text-[#1a2e1f] transition"
                    title="Edit Review Details"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                    title="Delete Review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation Overlay Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-maseer-green-deep/70 backdrop-blur-[4px]" onClick={() => !isSaving && setDeletingId(null)} />
          <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-float transition-all">
            <h3 className="font-serif text-[18px] font-bold text-maseer-green-text">Delete Testimonial Entry?</h3>
            <p className="mt-2 font-lato text-sm text-maseer-muted leading-relaxed">
              Are you sure you want to permanently delete this customer review? This action is irreversible and will remove the testimonial immediately.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-maseer-line px-4.5 py-2 font-lato text-sm font-bold text-maseer-green-text hover:bg-maseer-surface transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => deletingId && handleDeleteItem(deletingId)}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 font-lato text-sm font-bold text-white hover:bg-red-700 transition"
              >
                {isSaving && <Spinner className="h-4.5 w-4.5 text-white" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Form integration */}
      <AdminCustomerReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingItem={editingItem}
        defaultDisplayOrder={nextDisplayOrder}
        onSave={handleSaveItem}
        isSaving={isSaving}
        error={modalError}
        setError={setModalError}
      />
    </div>
  );
}
