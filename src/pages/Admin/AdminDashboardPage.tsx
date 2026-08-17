import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Car,
  DollarSign,
  PhoneCall,
  Star,
  RefreshCw,
  Clock,
  ArrowRight,
  Eye,
  AlertCircle,
  MapPin,
} from "lucide-react";
import {
  fetchBookings,
  getBookingFleetName,
  formatBookingDate,
  getBookingTimestamp,
  type BookingItem,
} from "src/api/admin/booking";
import { fetchFleets, type FleetItem } from "src/api/admin/fleet";
import {
  fetchPendingQuotes,
  type PendingQuoteItem,
} from "src/api/pricing";
import { fetchGetInTouches, type GetInTouchItem } from "src/api/admin/getInTouch";
import { fetchCustomerReviews, type CustomerReviewItem } from "src/api/admin/customerReview";
import { LoadingSpinner } from "src/ui/Spinner";
import { AdminBookingDetailModal } from "./AdminBookingDetailModal";

export function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [fleets, setFleets] = useState<FleetItem[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<PendingQuoteItem[]>([]);
  const [callbacks, setCallbacks] = useState<GetInTouchItem[]>([]);
  const [reviews, setReviews] = useState<CustomerReviewItem[]>([]);

  // Booking detail modal
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  async function loadDashboardData() {
    setIsRefreshing(true);
    setError(null);
    try {
      const [bookingsRes, fleetsRes, quotesRes, callbacksRes, reviewsRes] =
        await Promise.allSettled([
          fetchBookings(),
          fetchFleets(),
          fetchPendingQuotes(),
          fetchGetInTouches(),
          fetchCustomerReviews(),
        ]);

      if (bookingsRes.status === "fulfilled" && bookingsRes.value.success) {
        setBookings(bookingsRes.value.data || []);
      }
      if (fleetsRes.status === "fulfilled" && fleetsRes.value.success) {
        setFleets(fleetsRes.value.data || []);
      }
      if (quotesRes.status === "fulfilled" && quotesRes.value.success) {
        setPendingQuotes(quotesRes.value.data || []);
      }
      if (callbacksRes.status === "fulfilled" && callbacksRes.value.success) {
        setCallbacks(callbacksRes.value.data || []);
      }
      if (reviewsRes.status === "fulfilled" && reviewsRes.value.success) {
        setReviews(reviewsRes.value.data || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Stats Calculations
  const activeBookingsCount = bookings.filter(
    (b) =>
      b.booking_status === "confirmed" ||
      b.booking_status === "active" ||
      b.booking_status === "paid" ||
      b.payment_status === "PAID"
  ).length;

  const activeFleetCount = fleets.filter((f) => f.is_active).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.star_rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  // Recent 5 Bookings (newest first)
  const recentBookings = [...bookings]
    .sort((a, b) => getBookingTimestamp(b) - getBookingTimestamp(a))
    .slice(0, 5);

  const handleOpenDetailModal = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow !text-maseer-gold">ADMIN DASHBOARD</p>
          <h1 className="mt-1 font-serif text-[32px] font-semibold text-maseer-green-text">
            Control Centre
          </h1>
          <p className="mt-1 font-lato text-[14px] text-maseer-muted">
            Live overview of bookings, fleet operations, quotes, and customer activity.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboardData}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-maseer-line/60 bg-white px-4 py-2.5 font-lato text-xs font-semibold text-maseer-green-text transition hover:bg-maseer-cream hover:border-maseer-gold disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 text-maseer-gold ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-xs font-lato">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Awaiting Admin Quotes Banner */}
      {pendingQuotes.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold animate-pulse">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-amber-950">
                {pendingQuotes.length} Long-Distance Quote(s) Awaiting Admin Price!
              </h4>
              <p className="font-lato text-xs text-amber-800">
                Customers have requested custom trip quotes for distance &gt; 45km. Assign pricing now before expiry.
              </p>
            </div>
          </div>
          <Link
            to="/admin/pricing"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-lato text-xs font-bold text-white shadow hover:bg-amber-700 transition"
          >
            <span>Review Quotes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Bookings */}
        <div className="rounded-2xl border border-maseer-line/60 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-lato text-xs font-semibold text-maseer-muted uppercase tracking-wider">
              Bookings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9EB] text-maseer-gold">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-serif text-3xl font-bold text-maseer-green-text">
              {isLoading ? "—" : bookings.length}
            </p>
            <p className="mt-1 font-lato text-xs text-maseer-muted">
              <strong className="text-emerald-600 font-semibold">{activeBookingsCount} active/paid</strong> rides
            </p>
          </div>
        </div>

        {/* Fleet Vehicles */}
        <div className="rounded-2xl border border-maseer-line/60 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-lato text-xs font-semibold text-maseer-muted uppercase tracking-wider">
              Fleet Vehicles
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-serif text-3xl font-bold text-maseer-green-text">
              {isLoading ? "—" : fleets.length}
            </p>
            <p className="mt-1 font-lato text-xs text-maseer-muted">
              <strong className="text-emerald-600 font-semibold">{activeFleetCount} active</strong> on roads
            </p>
          </div>
        </div>

        {/* Pending Quotes */}
        <div className="rounded-2xl border border-maseer-line/60 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-lato text-xs font-semibold text-maseer-muted uppercase tracking-wider">
              Pending Quotes
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-serif text-3xl font-bold text-maseer-green-text">
              {isLoading ? "—" : pendingQuotes.length}
            </p>
            <p className="mt-1 font-lato text-xs text-amber-700 font-medium">
              {pendingQuotes.length > 0 ? "Action required" : "All quotes answered"}
            </p>
          </div>
        </div>

        {/* Callbacks & Reviews */}
        <div className="rounded-2xl border border-maseer-line/60 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-lato text-xs font-semibold text-maseer-muted uppercase tracking-wider">
              Inquiries &amp; Rating
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <PhoneCall className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-serif text-3xl font-bold text-maseer-green-text">
              {isLoading ? "—" : callbacks.length}
            </p>
            <p className="mt-1 flex items-center gap-1 font-lato text-xs text-maseer-muted">
              <Star className="h-3.5 w-3.5 fill-maseer-gold text-maseer-gold" />
              <span>{avgRating} Avg Rating ({reviews.length} reviews)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-maseer-green-text mb-4">
          Quick Management Modules
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/bookings"
            className="group flex items-center justify-between rounded-2xl border border-maseer-line/60 bg-white p-4 transition hover:border-maseer-gold hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF9EB] text-maseer-gold group-hover:bg-maseer-gold group-hover:text-white transition">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-lato text-sm font-bold text-maseer-green-text">
                  Bookings Manager
                </h4>
                <p className="font-lato text-xs text-maseer-muted">
                  View and manage customer rides ({bookings.length})
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-maseer-muted group-hover:text-maseer-gold transition group-hover:translate-x-1" />
          </Link>

          <Link
            to="/admin/fleet"
            className="group flex items-center justify-between rounded-2xl border border-maseer-line/60 bg-white p-4 transition hover:border-maseer-gold hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-lato text-sm font-bold text-maseer-green-text">
                  Fleet &amp; Vehicles
                </h4>
                <p className="font-lato text-xs text-maseer-muted">
                  Add, edit, or toggle vehicles ({fleets.length})
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-maseer-muted group-hover:text-maseer-gold transition group-hover:translate-x-1" />
          </Link>

          <Link
            to="/admin/pricing"
            className="group flex items-center justify-between rounded-2xl border border-maseer-line/60 bg-white p-4 transition hover:border-maseer-gold hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-lato text-sm font-bold text-maseer-green-text">
                  Pricing &amp; Rates
                </h4>
                <p className="font-lato text-xs text-maseer-muted">
                  Fixed, hourly, and custom distance rates
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-maseer-muted group-hover:text-maseer-gold transition group-hover:translate-x-1" />
          </Link>

          <Link
            to="/admin/get-in-touch"
            className="group flex items-center justify-between rounded-2xl border border-maseer-line/60 bg-white p-4 transition hover:border-maseer-gold hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-lato text-sm font-bold text-maseer-green-text">
                  Callback Requests
                </h4>
                <p className="font-lato text-xs text-maseer-muted">
                  Customer contact inquiries ({callbacks.length})
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-maseer-muted group-hover:text-maseer-gold transition group-hover:translate-x-1" />
          </Link>

          <Link
            to="/admin/services"
            className="group flex items-center justify-between rounded-2xl border border-maseer-line/60 bg-white p-4 transition hover:border-maseer-gold hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-lato text-sm font-bold text-maseer-green-text">
                  Service Coverage
                </h4>
                <p className="font-lato text-xs text-maseer-muted">
                  City and airport coverage areas
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-maseer-muted group-hover:text-maseer-gold transition group-hover:translate-x-1" />
          </Link>

          <Link
            to="/admin/reviews"
            className="group flex items-center justify-between rounded-2xl border border-maseer-line/60 bg-white p-4 transition hover:border-maseer-gold hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-lato text-sm font-bold text-maseer-green-text">
                  Customer Reviews
                </h4>
                <p className="font-lato text-xs text-maseer-muted">
                  Testimonials and ratings ({reviews.length})
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-maseer-muted group-hover:text-maseer-gold transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="rounded-2xl border border-maseer-line/60 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-lg font-semibold text-maseer-green-text">
              Recent Customer Bookings
            </h3>
            <p className="font-lato text-xs text-maseer-muted mt-0.5">
              Latest ride reservations submitted by customers
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="font-lato text-xs font-semibold text-maseer-green hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <LoadingSpinner />
            <p className="mt-2 font-lato text-xs text-maseer-muted">Loading recent bookings...</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="py-10 text-center text-maseer-muted font-lato text-xs">
            No bookings recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-lato text-xs">
              <thead>
                <tr className="border-b border-maseer-line/40 bg-maseer-cream/40 text-maseer-muted font-semibold">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Pickup Location</th>
                  <th className="py-3 px-4">Dropoff Location</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maseer-line/30 text-maseer-green-text">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-maseer-cream/20 transition">
                    <td className="py-3 px-4 font-semibold capitalize">
                      {(b.service_type || "ride").replace(/_/g, " ")}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate" title={b.pickup_location}>
                      {b.pickup_location || "—"}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate" title={b.dropoff_location}>
                      {b.dropoff_location || "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-maseer-gold">
                      {getBookingFleetName(b)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-maseer-muted">
                      {formatBookingDate(b)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetailModal(b)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-maseer-cream px-3 py-1.5 font-semibold text-maseer-green hover:bg-maseer-gold hover:text-white transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <AdminBookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
}
