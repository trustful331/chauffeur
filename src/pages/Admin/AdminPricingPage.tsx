import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  DollarSign,
  Clock,
  MapPin,
  Car,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Search,
  User,
  Shield,
  X,
} from "lucide-react";
import {
  fetchPendingQuotes,
  setQuotePrice,
  fetchFixedPrices,
  createFixedPrice,
  updateFixedPrice,
  deleteFixedPrice,
  fetchHourlyPrices,
  createHourlyPrice,
  updateHourlyPrice,
  deleteHourlyPrice,
  type PendingQuoteItem,
  type FixedPriceItem,
  type HourlyPriceItem,
} from "src/api/pricing";
import { fetchFleets, type FleetItem } from "src/api/admin/fleet";
import { LoadingSpinner } from "src/ui/Spinner";

export function AdminPricingPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "fixed" | "hourly">("pending");
  const [fleets, setFleets] = useState<FleetItem[]>([]);

  // ── Pending Quotes State ──────────────────────────────────────────────────
  const [pendingQuotes, setPendingQuotes] = useState<PendingQuoteItem[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<PendingQuoteItem | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<string>("");
  const [quoteAdminNote, setQuoteAdminNote] = useState<string>("");
  const [isSubmittingPrice, setIsSubmittingPrice] = useState(false);

  // ── Fixed Pricing State ───────────────────────────────────────────────────
  const [fixedPrices, setFixedPrices] = useState<FixedPriceItem[]>([]);
  const [isLoadingFixed, setIsLoadingFixed] = useState(false);
  const [isFixedModalOpen, setIsFixedModalOpen] = useState(false);
  const [editingFixed, setEditingFixed] = useState<FixedPriceItem | null>(null);
  const [fixedFleetId, setFixedFleetId] = useState<string>("");
  const [fixedPrice, setFixedPrice] = useState<string>("");
  const [fixedIsActive, setFixedIsActive] = useState<boolean>(true);
  const [isSubmittingFixed, setIsSubmittingFixed] = useState(false);

  // ── Hourly Pricing State ──────────────────────────────────────────────────
  const [hourlyPrices, setHourlyPrices] = useState<HourlyPriceItem[]>([]);
  const [isLoadingHourly, setIsLoadingHourly] = useState(false);
  const [isHourlyModalOpen, setIsHourlyModalOpen] = useState(false);
  const [editingHourly, setEditingHourly] = useState<HourlyPriceItem | null>(null);
  const [hourlyFleetId, setHourlyFleetId] = useState<string>("");
  const [hourlyPrice, setHourlyPrice] = useState<string>("");
  const [hourlyIsActive, setHourlyIsActive] = useState<boolean>(true);
  const [isSubmittingHourly, setIsSubmittingHourly] = useState(false);

  // Load Fleets for dropdown options
  useEffect(() => {
    async function loadFleetsData() {
      try {
        const res = await fetchFleets();
        if (res.success && Array.isArray(res.data)) {
          setFleets(res.data);
        }
      } catch (err) {
        console.error("Failed to load fleets:", err);
      }
    }
    loadFleetsData();
  }, []);

  // ── Loaders ───────────────────────────────────────────────────────────────

  const loadPendingQuotes = async () => {
    setIsLoadingPending(true);
    try {
      const res = await fetchPendingQuotes();
      if (res.success && Array.isArray(res.data)) {
        setPendingQuotes(res.data);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load pending quotes");
    } finally {
      setIsLoadingPending(false);
    }
  };

  const loadFixedPrices = async () => {
    setIsLoadingFixed(true);
    try {
      const res = await fetchFixedPrices();
      if (res.success && Array.isArray(res.data)) {
        setFixedPrices(res.data);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load fixed prices");
    } finally {
      setIsLoadingFixed(false);
    }
  };

  const loadHourlyPrices = async () => {
    setIsLoadingHourly(true);
    try {
      const res = await fetchHourlyPrices();
      if (res.success && Array.isArray(res.data)) {
        setHourlyPrices(res.data);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load hourly prices");
    } finally {
      setIsLoadingHourly(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pending") {
      loadPendingQuotes();
      const interval = setInterval(loadPendingQuotes, 6000);
      return () => clearInterval(interval);
    } else if (activeTab === "fixed") {
      loadFixedPrices();
    } else if (activeTab === "hourly") {
      loadHourlyPrices();
    }
  }, [activeTab]);

  // ── Admin Set Price Handler ───────────────────────────────────────────────

  const handleSetPriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;
    const amountNum = Number(quoteAmount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid price amount in KWD");
      return;
    }

    setIsSubmittingPrice(true);
    try {
      const res = await setQuotePrice(selectedQuote.id, {
        amount: amountNum,
        fleet_id: selectedQuote.fleet_id,
        admin_note: quoteAdminNote.trim() || undefined,
      });

      if (res.success) {
        toast.success(`Price set to ${amountNum} KWD successfully!`);
        setSelectedQuote(null);
        setQuoteAmount("");
        setQuoteAdminNote("");
        loadPendingQuotes();
      } else {
        toast.error(res.message || "Failed to set price");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set price");
    } finally {
      setIsSubmittingPrice(false);
    }
  };

  // ── Fixed Price Handlers ──────────────────────────────────────────────────

  const handleOpenFixedModal = (item?: FixedPriceItem) => {
    if (item) {
      setEditingFixed(item);
      setFixedFleetId(item.fleet_id);
      setFixedPrice(String(item.price));
      setFixedIsActive(item.is_active);
    } else {
      setEditingFixed(null);
      setFixedFleetId(fleets[0]?.id || "");
      setFixedPrice("");
      setFixedIsActive(true);
    }
    setIsFixedModalOpen(true);
  };

  const handleSaveFixedPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(fixedPrice);
    if (!fixedFleetId) {
      toast.error("Please select a fleet vehicle");
      return;
    }
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid fixed price amount");
      return;
    }

    setIsSubmittingFixed(true);
    try {
      if (editingFixed) {
        await updateFixedPrice(editingFixed.id, {
          price: priceNum,
          is_active: fixedIsActive,
        });
        toast.success("Fixed price updated successfully!");
      } else {
        await createFixedPrice({
          fleet_id: fixedFleetId,
          price: priceNum,
          currency: "KWD",
          is_active: fixedIsActive,
        });
        toast.success("Fixed price created successfully!");
      }
      setIsFixedModalOpen(false);
      loadFixedPrices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save fixed price");
    } finally {
      setIsSubmittingFixed(false);
    }
  };

  const handleDeleteFixedPrice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fixed price entry?")) return;
    try {
      await deleteFixedPrice(id);
      toast.success("Fixed price deleted.");
      loadFixedPrices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete fixed price");
    }
  };

  // ── Hourly Price Handlers ─────────────────────────────────────────────────

  const handleOpenHourlyModal = (item?: HourlyPriceItem) => {
    if (item) {
      setEditingHourly(item);
      setHourlyFleetId(item.fleet_id);
      setHourlyPrice(String(item.price_per_hour));
      setHourlyIsActive(item.is_active);
    } else {
      setEditingHourly(null);
      setHourlyFleetId(fleets[0]?.id || "");
      setHourlyPrice("");
      setHourlyIsActive(true);
    }
    setIsHourlyModalOpen(true);
  };

  const handleSaveHourlyPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(hourlyPrice);
    if (!hourlyFleetId) {
      toast.error("Please select a fleet vehicle");
      return;
    }
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price per hour amount");
      return;
    }

    setIsSubmittingHourly(true);
    try {
      if (editingHourly) {
        await updateHourlyPrice(editingHourly.id, {
          price_per_hour: priceNum,
          is_active: hourlyIsActive,
        });
        toast.success("Hourly price updated successfully!");
      } else {
        await createHourlyPrice({
          fleet_id: hourlyFleetId,
          price_per_hour: priceNum,
          currency: "KWD",
          is_active: hourlyIsActive,
        });
        toast.success("Hourly price created successfully!");
      }
      setIsHourlyModalOpen(false);
      loadHourlyPrices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save hourly price");
    } finally {
      setIsSubmittingHourly(false);
    }
  };

  const handleDeleteHourlyPrice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hourly price entry?")) return;
    try {
      await deleteHourlyPrice(id);
      toast.success("Hourly price deleted.");
      loadHourlyPrices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete hourly price");
    }
  };

  // Utility to match fleet details
  const getFleetLabel = (fleetId: string) => {
    const f = fleets.find((item) => item.id === fleetId);
    if (f) return `${f.vehicle_name} (${f.category.replace(/_/g, " ").toUpperCase()})`;
    return fleetId;
  };

  return (
    <div className="space-y-6">
      {/* ── Top Bar / Header ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-maseer-green">
            Pricing &amp; Quote Management
          </h1>
          <p className="mt-1 font-lato text-xs text-[#6b7280]">
            Manage fixed distance pricing (≤ 45 km), hourly service rates, and long-distance pending quotes (&gt; 45 km).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeTab === "pending") loadPendingQuotes();
              if (activeTab === "fixed") loadFixedPrices();
              if (activeTab === "hourly") loadHourlyPrices();
            }}
            className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] px-4 py-2 font-lato text-xs font-semibold text-maseer-green hover:bg-gray-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ──────────────────────────────────────── */}
      <div className="flex border-b border-[#e5e7eb] bg-white px-6 pt-2 rounded-t-2xl shadow-sm">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 font-lato text-xs font-bold transition-colors ${
            activeTab === "pending"
              ? "border-maseer-gold text-maseer-green"
              : "border-transparent text-gray-500 hover:text-maseer-green"
          }`}
        >
          <Clock className="h-4 w-4 text-maseer-gold" />
          Pending Quotes (&gt; 45 km)
          {pendingQuotes.length > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {pendingQuotes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("fixed")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 font-lato text-xs font-bold transition-colors ${
            activeTab === "fixed"
              ? "border-maseer-gold text-maseer-green"
              : "border-transparent text-gray-500 hover:text-maseer-green"
          }`}
        >
          <MapPin className="h-4 w-4 text-maseer-green" />
          Fixed Rates (≤ 45 km)
        </button>

        <button
          onClick={() => setActiveTab("hourly")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 font-lato text-xs font-bold transition-colors ${
            activeTab === "hourly"
              ? "border-maseer-gold text-maseer-green"
              : "border-transparent text-gray-500 hover:text-maseer-green"
          }`}
        >
          <DollarSign className="h-4 w-4 text-maseer-green" />
          Hourly Rates
        </button>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────── */}
      <div className="rounded-b-2xl bg-white p-6 shadow-sm min-h-[400px]">
        {/* TAB 1: PENDING QUOTES */}
        {activeTab === "pending" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-maseer-green">
                Awaiting Admin Quotes (&gt; 45 km)
              </h2>
              <span className="font-lato text-xs text-gray-500">
                Polls automatically every 6 seconds
              </span>
            </div>

            {isLoadingPending ? (
              <div className="flex py-12 justify-center">
                <LoadingSpinner />
              </div>
            ) : pendingQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500/80 mb-3" />
                <h3 className="font-serif text-base font-semibold text-gray-700">
                  No Pending Quote Requests
                </h3>
                <p className="mt-1 font-lato text-xs text-gray-500">
                  All customer long-distance quotes have been priced or expired.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {pendingQuotes.map((quote) => {
                  const isExpired = quote.status === "expired";
                  return (
                    <div
                      key={quote.id}
                      className={`relative flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                        isExpired
                          ? "border-red-200 bg-red-50/30"
                          : "border-amber-200 bg-amber-50/20"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-maseer-gold/20 px-3 py-1 font-lato text-[11px] font-bold text-maseer-green">
                            Distance: {quote.distance_km} km
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-lato text-[10px] font-bold uppercase tracking-wider ${
                              isExpired
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {quote.status}
                          </span>
                        </div>

                        {/* Customer details */}
                        {quote.user && (
                          <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-gray-100">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maseer-green/10 text-maseer-green">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="text-xs font-lato">
                              <div className="font-bold text-gray-900">{quote.user.full_name}</div>
                              <div className="text-gray-500">{quote.user.email} • {quote.user.phone_number}</div>
                            </div>
                          </div>
                        )}

                        {/* Locations */}
                        <div className="space-y-1.5 font-lato text-xs">
                          <div className="flex items-start gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                            <span><strong>Pickup:</strong> {quote.pickup_location || "Pickup point"}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                            <span><strong>Dropoff:</strong> {quote.dropoff_location || "Dropoff point"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-[11px] pl-6">
                            <Car className="h-3.5 w-3.5 text-maseer-gold" />
                            <span>Vehicle Fleet ID: <strong>{getFleetLabel(quote.fleet_id)}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-200/60 pt-4">
                        <div className="text-[11px] font-lato text-gray-500">
                          Expires: {quote.expires_at ? new Date(quote.expires_at).toLocaleTimeString() : "15 mins"}
                        </div>

                        <button
                          disabled={isExpired}
                          onClick={() => {
                            setSelectedQuote(quote);
                            setQuoteAmount("");
                            setQuoteAdminNote("");
                          }}
                          className={`rounded-xl px-4 py-2 font-lato text-xs font-bold text-white transition ${
                            isExpired
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-maseer-green hover:bg-maseer-green-deep"
                          }`}
                        >
                          Set Custom Price
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FIXED PRICE CRUD */}
        {activeTab === "fixed" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-semibold text-maseer-green">
                  Fixed Distance Pricing Rules (≤ 45 km)
                </h2>
                <p className="font-lato text-xs text-gray-500">
                  Standard fixed rate applied to trips up to 45 km for each fleet vehicle.
                </p>
              </div>

              <button
                onClick={() => handleOpenFixedModal()}
                className="flex items-center gap-2 rounded-xl bg-maseer-green px-4 py-2 font-lato text-xs font-bold text-white hover:bg-maseer-green-deep"
              >
                <Plus className="h-4 w-4" /> Add Fixed Rate
              </button>
            </div>

            {isLoadingFixed ? (
              <div className="flex py-12 justify-center">
                <LoadingSpinner />
              </div>
            ) : fixedPrices.length === 0 ? (
              <div className="py-12 text-center font-lato text-xs text-gray-500">
                No fixed prices configured yet. Click "Add Fixed Rate" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-lato text-xs">
                  <thead className="border-b bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Fleet Vehicle</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Fixed Rate (≤ 45km)</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fixedPrices.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3.5 font-bold text-gray-800">
                          {item.fleet?.vehicle_name || getFleetLabel(item.fleet_id)}
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 capitalize">
                          {item.fleet?.category ? item.fleet.category.replace(/_/g, " ") : "—"}
                        </td>
                        <td className="px-4 py-3.5 font-serif text-sm font-black text-maseer-green">
                          {item.price} {item.currency || "KWD"}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              item.is_active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenFixedModal(item)}
                              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-maseer-green"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFixedPrice(item.id)}
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                              title="Delete"
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
          </div>
        )}

        {/* TAB 3: HOURLY PRICE CRUD */}
        {activeTab === "hourly" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-semibold text-maseer-green">
                  Hourly Pricing Rules
                </h2>
                <p className="font-lato text-xs text-gray-500">
                  Price per hour charged for hourly service bookings per vehicle.
                </p>
              </div>

              <button
                onClick={() => handleOpenHourlyModal()}
                className="flex items-center gap-2 rounded-xl bg-maseer-green px-4 py-2 font-lato text-xs font-bold text-white hover:bg-maseer-green-deep"
              >
                <Plus className="h-4 w-4" /> Add Hourly Rate
              </button>
            </div>

            {isLoadingHourly ? (
              <div className="flex py-12 justify-center">
                <LoadingSpinner />
              </div>
            ) : hourlyPrices.length === 0 ? (
              <div className="py-12 text-center font-lato text-xs text-gray-500">
                No hourly rates configured yet. Click "Add Hourly Rate" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-lato text-xs">
                  <thead className="border-b bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Fleet Vehicle</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Rate / Hour</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {hourlyPrices.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3.5 font-bold text-gray-800">
                          {item.fleet?.vehicle_name || getFleetLabel(item.fleet_id)}
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 capitalize">
                          {item.fleet?.category ? item.fleet.category.replace(/_/g, " ") : "—"}
                        </td>
                        <td className="px-4 py-3.5 font-serif text-sm font-black text-maseer-green">
                          {item.price_per_hour} {item.currency || "KWD"} / hr
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              item.is_active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenHourlyModal(item)}
                              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-maseer-green"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHourlyPrice(item.id)}
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                              title="Delete"
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
          </div>
        )}
      </div>

      {/* ── Modal 1: Set Price for Long Distance Quote ──────────────── */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-base font-bold text-maseer-green">
                Set Price for Quote #{selectedQuote.id.substring(0, 8)}
              </h3>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSetPriceSubmit} className="space-y-4 font-lato text-xs">
              <div className="rounded-xl bg-gray-50 p-3 space-y-1 text-gray-700">
                <div><strong>Distance:</strong> {selectedQuote.distance_km} km</div>
                <div><strong>Pickup:</strong> {selectedQuote.pickup_location}</div>
                <div><strong>Dropoff:</strong> {selectedQuote.dropoff_location}</div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  Custom Amount (KWD) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="e.g. 45"
                  required
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-maseer-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  Admin Note (Optional)
                </label>
                <textarea
                  value={quoteAdminNote}
                  onChange={(e) => setQuoteAdminNote(e.target.value)}
                  placeholder="Long trip custom rate calculation..."
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 p-3 focus:border-maseer-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="rounded-xl border px-4 py-2.5 font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPrice}
                  className="rounded-xl bg-maseer-green px-5 py-2.5 font-bold text-white hover:bg-maseer-green-deep disabled:opacity-50"
                >
                  {isSubmittingPrice ? "Submitting..." : "Submit Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 2: Fixed Price Modal ─────────────────────────────── */}
      {isFixedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-base font-bold text-maseer-green">
                {editingFixed ? "Edit Fixed Price" : "Add Fixed Price (≤ 45 km)"}
              </h3>
              <button onClick={() => setIsFixedModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFixedPrice} className="space-y-4 font-lato text-xs">
              <div>
                <label className="mb-1 block font-semibold text-gray-700">Fleet Vehicle *</label>
                <select
                  value={fixedFleetId}
                  onChange={(e) => setFixedFleetId(e.target.value)}
                  disabled={!!editingFixed}
                  required
                  className="w-full rounded-xl border border-gray-300 p-3 focus:border-maseer-gold focus:outline-none"
                >
                  <option value="">Select Vehicle</option>
                  {fleets.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.vehicle_name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">Fixed Rate Amount (KWD) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value)}
                  placeholder="e.g. 8"
                  required
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-maseer-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fixedActive"
                  checked={fixedIsActive}
                  onChange={(e) => setFixedIsActive(e.target.checked)}
                  className="h-4 w-4 rounded accent-maseer-green"
                />
                <label htmlFor="fixedActive" className="font-semibold text-gray-700">Is Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFixedModalOpen(false)}
                  className="rounded-xl border px-4 py-2.5 font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFixed}
                  className="rounded-xl bg-maseer-green px-5 py-2.5 font-bold text-white hover:bg-maseer-green-deep disabled:opacity-50"
                >
                  {isSubmittingFixed ? "Saving..." : "Save Fixed Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 3: Hourly Price Modal ─────────────────────────────── */}
      {isHourlyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-base font-bold text-maseer-green">
                {editingHourly ? "Edit Hourly Price" : "Add Hourly Price"}
              </h3>
              <button onClick={() => setIsHourlyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHourlyPrice} className="space-y-4 font-lato text-xs">
              <div>
                <label className="mb-1 block font-semibold text-gray-700">Fleet Vehicle *</label>
                <select
                  value={hourlyFleetId}
                  onChange={(e) => setHourlyFleetId(e.target.value)}
                  disabled={!!editingHourly}
                  required
                  className="w-full rounded-xl border border-gray-300 p-3 focus:border-maseer-gold focus:outline-none"
                >
                  <option value="">Select Vehicle</option>
                  {fleets.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.vehicle_name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">Price Per Hour (KWD) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={hourlyPrice}
                  onChange={(e) => setHourlyPrice(e.target.value)}
                  placeholder="e.g. 5"
                  required
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-maseer-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hourlyActive"
                  checked={hourlyIsActive}
                  onChange={(e) => setHourlyIsActive(e.target.checked)}
                  className="h-4 w-4 rounded accent-maseer-green"
                />
                <label htmlFor="hourlyActive" className="font-semibold text-gray-700">Is Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHourlyModalOpen(false)}
                  className="rounded-xl border px-4 py-2.5 font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHourly}
                  className="rounded-xl bg-maseer-green px-5 py-2.5 font-bold text-white hover:bg-maseer-green-deep disabled:opacity-50"
                >
                  {isSubmittingHourly ? "Saving..." : "Save Hourly Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
