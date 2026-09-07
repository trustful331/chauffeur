import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { BookingLocation } from "src/api/booking";
import { Spinner } from "./Spinner";
import { Send } from "lucide-react";
import "leaflet/dist/leaflet.css";

/**
 * Google Places (search) uses the web key.
 * Interactive map uses Leaflet/OSM so the modal always shows a working map
 * even when Maps JavaScript API / SDK key is blocked in the browser
 * ("Sorry! Something went wrong").
 * Payload stays: { address, latitude, longitude }.
 */
const GOOGLE_PLACES_WEB_KEY = "AIzaSyAzjGfhK15449gg6WqRtIGJR7j9_-LNwhs";

const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];
const DEFAULT_ZOOM = 11;
const SELECTED_ZOOM = 15;

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const emptyDraft = (): BookingLocation => ({
  address: "",
  latitude: null,
  longitude: null,
});

type PlaceSuggestion = {
  placeId: string;
  description: string;
};

type LocationMapFieldProps = {
  label: string;
  value: BookingLocation;
  onChange: (value: BookingLocation) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
};

async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_WEB_KEY,
      },
      body: JSON.stringify({
        input: query,
        includedRegionCodes: ["sa"],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Places autocomplete request failed.");
  }

  const data = (await response.json()) as {
    suggestions?: Array<{
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
      };
    }>;
  };

  return (data.suggestions ?? [])
    .map((item) => {
      const prediction = item.placePrediction;
      if (!prediction?.placeId) return null;

      const main = prediction.structuredFormat?.mainText?.text;
      const secondary = prediction.structuredFormat?.secondaryText?.text;
      const description =
        prediction.text?.text ||
        [main, secondary].filter(Boolean).join(", ") ||
        prediction.placeId;

      return {
        placeId: prediction.placeId,
        description,
      };
    })
    .filter((item): item is PlaceSuggestion => item != null)
    .slice(0, 6);
}

async function getPlaceLocation(
  placeId: string,
): Promise<BookingLocation | null> {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": GOOGLE_PLACES_WEB_KEY,
        "X-Goog-FieldMask": "formattedAddress,location,displayName",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Place details request failed.");
  }

  const data = (await response.json()) as {
    formattedAddress?: string;
    displayName?: { text?: string };
    location?: { latitude?: number; longitude?: number };
  };

  const latitude = data.location?.latitude;
  const longitude = data.location?.longitude;
  if (latitude == null || longitude == null) return null;

  return {
    address:
      data.formattedAddress ||
      data.displayName?.text ||
      `${latitude}, ${longitude}`,
    latitude,
    longitude,
  };
}

