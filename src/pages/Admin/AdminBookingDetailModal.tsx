import { X, Calendar, MapPin, Users, Map, Clipboard } from "lucide-react";
import { type BookingItem } from "src/api/admin/booking";

type AdminBookingDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingItem | null;
};

export function AdminBookingDetailModal({
  isOpen,
  onClose,
  booking,
}: AdminBookingDetailModalProps) {
  if (!isOpen || !booking) return null;

  const formattedDate = booking.date_and_time
    ? new Date(booking.date_and_time).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#062111]/70 backdrop-blur-[4px] transition-opacity"
        onClick={onClose}
      />

      {/* Content Card */}
      <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-xl transition-all duration-300 max-h-[90vh] flex flex-col font-lato">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-150">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9BB00]/10 text-[#F9BB00]">
              <Clipboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-[#062111]">
                Booking Details
              </h3>
              <p className="text-xs text-maseer-muted">
                Reference ID: {booking.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-maseer-muted hover:bg-gray-100 hover:text-black transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Details List */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* Service Badge & Class */}
          <div className="flex items-center justify-between gap-3 bg-[#F8FAF8] p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                Service Type
              </p>
              <h4 className="font-serif text-[15px] font-bold text-[#062111] mt-0.5">
                {getServiceTypeLabel(booking.service_type)}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                Vehicle Class
              </p>
              <span className="inline-block mt-1 rounded-full bg-[#0b331b] px-3 py-1 text-xs font-bold text-[#F9BB00]">
                {booking.fleet_name}
              </span>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Pick-up Location
                </p>
                <p className="text-[14px] font-semibold text-[#062111] mt-0.5">
                  {booking.pickup_location}
                </p>
                {(booking.pickup_latitude !== undefined && booking.pickup_latitude !== null) && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-maseer-muted mt-1 bg-gray-100 px-2 py-0.5 rounded">
                    <Map className="h-3 w-3" /> Lat: {booking.pickup_latitude.toFixed(5)}, Lng: {booking.pickup_longitude?.toFixed(5)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-600 mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Drop-off Location
                </p>
                <p className="text-[14px] font-semibold text-[#062111] mt-0.5">
                  {booking.dropoff_location}
                </p>
                {(booking.dropoff_latitude !== undefined && booking.dropoff_latitude !== null) && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-maseer-muted mt-1 bg-gray-100 px-2 py-0.5 rounded">
                    <Map className="h-3 w-3" /> Lat: {booking.dropoff_latitude.toFixed(5)}, Lng: {booking.dropoff_longitude?.toFixed(5)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Booking Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-maseer-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Date & Time
                </p>
                <p className="text-[13.5px] font-semibold text-[#062111] mt-0.5">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-maseer-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Passenger Count
                </p>
                <p className="text-[13.5px] font-semibold text-[#062111] mt-0.5">
                  {booking.passengers_count}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-maseer-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Children Count
                </p>
                <p className="text-[13.5px] font-semibold text-[#062111] mt-0.5">
                  {booking.children_count}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                Booking Status
              </p>
              <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                booking.booking_status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {booking.booking_status || "Pending"}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                Payment Info
              </p>
              <p className="text-[13.5px] font-semibold text-[#062111] mt-0.5">
                {booking.payment_method ? booking.payment_method.toUpperCase() : "CASH"} ({booking.payment_status || "pending"})
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                Customer Email
              </p>
              <p className="text-[13.5px] font-semibold text-[#062111] mt-0.5 break-all">
                {booking.user_email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-4 border-t border-gray-150">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#062111] px-5 py-2 font-lato text-sm font-bold text-white transition hover:bg-[#0b331b]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
