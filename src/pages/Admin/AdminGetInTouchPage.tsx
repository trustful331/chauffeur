import { useEffect, useState } from "react";
import {
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  MessageSquare,
  Eye,
} from "lucide-react";
import {
  fetchGetInTouches,
  deleteGetInTouch,
  type GetInTouchItem,
} from "src/api/admin/getInTouch";
import { Spinner } from "src/ui/Spinner";
import { AdminGetInTouchDetailModal } from "./AdminGetInTouchDetailModal";

export function AdminGetInTouchPage() {
  const [items, setItems] = useState<GetInTouchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GetInTouchItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadInquiries() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchGetInTouches();
      if (response && response.success && Array.isArray(response.data)) {
        // Sort inquiries by creation time desc
        const sorted = [...response.data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        setItems(sorted);
      } else {
        throw new Error(response?.message || "Invalid response format.");
      }
    } catch (err: any) {
      console.warn("Failed to load inquiries from API:", err);
      setItems([]);
      setError(err.message || "Failed to connect to queries database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleOpenDetails = (item: GetInTouchItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteGetInTouch(id);
      if (response && response.success) {
        setSuccessMessage("Get in Touch inquiry deleted successfully.");
        setDeletingId(null);
        loadInquiries();
      } else {
        throw new Error(response.message || "Failed to delete item.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete inquiry.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter items based on search
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.full_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.phone_number || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.email_address || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.note || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 space-y-6 bg-[#F4F5F4] p-6 max-md:p-4 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#062111]/10 text-[#062111] shadow-sm">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-[24px] font-bold text-[#062111]">
              Get in Touch Submissions
            </h1>
            <p className="font-lato text-sm text-maseer-muted">
              Manage client callback requests and inquiries submitted through
              the contact forms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadInquiries}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-maseer-green-text hover:bg-maseer-surface transition shadow-sm disabled:opacity-50"
            title="Refresh Inquiries"
          >
            <RefreshCw
              className={`h-4.5 w-4.5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Success / Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-lato text-xs font-bold text-emerald-800 shadow-sm">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
          <div className="flex-1">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-950 font-bold px-1 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 font-lato text-xs font-bold text-red-800 shadow-sm">
          <AlertCircle className="h-4.5 w-4.5 text-red-600" />
          <div className="flex-1">{error}</div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-950 font-bold px-1 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Filtering Controls */}
      <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-maseer-muted" />
          <input
            type="text"
            placeholder="Search by full name, phone, email address or note keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] pl-10 pr-4 py-2 font-lato text-sm text-[#062111] focus:outline-none focus:ring-1 focus:ring-[#F9BB00] bg-gray-50/50"
          />
        </div>
      </div>

      {/* inquiries Table */}
      {isLoading ? (
        <div className="flex py-20 justify-center items-center">
          <Spinner className="h-10 w-10 text-[#062111]" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-maseer-muted opacity-40" />
          <h3 className="mt-4 font-serif text-[18px] font-bold text-[#062111]">
            No inquiries found
          </h3>
          <p className="mt-1 font-lato text-xs text-maseer-muted">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full border-collapse text-left font-lato text-sm text-[#062111]">
            <thead className="bg-gray-50 border-b border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-maseer-muted">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Inquiry / Note</th>
                <th className="px-6 py-4">Date Received</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/55 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-[#062111]">
                    {item.full_name}
                  </td>
                  <td className="px-6 py-4 text-maseer-muted">
                    {item.phone_number}
                  </td>
                  <td className="px-6 py-4 text-maseer-muted">
                    {item.email_address}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-maseer-muted">
                    {item.note || (
                      <span className="italic text-gray-300">No message</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-maseer-muted">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-maseer-green-text hover:bg-maseer-surface transition"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#062111]/70 backdrop-blur-[4px]"
            onClick={() => !isDeleting && setDeletingId(null)}
          />
          <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
            <h3 className="font-serif text-[18px] font-bold text-[#062111]">
              Delete Inquiry Submission?
            </h3>
            <p className="mt-2 font-lato text-sm text-maseer-muted leading-relaxed">
              Are you sure you want to permanently delete this get_in_touch
              request? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-[#E5E7EB] px-4.5 py-2 font-lato text-sm font-bold text-maseer-green-text hover:bg-maseer-surface transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => deletingId && handleDeleteItem(deletingId)}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 font-lato text-sm font-bold text-white hover:bg-red-700 transition"
              >
                {isDeleting && <Spinner className="h-4.5 w-4.5 text-white" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AdminGetInTouchDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}
