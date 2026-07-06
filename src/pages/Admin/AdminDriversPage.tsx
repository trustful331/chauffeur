import { useState } from "react";

type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  status: "Available" | "On Trip" | "Offline";
};

const INITIAL_DRIVERS: Driver[] = [
  {
    id: "DRV-102",
    name: "Yousef Al-Anzi",
    phone: "+966 50 123 4567",
    vehicle: "Mercedes-Benz S-Class (VIP-001)",
    rating: 4.9,
    status: "Available",
  },
  {
    id: "DRV-105",
    name: "Mohammed Salem",
    phone: "+966 55 987 6543",
    vehicle: "Lexus LS 500 (VIP-004)",
    rating: 4.85,
    status: "On Trip",
  },
  {
    id: "DRV-109",
    name: "Ali Qahtani",
    phone: "+966 54 321 0987",
    vehicle: "Cadillac Escalade (SUV-002)",
    rating: 4.7,
    status: "Offline",
  },
  {
    id: "DRV-112",
    name: "Khalid Mansoor",
    phone: "+966 56 654 3210",
    vehicle: "BMW 7 Series (VIP-002)",
    rating: 4.95,
    status: "Available",
  },
];

export function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);

  const toggleStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus: Driver["status"] =
            d.status === "Available"
              ? "Offline"
              : d.status === "Offline"
                ? "Available"
                : "Available"; // Don't toggle On Trip drivers easily
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-50 text-green-700 border-green-200";
      case "On Trip":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Offline":
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="eyebrow !text-maseer-gold">FLEET LOGISTICS</p>
        <h1 className="mt-3 font-serif text-[32px] font-semibold text-maseer-green-text">
          Chauffeur Registry
        </h1>
        <p className="mt-1 font-lato text-[14px] text-maseer-muted">
          Manage drivers, monitor active status, and track system ratings.
        </p>
      </div>

      {/* Driver List Container */}
      <div className="rounded-2xl border border-maseer-line bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-maseer-line bg-white flex items-center justify-between">
          <p className="font-serif text-[18px] font-bold text-maseer-green-text">
            Active Chauffeurs
          </p>
          <span className="rounded-full bg-maseer-green/5 border border-maseer-green/20 px-3 py-1 font-lato text-[11px] font-bold text-maseer-green-text">
            {drivers.length} Drivers Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-lato text-sm">
            <thead>
              <tr className="bg-maseer-cream border-b border-maseer-line text-[12px] font-bold uppercase tracking-[0.05em] text-maseer-green-text">
                <th className="px-6 py-4">Driver ID</th>
                <th className="px-6 py-4">Chauffeur</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Vehicle Assignment</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Duty Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maseer-line text-[#374151]">
              {drivers.map((drv) => (
                <tr key={drv.id} className="hover:bg-maseer-cream/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-maseer-green-text">
                    {drv.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1a2e1f]">{drv.name}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-[13px]">
                    {drv.phone}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#1a2e1f]">
                    {drv.vehicle}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-maseer-gold">★</span>
                      <span className="font-bold text-[#1a2e1f]">{drv.rating.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusColor(drv.status)}`}>
                      {drv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {drv.status !== "On Trip" ? (
                      <button
                        onClick={() => toggleStatus(drv.id)}
                        className="rounded-lg px-2.5 py-1.5 font-lato text-xs font-bold border border-maseer-gold text-maseer-gold hover:bg-maseer-gold hover:text-white transition"
                      >
                        Toggle Duty
                      </button>
                    ) : (
                      <span className="text-xs text-maseer-muted italic">On Active Ride</span>
                    )}
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
