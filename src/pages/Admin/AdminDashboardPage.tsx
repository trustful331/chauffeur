export function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="eyebrow !text-maseer-gold">ADMIN DASHBOARD</p>
        <h1 className="mt-3 font-serif text-[32px] font-semibold text-maseer-green-text">
          Control Centre
        </h1>
        <p className="mt-1 font-lato text-[14px] text-maseer-muted">
          Manage all Maseer operations from this panel.
        </p>
      </div>

      {/* Placeholder stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Bookings", value: "—", icon: "📋" },
          { label: "Total Drivers", value: "—", icon: "🚗" },
          { label: "Fleet Vehicles", value: "—", icon: "🚙" },
          { label: "Revenue (MTD)", value: "—", icon: "💰" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card flex items-center gap-4 !p-5"
          >
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="font-serif text-[28px] font-semibold text-maseer-green-text">
                {stat.value}
              </p>
              <p className="font-lato text-[12px] text-maseer-muted">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-maseer-line bg-white p-8 text-center shadow-sm">
        <p className="font-lato text-[15px] text-maseer-muted">
          Admin panel modules will be built here. Authentication is set up and
          working ✓
        </p>
      </div>
    </div>
  );
}
