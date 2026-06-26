import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { BookingLocation } from "src/api/booking";
import { Spinner } from "./Spinner";
import { Send } from "lucide-react";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];

type GeocodeResult = {
  lat: string;
  lon: string;
  display_name: string;
};

type LocationMapFieldProps = {
  label: string;
  value: BookingLocation;
  onChange: (value: BookingLocation) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
};

async function searchAddresses(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`,
    { headers: { Accept: "application/json" } },
  );

  return (await response.json()) as GeocodeResult[];
}

async function reverseGeocode(lat: number, lng: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    { headers: { Accept: "application/json" } },
  );
  const result = (await response.json()) as { display_name?: string };
  return result.display_name ?? "";
}

function MapClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function MapPinIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function LocationMapField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
}: LocationMapFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);

  const center: [number, number] =
    value.latitude != null && value.longitude != null
      ? [value.latitude, value.longitude]
      : DEFAULT_CENTER;

  const showDropdown = isOpen && value.address.trim().length > 0;
  const searchQuery = value.address.trim();
  const canSearch = showDropdown && searchQuery.length >= 2;
  const visibleSuggestions = canSearch ? suggestions : [];

  const selectLocation = useCallback(
    (address: string, latitude: number, longitude: number) => {
      onChange({ address, latitude, longitude });
      setIsOpen(false);
      setSuggestions([]);
    },
    [onChange],
  );

  const handleMapPick = useCallback(
    async (lat: number, lng: number) => {
      const address = await reverseGeocode(lat, lng);
      selectLocation(address || value.address, lat, lng);
    },
    [selectLocation, value.address],
  );

  useEffect(() => {
    if (!canSearch) return;

    const timer = window.setTimeout(() => {
      setIsSearching(true);
      void searchAddresses(searchQuery)
        .then(setSuggestions)
        .finally(() => setIsSearching(false));
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchQuery, canSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block font-lato text-[13px] font-semibold text-maseer-green">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>

      <div className="relative flex items-center">
        <input
          type="text"
          value={value.address}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setIsOpen(true);
            onChange({
              ...value,
              address: event.target.value,
              latitude: null,
              longitude: null,
            });
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={[
            "w-full rounded-xl border bg-white pl-4 pr-10 py-3.5 font-lato text-[13px] text-[#333] outline-none placeholder:text-[#b0b0b0] focus:border-primary/60",
            error ? "border-red-400" : "border-[#e5e7eb]",
          ].join(" ")}
        />
        <div className="absolute right-3.5 pointer-events-none">
          {label.toLowerCase().includes("drop off") ? (
            <Send className="h-[18px] w-[18px] shrink-0 text-primary" />
          ) : (
            <MapPinIcon />
          )}
        </div>
      </div>

      {value.latitude != null && value.longitude != null && !showDropdown ? (
        <p className="mt-1.5 font-lato text-[11px] text-maseer-muted">
          {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
        </p>
      ) : null}

      {showDropdown ? (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
          onMouseDown={(event) => event.preventDefault()}
        >
          {isSearching ? (
            <p className="flex items-center gap-2 border-b border-[#f0f0f0] px-4 py-3 font-lato text-[12px] text-maseer-muted">
              <Spinner size="sm" />
              Searching locations...
            </p>
          ) : null}

          {visibleSuggestions.length > 0 ? (
            <ul className="max-h-44 overflow-y-auto border-b border-[#f0f0f0]">
              {visibleSuggestions.map((item) => (
                <li key={`${item.lat}-${item.lon}-${item.display_name}`}>
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left font-lato text-[12px] text-[#333] transition hover:bg-[#FFF9EB]"
                    onClick={() =>
                      selectLocation(
                        item.display_name,
                        Number(item.lat),
                        Number(item.lon),
                      )
                    }
                  >
                    {item.display_name}
                  </button>
                </li>
              ))}
            </ul>
          ) : !isSearching && canSearch ? (
            <p className="border-b border-[#f0f0f0] px-4 py-3 font-lato text-[12px] text-maseer-muted">
              No matches found. Tap the map to pick a location.
            </p>
          ) : null}

          <MapContainer
            key={`${center[0]}-${center[1]}-${value.address}`}
            center={center}
            zoom={value.latitude != null ? 14 : 11}
            className="h-52 w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onPick={handleMapPick} />
            {value.latitude != null && value.longitude != null ? (
              <Marker position={[value.latitude, value.longitude]} />
            ) : null}
          </MapContainer>

          <p className="px-4 py-2 font-lato text-[11px] text-maseer-muted">
            Select a suggestion or tap on the map.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-1 font-lato text-[11px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
