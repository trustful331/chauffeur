import { useEffect, useState } from "react";
import {
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Clipboard,
  Eye,
} from "lucide-react";
import {
  fetchBookings,
  deleteBooking,
  type BookingItem,
} from "src/api/admin/booking";
import { Spinner } from "src/ui/Spinner";
import { AdminBookingDetailModal } from "./AdminBookingDetailModal";

export function AdminBookingPage() {
  const [items, setItems] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
console.log(items,"check data");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");

  // Modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BookingItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadBookings() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchBookings();
      if (response && response.success && Array.isArray(response.data)) {
        // Sort bookings by creation date / time
        const sorted = [...response.data].sort((a, b) => {
          const dateA = a.date_and_time
            ? new Date(a.date_and_time).getTime()
            : 0;
          const dateB = b.date_and_time
            ? new Date(b.date_and_time).getTime()
            : 0;
          return dateA - dateB; // Chronological order
        });
        setItems(sorted);
      } else {
        throw new Error(response?.message || "Invalid response format.");
      }
    } catch (err: any) {
      console.warn("Failed to load bookings from API:", err);
      setItems([]);
      setError(err.message || "Failed to connect to bookings database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const handleOpenDetails = (item: BookingItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteBooking(id);
      if (response && response.success) {
        setSuccessMessage("Booking deleted successfully.");
        setDeletingId(null);
        loadBookings();
      } else {
        throw new Error(response.message || "Failed to delete item.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete booking.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter items based on search and class select
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.pickup_location || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.dropoff_location || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.service_type || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.fleet_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      filterClass === "all" ||
      (item.fleet_name || "").toLowerCase() === filterClass.toLowerCase();

    return matchesSearch && matchesClass;
  });

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "airport_transfer":
        return "Airport Transfer";
      case "a_to_b_transfer":
        return "A to B Transfer";
      case "hourly_service":
        return "Hourly Service";
      case "daily_service":
        return "Daily Service";
      default:
        return type;
    }
  };

  return (
    <div className="flex-1 space-y-6 bg-[#F4F5F4] p-6 max-md:p-4 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#062111]/10 text-[#062111] shadow-sm">
            <Clipboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-[24px] font-bold text-[#062111]">
              Customer Bookings
            </h1>
            <p className="font-lato text-sm text-maseer-muted">
              Manage client chauffeur trip bookings, routes, schedule times, and
              categories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadBookings}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-maseer-green-text hover:bg-maseer-surface transition shadow-sm disabled:opacity-50"
            title="Refresh Bookings"
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
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr] bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-maseer-muted" />
          <input
            type="text"
            placeholder="Search by pickup, dropoff location or service type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] pl-10 pr-4 py-2 font-lato text-sm text-[#062111] focus:outline-none focus:ring-1 focus:ring-[#F9BB00] bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider whitespace-nowrap">
            Class:
          </label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 font-lato text-sm text-[#062111] focus:outline-none focus:ring-1 focus:ring-[#F9BB00] bg-gray-50/50"
          >
            <option value="all">All Classes</option>
            <option value="business class">Business Class</option>
            <option value="vip / business class">VIP / Business Class</option>
            <option value="ultra luxury">Ultra Luxury</option>
            <option value="business van">Business Van</option>
            <option value="economy class">Economy Class</option>
            <option value="green class">Green Class</option>
          </select>
        </div>
      </div>

      {/* bookings Table */}
      {isLoading ? (
        <div className="flex py-20 justify-center items-center">
          <Spinner className="h-10 w-10 text-[#062111]" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
          <Clipboard className="mx-auto h-12 w-12 text-maseer-muted opacity-40" />
          <h3 className="mt-4 font-serif text-[18px] font-bold text-[#062111]">
            No bookings found
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
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Pick-up</th>
                <th className="px-6 py-4">Drop-off</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Passengers</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] ">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/55 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-[#062111]">
                    {getServiceTypeLabel(item.service_type)}
                  </td>
                  <td
                    className="px-6 py-4 text-maseer-muted max-w-[200px] truncate"
                    title={item.pickup_location}
                  >
                    {item.pickup_location}
                  </td>
                  <td
                    className="px-6 py-4 text-maseer-muted max-w-[200px] truncate"
                    title={item.dropoff_location}
                  >
                    {item.dropoff_location}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-[#0b331b]/10 text-maseer-green px-2.5 py-0.5 text-xs font-bold">
                      {item.fleet_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-maseer-muted">
                    {item.date_and_time
                      ? new Date(item.date_and_time).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-maseer-muted">
                    {item.passengers_count} Adults{" "}
                    {item.children_count > 0 ? `+ ${item.children_count} Children` : ""}
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
                        title="Delete Booking"
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
              Delete Booking Record?
            </h3>
            <p className="mt-2 font-lato text-sm text-maseer-muted leading-relaxed">
              Are you sure you want to permanently delete this booking
              registration? This action cannot be undone.
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
      <AdminBookingDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        booking={selectedItem}
      />
    </div>
  );
}
