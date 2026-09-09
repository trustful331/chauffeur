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
  getBookingFleetName,
  formatBookingDate,
  getBookingTimestamp,
  type BookingItem,
} from "src/api/admin/booking";
import { updateBookingStatus } from "src/api/booking";
import { Spinner } from "src/ui/Spinner";
import { AdminBookingDetailModal } from "./AdminBookingDetailModal";

export function AdminBookingPage() {
  const [items, setItems] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BookingItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(bookingId: string, newStatus: string) {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setSuccessMessage(`Booking status updated to ${newStatus}`);
      setItems((prev) =>
        prev.map((item) =>
          item.id === bookingId ? { ...item, booking_status: newStatus } : item
        )
      );
      setTimeout(() => setSuccessMessage(null), 3000);

      // Trigger instant notifications refresh
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("app:notification_received"));
      }, 600);
    } catch (err: any) {
      setError(err?.message || "Failed to update booking status.");
    }
  }

  async function loadBookings() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchBookings();
      if (response && response.success && Array.isArray(response.data)) {
        // Sort bookings by creation date / time (newest first)
        const sorted = [...response.data].sort(
          (a, b) => getBookingTimestamp(b) - getBookingTimestamp(a)
        );
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

    const handleFocus = () => {
      loadBookings();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
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
    const fleetName = getBookingFleetName(item);
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
      fleetName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      filterClass === "all" ||
      fleetName.toLowerCase().includes(filterClass.toLowerCase()) ||
      ((item.fleet?.category as string) || "").toLowerCase().includes(filterClass.toLowerCase());

    const itemStatus = (item.booking_status || "upcoming").toLowerCase().trim();
    const normalizedStatus =
      itemStatus === "confirmed" || itemStatus === "pending" || itemStatus === "paid" || itemStatus === "active"
        ? "upcoming"
        : itemStatus === "canceled"
          ? "cancelled"
          : itemStatus;

    const matchesStatus =
      filterStatus === "all" ||
      normalizedStatus === filterStatus.toLowerCase();

    return matchesSearch && matchesClass && matchesStatus;
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
    <div className="flex-1 space-y-6 bg-[#F4F5F4]  min-h-screen">
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
              Manage client chauffeur trip bookings, routes, schedule times, and categories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadBookings}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-bold text-maseer-green-text hover:bg-maseer-surface transition shadow-sm disabled:opacity-50"
            title="Refresh Bookings"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
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
      <div className="grid gap-4 sm:grid-cols-3 bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:col-span-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-maseer-muted" />
          <input
            type="text"
            placeholder="Search by location, route or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E5E7EB] pl-10 pr-4 py-2.5 font-lato text-xs font-medium text-[#062111] focus:outline-none focus:ring-1 focus:ring-[#F9BB00] bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider whitespace-nowrap">
            Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 font-lato text-xs font-semibold text-[#062111] focus:outline-none focus:ring-1 focus:ring-[#F9BB00] bg-gray-50/50 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider whitespace-nowrap">
            Class:
          </label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 font-lato text-xs font-semibold text-[#062111] focus:outline-none focus:ring-1 focus:ring-[#F9BB00] bg-gray-50/50 cursor-pointer"
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

      {/* Bookings Table */}
      {isLoading ? (
        <div className="flex py-20 justify-center items-center bg-white rounded-2xl border border-[#E5E7EB]">
          <Spinner className="h-10 w-10 text-[#062111]" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
          <Clipboard className="mx-auto h-12 w-12 text-maseer-muted opacity-40" />
          <h3 className="mt-4 font-serif text-[18px] font-bold text-[#062111]">
            No bookings found
          </h3>
          <p className="mt-1 font-lato text-xs text-maseer-muted">
            Try adjusting your search query or filter selection.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full border-collapse text-left font-lato text-sm text-[#062111]">
            <thead className="bg-gray-50/80 border-b border-[#E5E7EB] text-[11px] font-bold uppercase tracking-wider text-maseer-muted">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Service Type</th>
                <th className="px-5 py-4 whitespace-nowrap">Pick-up</th>
                <th className="px-5 py-4 whitespace-nowrap">Drop-off</th>
                <th className="px-5 py-4 whitespace-nowrap">Class</th>
                <th className="px-5 py-4 whitespace-nowrap">Date &amp; Time</th>
                <th className="px-5 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap">Passengers</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] bg-white">
              {filteredItems.map((item) => {
                const rawStatus = (item.booking_status || "upcoming").toLowerCase().trim();
                const status =
                  rawStatus === "confirmed" || rawStatus === "pending" || rawStatus === "paid" || rawStatus === "active"
                    ? "upcoming"
                    : rawStatus === "canceled"
                      ? "cancelled"
                      : rawStatus;
                const fleetName = getBookingFleetName(item);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70 transition-colors align-middle"
                  >
                    {/* Service Type */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-bold text-xs text-[#062111]">
                      {getServiceTypeLabel(item.service_type)}
                    </td>

                    {/* Pickup Location */}
                    <td
                      className="px-5 py-3.5 text-xs text-maseer-muted max-w-[170px] truncate"
                      title={item.pickup_location}
                    >
                      {item.pickup_location || "—"}
                    </td>

                    {/* Dropoff Location */}
                    <td
                      className="px-5 py-3.5 text-xs text-maseer-muted max-w-[170px] truncate"
                      title={item.dropoff_location}
                    >
                      {item.dropoff_location || "—"}
                    </td>

                    {/* Fleet Class */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-block rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-3 py-1 text-[11px] font-bold">
                        {fleetName}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-maseer-green-text">
                      {formatBookingDate(item)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-bold border outline-none cursor-pointer shadow-2xs transition ${status === "completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                          : status === "inprogress"
                            ? "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100"
                            : status === "cancelled" || status === "canceled"
                              ? "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
                              : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                          }`}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="inprogress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Passengers */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-maseer-muted">
                      {item.passengers_count || 1} Adult{(item.passengers_count || 1) > 1 ? "s" : ""}
                      {item.children_count && item.children_count > 0
                        ? ` + ${item.children_count} Child${item.children_count > 1 ? "ren" : ""}`
                        : ""}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-maseer-green-text hover:bg-maseer-surface transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600 hover:bg-red-50 transition"
                          title="Delete Booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