async function reverseGeocodeGoogle(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${encodeURIComponent(
        GOOGLE_PLACES_WEB_KEY,
      )}`,
    );
    if (!response.ok) return "";
    const data = (await response.json()) as {
      status?: string;
      results?: Array<{ formatted_address?: string }>;
    };
    if (data.status === "OK" && data.results?.[0]?.formatted_address) {
      return data.results[0].formatted_address;
    }
  } catch {
    // fall through
  }
  return "";
}

async function reverseGeocodeOsm(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { Accept: "application/json" } },
    );
    if (!response.ok) return "";
    const data = (await response.json()) as { display_name?: string };
    return data.display_name ?? "";
  } catch {
    return "";
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const fromGoogle = await reverseGeocodeGoogle(lat, lng);
  if (fromGoogle) return fromGoogle;
  return reverseGeocodeOsm(lat, lng);
}

function MapPinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.5 13.5L17 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
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
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onMapPickRef = useRef<(lat: number, lng: number) => void>(() => {});

  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<BookingLocation>(emptyDraft);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isResolvingPlace, setIsResolvingPlace] = useState(false);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);

  const isDropOff = label.toLowerCase().includes("drop off");
  const hasPinnedLocation =
    draft.latitude != null && draft.longitude != null;
  const canSearch = isOpen && query.trim().length >= 2;
  const canConfirm = hasPinnedLocation && draft.address.trim().length >= 2;

  const openModal = () => {
    setDraft({
      address: value.address,
      latitude: value.latitude,
      longitude: value.longitude,
    });
    setQuery(value.address);
    setSuggestions([]);
    setMapError(null);
    setMapReady(false);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSuggestions([]);
    setIsSearching(false);
    setIsResolvingPlace(false);
    setIsPinLoading(false);
  };

  const applyDraftToMarker = useCallback((next: BookingLocation) => {
    if (!mapRef.current) return;

    if (next.latitude == null || next.longitude == null) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const position: L.LatLngExpression = [next.latitude, next.longitude];
    mapRef.current.setView(position, SELECTED_ZOOM);

    if (!markerRef.current) {
      markerRef.current = L.marker(position, { draggable: true }).addTo(
        mapRef.current,
      );
      markerRef.current.on("dragend", () => {
        const latLng = markerRef.current?.getLatLng();
        if (!latLng) return;
        onMapPickRef.current(latLng.lat, latLng.lng);
      });
    } else {
      markerRef.current.setLatLng(position);
    }
  }, []);

  const handleMapPick = useCallback(
    async (lat: number, lng: number) => {
      setIsPinLoading(true);
      setMapError(null);
      setSuggestions([]);

      const optimistic: BookingLocation = {
        address:
          draft.address || query || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        latitude: lat,
        longitude: lng,
      };
      setDraft(optimistic);
      applyDraftToMarker(optimistic);

      try {
        const address = await reverseGeocode(lat, lng);
        const resolved: BookingLocation = {
          address: address || optimistic.address,
          latitude: lat,
          longitude: lng,
        };
        setDraft(resolved);
        setQuery(resolved.address);
        applyDraftToMarker(resolved);
      } catch {
        setDraft(optimistic);
        setQuery(optimistic.address);
      } finally {
        setIsPinLoading(false);
      }
    },
    [applyDraftToMarker, draft.address, query],
  );

  useEffect(() => {
    onMapPickRef.current = handleMapPick;
  }, [handleMapPick]);

  const handleSuggestionClick = useCallback(
    async (suggestion: PlaceSuggestion) => {
      setIsResolvingPlace(true);
      setMapError(null);
      try {
        const place = await getPlaceLocation(suggestion.placeId);
        if (!place || place.latitude == null || place.longitude == null) {
          setMapError("Could not resolve that place. Tap the map instead.");
          return;
        }
        setDraft(place);
        setQuery(place.address);
        setSuggestions([]);
        applyDraftToMarker(place);
      } catch {
        setMapError("Could not resolve that place. Tap the map instead.");
      } finally {
        setIsResolvingPlace(false);
      }
    },
    [applyDraftToMarker],
  );

  const confirmLocation = () => {
    if (!canConfirm || draft.latitude == null || draft.longitude == null) {
      setMapError("Please select a location from search or the map.");
      return;
    }

    onChange({
      address: draft.address.trim(),
      latitude: draft.latitude,
      longitude: draft.longitude,
    });
    closeModal();
  };

  useEffect(() => {
    if (!canSearch) return;

    const timer = window.setTimeout(() => {
      setIsSearching(true);
      setMapError(null);
      void searchPlaces(query.trim())
        .then(setSuggestions)
        .catch(() => {
          setSuggestions([]);
          setMapError("Location search is unavailable right now.");
        })
        .finally(() => setIsSearching(false));
    }, 400);

    return () => window.clearTimeout(timer);
  }, [query, canSearch]);

  // Leaflet map — always visible inside modal (no Google JS key required)
  useEffect(() => {
    if (!isOpen) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
      return;
    }

    let cancelled = false;
    let map: L.Map | null = null;

    const boot = window.setTimeout(() => {
      if (cancelled || !mapHostRef.current) return;

      const center: [number, number] =
        draft.latitude != null && draft.longitude != null
          ? [draft.latitude, draft.longitude]
          : DEFAULT_CENTER;

      map = L.map(mapHostRef.current, {
        center,
        zoom:
          draft.latitude != null && draft.longitude != null
            ? SELECTED_ZOOM
            : DEFAULT_ZOOM,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (event) => {
        onMapPickRef.current(event.latlng.lat, event.latlng.lng);
      });

      mapRef.current = map;

      if (draft.latitude != null && draft.longitude != null) {
        applyDraftToMarker(draft);
      }

      // Modal layout needs an invalidate after paint
      window.setTimeout(() => {
        if (!cancelled && map) {
          map.invalidateSize();
          map.setView(center, map.getZoom());
        }
      }, 80);
      window.setTimeout(() => {
        if (!cancelled && map) map.invalidateSize();
      }, 300);

      if (!cancelled) {
        setMapReady(true);
        setMapError(null);
      }
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(boot);
      if (map) {
        map.remove();
      }
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div>
      <label className="mb-2 block font-lato text-[13px] font-semibold text-maseer-green">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>

      <button
        type="button"
        onClick={openModal}
        className={[
          "flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3.5 text-left transition hover:border-primary/50 focus:border-primary/60 focus:outline-none",
          error ? "border-red-400" : "border-[#e5e7eb]",
        ].join(" ")}
      >
        <span className="text-primary">
          {isDropOff ? (
            <Send className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <MapPinIcon className="h-[18px] w-[18px]" />
          )}
        </span>
        <span
          className={[
            "min-w-0 flex-1 truncate font-lato text-[13px]",
            value.address ? "text-[#333]" : "text-[#b0b0b0]",
          ].join(" ")}
        >
          {value.address || placeholder}
        </span>
        <span className="shrink-0 rounded-full bg-[#FFF9EB] px-2.5 py-1 font-lato text-[10px] font-semibold uppercase tracking-wide text-maseer-green">
          Map
        </span>
      </button>

      {value.latitude != null && value.longitude != null ? (
        <p className="mt-1.5 font-lato text-[11px] text-maseer-muted">
          {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
        </p>
      ) : null}

      {error ? (
        <p className="mt-1 font-lato text-[11px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {/* Above BookingModal (z-[999]) so picker works from booking flow too */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-[1100]">
        <div
          className="fixed inset-0 bg-[#062111]/55 backdrop-blur-[2px]"
          aria-hidden
        />

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <div className="border-b border-[#eee] bg-gradient-to-r from-maseer-green to-[#0a4d18] px-5 py-5 sm:px-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="font-serif text-2xl font-semibold text-white">
                      {label}
                    </DialogTitle>
                    <Description className="mt-1 font-lato text-sm text-white/75">
                      Search an address or tap the map to drop a pin.
                    </Description>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full bg-white/10 px-3 py-1.5 font-lato text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-7">
                <div className="relative z-30">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-maseer-muted">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => {
                      const next = event.target.value;
                      setQuery(next);
                      setDraft((prev) => ({
                        ...prev,
                        address: next,
                        latitude: null,
                        longitude: null,
                      }));
                      markerRef.current?.remove();
                      markerRef.current = null;
                    }}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] py-3.5 pl-11 pr-4 font-lato text-[14px] text-[#333] outline-none placeholder:text-[#b0b0b0] focus:border-primary/60 focus:bg-white"
                  />

                  {(isSearching || isResolvingPlace || isPinLoading) && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Spinner size="sm" />
                    </div>
                  )}

                  {suggestions.length > 0 ? (
                    <ul className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-52 overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                      {suggestions.map((item) => (
                        <li key={item.placeId}>
                          <button
                            type="button"
                            className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#FFF9EB]"
                            onClick={() => void handleSuggestionClick(item)}
                          >
                            <span className="mt-0.5 text-primary">
                              <MapPinIcon className="h-4 w-4" />
                            </span>
                            <span className="font-lato text-[13px] leading-5 text-[#333]">
                              {item.description}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#f3f4f6]">
                  <div className="relative z-0 h-[340px] w-full sm:h-[400px]">
                    <div ref={mapHostRef} className="h-full w-full" />
                    {!mapReady ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <div className="flex items-center gap-2 font-lato text-sm text-maseer-muted">
                          <Spinner size="sm" />
                          Loading map...
                        </div>
                      </div>
                    ) : null}
                    {isPinLoading ? (
                      <div className="absolute bottom-4 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-white px-4 py-2 font-lato text-xs font-semibold text-maseer-green shadow-lg">
                        Finding address for this pin...
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#eee] bg-[#FAFAF8] px-4 py-3">
                  <p className="font-lato text-[11px] font-semibold uppercase tracking-wide text-maseer-muted">
                    Selected location
                  </p>
                  <p className="mt-1 font-lato text-[13px] leading-5 text-[#333]">
                    {draft.address.trim() || "No location selected yet"}
                  </p>
                  {hasPinnedLocation ? (
                    <p className="mt-1 font-lato text-[11px] text-maseer-muted">
                      {draft.latitude?.toFixed(5)}, {draft.longitude?.toFixed(5)}
                    </p>
                  ) : (
                    <p className="mt-1 font-lato text-[11px] text-maseer-muted">
                      Choose a suggestion or tap anywhere on the map.
                    </p>
                  )}
                </div>

                {mapError ? (
                  <p className="font-lato text-[12px] text-red-600" role="alert">
                    {mapError}
                  </p>
                ) : null}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-[#e5e7eb] px-6 py-3 font-lato text-sm font-semibold text-maseer-muted transition hover:border-maseer-green/30 hover:text-maseer-green"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmLocation}
                    disabled={!canConfirm || isPinLoading || isResolvingPlace}
                    className="rounded-full bg-maseer-green px-6 py-3 font-lato text-sm font-semibold text-white transition hover:bg-[#0a4d18] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Confirm Location
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
