import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CheckCircle2,
  XCircle,
  Filter,
  RefreshCw,
  Eye,
} from "lucide-react";
import { fetchUserBookings, cancelBooking } from "src/api/booking";
import {
  getBookingFleetName,
  formatBookingDate,
  type BookingItem,
} from "src/api/admin/booking";
import { Spinner } from "src/ui/Spinner";
import { AdminBookingDetailModal } from "../Admin/AdminBookingDetailModal";

type TabType = "upcoming" | "history";

export function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  async function loadBookings() {
    setIsLoading(true);
    try {
      const fromParam = fromDate ? new Date(fromDate).toISOString() : undefined;
      const toParam = toDate ? new Date(`${toDate}T23:59:59`).toISOString() : undefined;

      const data = await fetchUserBookings({
        status: activeTab,
        from: fromParam,
        to: toParam,
      });

      setBookings(data);
    } catch (error) {
      console.warn("Failed to load user reservations:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  function handleApplyDateFilter(e: React.FormEvent) {
    e.preventDefault();
    loadBookings();
  }

  function handleResetFilters() {
    setFromDate("");
    setToDate("");
    loadBookings();
  }

  async function handleCancelTrip(bookingId: string) {
    if (!window.confirm("Are you sure you want to cancel this booking reservation?")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully.");
      loadBookings();
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  }

  function getStatusBadge(status?: string) {
    const s = (status || "upcoming").toLowerCase();

    if (s === "inprogress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 animate-pulse">
          <Clock className="h-3.5 w-3.5" /> In Progress
        </span>
      );
    }

    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
        </span>
      );
    }

    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
          <XCircle className="h-3.5 w-3.5" /> Canceled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
        <Clock className="h-3.5 w-3.5" /> Upcoming
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 font-lato">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-maseer-line/50 pb-6">
          <div>
            <p className="eyebrow text-maseer-gold">MY RIDES &amp; TRIPS</p>
            <h1 className="font-serif text-3xl font-bold text-maseer-green-text mt-1">
              Reservations
            </h1>
            <p className="text-sm text-maseer-muted mt-1">
              View and manage your upcoming bookings and past ride history
            </p>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            className="inline-flex items-center gap-2 rounded-xl border border-maseer-line/60 bg-white px-4 py-2.5 text-xs font-bold text-maseer-green-text hover:bg-maseer-surface transition shadow-sm self-start md:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Trips</span>
          </button>
        </div>

        {/* Navigation Tabs (Upcoming vs History) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-maseer-line/60 shadow-sm">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-lato text-sm font-bold transition ${activeTab === "upcoming"
                  ? "bg-maseer-green text-white shadow-md"
                  : "text-maseer-muted hover:bg-maseer-cream/40 hover:text-maseer-green-text"
                }`}
            >
              <Clock className="h-4 w-4" />
              <span>Upcoming</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-lato text-sm font-bold transition ${activeTab === "history"
                  ? "bg-maseer-green text-white shadow-md"
                  : "text-maseer-muted hover:bg-maseer-cream/40 hover:text-maseer-green-text"
                }`}
            >
              <Calendar className="h-4 w-4" />
              <span>History</span>
            </button>
          </div>

          {/* Date Range Filter Form */}
          <form onSubmit={handleApplyDateFilter} className="flex flex-wrap items-center gap-2 px-2">
            <div className="flex items-center gap-1.5 text-xs text-maseer-muted">
              <Filter className="h-3.5 w-3.5 text-maseer-gold" />
              <span>Date:</span>
            </div>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-maseer-green-text outline-none focus:border-maseer-gold"
            />
            <span className="text-xs text-maseer-muted">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-maseer-green-text outline-none focus:border-maseer-gold"
            />

            <button
              type="submit"
              className="rounded-lg bg-maseer-gold px-3 py-1.5 text-xs font-bold text-maseer-green-text hover:bg-maseer-gold-light transition"
            >
              Filter
            </button>
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-maseer-muted hover:bg-gray-50 transition"
              >
                Reset
              </button>
            )}
          </form>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-maseer-line/50 shadow-sm">
            <Spinner size="lg" className="text-maseer-gold" />
            <p className="mt-4 font-lato text-sm font-semibold text-maseer-muted">
              Loading your reservations...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-maseer-line/50 p-8 text-center shadow-sm space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-maseer-cream/60 text-maseer-gold">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="font-serif text-xl font-bold text-maseer-green-text">
                No {activeTab === "upcoming" ? "Upcoming" : "History"} Bookings Found
              </h3>
              <p className="text-xs text-maseer-muted">
                {activeTab === "upcoming"
                  ? "You don't have any scheduled upcoming chauffeur trips right now."
                  : "You haven't completed or cancelled any previous trips yet."}
              </p>
            </div>
          </div>
        ) : (
          /* Bookings List Cards */
          <div className="space-y-4">
            {bookings.map((booking) => {
              const fleetName = getBookingFleetName(booking);
              const formattedDate = formatBookingDate(booking);

              return (
                <div
                  key={booking.id}
                  className="group rounded-3xl border border-maseer-line/60 bg-white p-6 shadow-sm transition hover:border-maseer-gold/60 hover:shadow-md space-y-5"
                >
                  {/* Card Header: Service Badge + Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-maseer-green/10 text-maseer-green font-bold">
                        <Car className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#062111] capitalize">
                          {(booking.service_type || "Chauffeur Service").replace(/_/g, " ")}
                        </h4>
                        <p className="text-xs text-maseer-muted">
                          Ref ID: <span className="font-mono font-semibold">{booking.id}</span>
                        </p>
                      </div>
                    </div>

                    <div>{getStatusBadge(booking.booking_status)}</div>
                  </div>

                  {/* Route & Vehicle Grid */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Pickup */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-maseer-muted flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-600" /> Pickup Location
                      </p>
                      <p className="text-xs font-semibold text-maseer-green-text truncate" title={booking.pickup_location}>
                        {booking.pickup_location || "N/A"}
                      </p>
                    </div>

                    {/* Dropoff */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-maseer-muted flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-600" /> Dropoff Location
                      </p>
                      <p className="text-xs font-semibold text-maseer-green-text truncate" title={booking.dropoff_location}>
                        {booking.dropoff_location || "N/A"}
                      </p>
                    </div>

                    {/* Date & Vehicle */}
                    <div className="space-y-1 sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-maseer-muted flex items-center sm:justify-end gap-1">
                        <Calendar className="h-3 w-3 text-maseer-gold" /> Date &amp; Vehicle
                      </p>
                      <p className="text-xs font-semibold text-maseer-green-text">
                        {formattedDate}
                      </p>
                      <span className="inline-block mt-0.5 rounded-full bg-maseer-gold/15 px-2.5 py-0.5 text-[11px] font-bold text-maseer-green-text">
                        {fleetName}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Amount & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-maseer-muted">
                        Total Amount
                      </p>
                      <p className="text-sm font-bold text-[#062111]">
                        {Number(booking.amount || 0)} {String(booking.currency || "KWD")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-maseer-green-text hover:bg-maseer-cream/50 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>

                      {activeTab === "upcoming" && (booking.booking_status || "upcoming").toLowerCase() !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => handleCancelTrip(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? (
                            <Spinner size="sm" className="text-red-700" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                          <span>Cancel Trip</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <AdminBookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
}
