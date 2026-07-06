import { useState } from "react";

type Booking = {
  id: string;
  passengerName: string;
  email: string;
  pickup: string;
  dropoff: string;
  dateTime: string;
  amount: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "MS-8492",
    passengerName: "Fahad Al-Harbi",
    email: "fahad@example.sa",
    pickup: "Riyadh Airport (RUH)",
    dropoff: "Ritz-Carlton, Riyadh",
    dateTime: "2026-07-08 14:30",
    amount: "SAR 350.00",
    status: "Pending",
  },
  {
    id: "MS-7291",
    passengerName: "Sarah Smith",
    email: "sarah@example.com",
    pickup: "Four Seasons Hotel, Riyadh",
    dropoff: "Al Faisaliah Tower",
    dateTime: "2026-07-07 10:15",
    amount: "SAR 180.00",
    status: "In Progress",
  },
  {
    id: "MS-6210",
    passengerName: "Abdulrahman Al-Otaibi",
    email: "abdulrahman@example.sa",
    pickup: "King Abdullah Financial District",
    dropoff: "Hilton Riyadh Hotel",
    dateTime: "2026-07-06 18:00",
    amount: "SAR 250.00",
    status: "Completed",
  },
  {
    id: "MS-5102",
    passengerName: "Michael Chang",
    email: "michael@example.com",
    pickup: "Riyadh Airport (RUH)",
    dropoff: "KAFD Block 4",
    dateTime: "2026-07-05 21:00",
    amount: "SAR 320.00",
    status: "Cancelled",
  },
];

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const handleAction = (id: string, newStatus: "Completed" | "Cancelled" | "In Progress") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200/50";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200/50";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200/50";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200/50";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="eyebrow !text-maseer-gold">OPERATIONS MANAGEMENT</p>
        <h1 className="mt-3 font-serif text-[32px] font-semibold text-maseer-green-text">
          Chauffeur Bookings
        </h1>
        <p className="mt-1 font-lato text-[14px] text-maseer-muted">
          Oversee, approve, or reschedule passenger rides across all regions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Bookings", value: "142", icon: "📋", color: "text-maseer-green-text" },
          { label: "Pending Rides", value: "12", icon: "⏳", color: "text-yellow-600" },
          { label: "Active Trips", value: "5", icon: "🚗", color: "text-blue-600" },
          { label: "Completed MTD", value: "125", icon: "✅", color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="card !p-5 flex items-center justify-between">
            <div>
              <p className="font-lato text-[12px] text-maseer-muted font-semibold uppercase tracking-[0.05em]">
                {stat.label}
              </p>
              <p className={`mt-2 font-serif text-[28px] font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-maseer-line bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-maseer-line bg-white flex items-center justify-between">
          <p className="font-serif text-[18px] font-bold text-maseer-green-text">
            Ride Registry
          </p>
          <span className="rounded-full bg-maseer-green/5 border border-maseer-green/20 px-3 py-1 font-lato text-[11px] font-bold text-maseer-green-text">
            {bookings.length} Registered Rides
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-lato text-sm">
            <thead>
              <tr className="bg-maseer-cream border-b border-maseer-line text-[12px] font-bold uppercase tracking-[0.05em] text-maseer-green-text">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Passenger</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Fare</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maseer-line text-[#374151]">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-maseer-cream/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-maseer-green-text">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1a2e1f]">{booking.passengerName}</p>
                    <p className="text-[12px] text-maseer-muted">{booking.email}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[220px] truncate">
                    <p className="truncate"><span className="text-xs text-maseer-gold font-bold">A:</span> {booking.pickup}</p>
                    <p className="truncate mt-0.5"><span className="text-xs text-maseer-green font-bold">B:</span> {booking.dropoff}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px]">
                    {booking.dateTime}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#1a2e1f]">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {booking.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleAction(booking.id, "In Progress")}
                            className="rounded-lg px-2.5 py-1.5 font-lato text-xs font-bold bg-maseer-green text-white hover:bg-maseer-green-text transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(booking.id, "Cancelled")}
                            className="rounded-lg px-2.5 py-1.5 font-lato text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "In Progress" && (
                        <button
                          onClick={() => handleAction(booking.id, "Completed")}
                          className="rounded-lg px-2.5 py-1.5 font-lato text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          Complete
                        </button>
                      )}
                      {["Completed", "Cancelled"].includes(booking.status) && (
                        <span className="text-xs text-maseer-muted italic">No Actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
