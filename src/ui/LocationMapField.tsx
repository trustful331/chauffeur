import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import type { BookingLocation } from "src/api/booking";
import { Spinner } from "./Spinner";
import { Send } from "lucide-react";

/** Temporary: move to env after delivery hardening. */
const GOOGLE_MAPS_SDK_KEY = "AIzaSyDQYVRV6p9mpGg6gbSocIhObo_1N7mIzC8";
const GOOGLE_PLACES_WEB_KEY = "AIzaSyAzjGfhK15449gg6WqRtIGJR7j9_-LNwhs";

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };
const DEFAULT_ZOOM = 11;
const SELECTED_ZOOM = 15;

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

type GoogleLatLngLiteral = { lat: number; lng: number };

type GoogleMapInstance = {
  setCenter: (center: GoogleLatLngLiteral) => void;
  setZoom: (zoom: number) => void;
  panTo: (center: GoogleLatLngLiteral) => void;
  addListener: (
    eventName: string,
    handler: (event: {
      latLng: { lat: () => number; lng: () => number } | null;
    }) => void,
  ) => { remove: () => void };
};

type GoogleMarkerInstance = {
  setMap: (map: GoogleMapInstance | null) => void;
  setPosition: (position: GoogleLatLngLiteral) => void;
  addListener: (
    eventName: string,
    handler: () => void,
  ) => { remove: () => void };
  getPosition: () => { lat: () => number; lng: () => number } | null;
};

type GoogleMapsNamespace = {
  Map: new (
    el: HTMLElement,
    opts: {
      center: GoogleLatLngLiteral;
      zoom: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      clickableIcons?: boolean;
      gestureHandling?: string;
      zoomControl?: boolean;
    },
  ) => GoogleMapInstance;
  Marker: new (opts: {
    map: GoogleMapInstance;
    position: GoogleLatLngLiteral;
    draggable?: boolean;
    animation?: number;
  }) => GoogleMarkerInstance;
  Geocoder: new () => {
    geocode: (
      request: { location: GoogleLatLngLiteral },
      callback: (
        results: Array<{ formatted_address: string }> | null,
        status: string,
      ) => void,
    ) => void;
  };
  Animation?: { DROP: number };
  event: {
    trigger: (instance: GoogleMapInstance, eventName: string) => void;
  };
};

declare global {
  interface Window {
    google?: {
      maps: GoogleMapsNamespace;
    };
    __maseerGoogleMapsPromise?: Promise<GoogleMapsNamespace>;
    gm_authFailure?: () => void;
  }
}

function waitForSize(el: HTMLElement, attempts = 40): Promise<boolean> {
  return new Promise((resolve) => {
    const tick = () => {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        resolve(true);
        return;
      }
      attempts -= 1;
      if (attempts <= 0) {
        resolve(false);
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

function loadGoogleMapsSdk(apiKey: string): Promise<GoogleMapsNamespace> {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (window.__maseerGoogleMapsPromise) {
    return window.__maseerGoogleMapsPromise;
  }

  window.__maseerGoogleMapsPromise = new Promise((resolve, reject) => {
    const fail = (message: string) => {
      window.__maseerGoogleMapsPromise = undefined;
      document.querySelector("script[data-maseer-google-maps]")?.remove();
      reject(new Error(message));
    };

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-maseer-google-maps]",
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.google?.maps) resolve(window.google.maps);
        else fail("Google Maps failed to load.");
      });
      existing.addEventListener("error", () =>
        fail("Google Maps script failed to load."),
      );
      return;
    }

    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      previousAuthFailure?.();
      fail(
        "Google Maps key rejected. Enable Maps JavaScript API + billing, and allow this site in HTTP referrers (http://localhost:5173/*).",
      );
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.maseerGoogleMaps = "true";
    script.onload = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else fail("Google Maps failed to initialize.");
    };
    script.onerror = () => fail("Google Maps script failed to load.");
    document.head.appendChild(script);
  });

  return window.__maseerGoogleMapsPromise;
}

/** Prefer Maps SDK key; fall back to Places web key if SDK key is blocked in browser. */
async function loadMaps(forceKey?: string): Promise<GoogleMapsNamespace> {
  if (!forceKey && window.google?.maps) {
    return window.google.maps;
  }

  if (forceKey) {
    window.__maseerGoogleMapsPromise = undefined;
    document.querySelector("script[data-maseer-google-maps]")?.remove();
    // Force reload — clear cached maps namespace from a bad key if needed
    if (window.google) {
      delete (window as { google?: unknown }).google;
    }
    return loadGoogleMapsSdk(forceKey);
  }

  try {
    return await loadGoogleMapsSdk(GOOGLE_MAPS_SDK_KEY);
  } catch (sdkError) {
    window.__maseerGoogleMapsPromise = undefined;
    document.querySelector("script[data-maseer-google-maps]")?.remove();
    if (window.google) {
      delete (window as { google?: unknown }).google;
    }
    try {
      return await loadGoogleMapsSdk(GOOGLE_PLACES_WEB_KEY);
    } catch {
      throw sdkError;
    }
  }
}

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

async function reverseGeocode(
  maps: GoogleMapsNamespace,
  lat: number,
  lng: number,
): Promise<string> {
  const geocoder = new maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]?.formatted_address) {
        resolve(results[0].formatted_address);
        return;
      }
      resolve("");
    });
  });
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
  const mapRef = useRef<GoogleMapInstance | null>(null);
  const markerRef = useRef<GoogleMarkerInstance | null>(null);
  const clickListenerRef = useRef<{ remove: () => void } | null>(null);
  const dragListenerRef = useRef<{ remove: () => void } | null>(null);
  const mapsApiRef = useRef<GoogleMapsNamespace | null>(null);
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

  const applyDraftToMarker = useCallback(
    (next: BookingLocation, maps: GoogleMapsNamespace) => {
      if (!mapRef.current) return;

      if (next.latitude == null || next.longitude == null) {
        markerRef.current?.setMap(null);
        markerRef.current = null;
        return;
      }

      const position = { lat: next.latitude, lng: next.longitude };
      mapRef.current.panTo(position);
      mapRef.current.setZoom(SELECTED_ZOOM);

      if (!markerRef.current) {
        const marker = new maps.Marker({
          map: mapRef.current,
          position,
          draggable: true,
          animation: maps.Animation?.DROP,
        });
        dragListenerRef.current?.remove();
        dragListenerRef.current = marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (!pos) return;
          onMapPickRef.current(pos.lat(), pos.lng());
        });
        markerRef.current = marker;
      } else {
        markerRef.current.setPosition(position);
        markerRef.current.setMap(mapRef.current);
      }
    },
    [],
  );

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
      if (mapsApiRef.current) {
        applyDraftToMarker(optimistic, mapsApiRef.current);
      }

      try {
        const maps = mapsApiRef.current ?? (await loadMaps());
        mapsApiRef.current = maps;
        const address = await reverseGeocode(maps, lat, lng);
        const resolved: BookingLocation = {
          address: address || optimistic.address,
          latitude: lat,
          longitude: lng,
        };
        setDraft(resolved);
        setQuery(resolved.address);
        applyDraftToMarker(resolved, maps);
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
        if (mapsApiRef.current) {
          applyDraftToMarker(place, mapsApiRef.current);
        }
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

  useEffect(() => {
    if (!isOpen) {
      clickListenerRef.current?.remove();
      clickListenerRef.current = null;
      dragListenerRef.current?.remove();
      dragListenerRef.current = null;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
      mapsApiRef.current = null;
      return;
    }

    let cancelled = false;

    const destroyMap = () => {
      clickListenerRef.current?.remove();
      clickListenerRef.current = null;
      dragListenerRef.current?.remove();
      dragListenerRef.current = null;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
      if (mapHostRef.current) {
        mapHostRef.current.innerHTML = "";
      }
    };

    const initMap = async () => {
      if (!mapHostRef.current) return;

      try {
        setMapReady(false);
        setMapError(null);

        const sized = await waitForSize(mapHostRef.current);
        if (cancelled || !mapHostRef.current) return;
        if (!sized) {
          setMapError("Map container failed to size. Close and reopen.");
          return;
        }

        const maps = await loadMaps();
        if (cancelled || !mapHostRef.current) return;

        destroyMap();
        mapsApiRef.current = maps;

        const center =
          draft.latitude != null && draft.longitude != null
            ? { lat: draft.latitude, lng: draft.longitude }
            : DEFAULT_CENTER;

        const map = new maps.Map(mapHostRef.current, {
          center,
          zoom:
            draft.latitude != null && draft.longitude != null
              ? SELECTED_ZOOM
              : DEFAULT_ZOOM,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
          zoomControl: true,
        });

        mapRef.current = map;

        clickListenerRef.current = map.addListener("click", (event) => {
          const latLng = event.latLng;
          if (!latLng) return;
          onMapPickRef.current(latLng.lat(), latLng.lng());
        });

        if (draft.latitude != null && draft.longitude != null) {
          applyDraftToMarker(draft, maps);
        }

        const refresh = () => {
          if (cancelled || !mapRef.current) return;
          maps.event.trigger(mapRef.current, "resize");
          mapRef.current.setCenter(center);
        };

        window.setTimeout(refresh, 60);
        window.setTimeout(refresh, 250);

        // Detect Google's "Sorry! Something went wrong" and retry once with web key
        window.setTimeout(() => {
          if (cancelled || !mapHostRef.current) return;
          const failed = Boolean(
            mapHostRef.current.querySelector(".gm-err-container, .gm-error"),
          );
          if (!failed) {
            setMapReady(true);
            setMapError(null);
            return;
          }

          void (async () => {
            try {
              destroyMap();
              const maps = await loadMaps(GOOGLE_PLACES_WEB_KEY);
              if (cancelled || !mapHostRef.current) return;
              mapsApiRef.current = maps;

              const retryCenter =
                draft.latitude != null && draft.longitude != null
                  ? { lat: draft.latitude, lng: draft.longitude }
                  : DEFAULT_CENTER;

              const retryMap = new maps.Map(mapHostRef.current, {
                center: retryCenter,
                zoom:
                  draft.latitude != null && draft.longitude != null
                    ? SELECTED_ZOOM
                    : DEFAULT_ZOOM,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                clickableIcons: false,
                gestureHandling: "greedy",
                zoomControl: true,
              });
              mapRef.current = retryMap;
              clickListenerRef.current = retryMap.addListener("click", (event) => {
                const latLng = event.latLng;
                if (!latLng) return;
                onMapPickRef.current(latLng.lat(), latLng.lng());
              });
              if (draft.latitude != null && draft.longitude != null) {
                applyDraftToMarker(draft, maps);
              }
              window.setTimeout(() => {
                if (!cancelled && mapRef.current) {
                  maps.event.trigger(mapRef.current, "resize");
                  mapRef.current.setCenter(retryCenter);
                }
              }, 80);

              window.setTimeout(() => {
                if (cancelled || !mapHostRef.current) return;
                const stillFailed = Boolean(
                  mapHostRef.current.querySelector(
                    ".gm-err-container, .gm-error",
                  ),
                );
                if (stillFailed) {
                  setMapReady(false);
                  setMapError(
                    "Google Map tiles failed on both keys. Enable Maps JavaScript API and add this site to HTTP referrers.",
                  );
                } else {
                  setMapReady(true);
                  setMapError(null);
                }
              }, 1200);
            } catch (retryErr) {
              if (!cancelled) {
                setMapReady(false);
                setMapError(
                  retryErr instanceof Error
                    ? retryErr.message
                    : "Google Maps failed to load.",
                );
              }
            }
          })();
        }, 1200);

        if (!cancelled) {
          setMapReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setMapReady(false);
          setMapError(
            err instanceof Error
              ? err.message
              : "Google Maps failed to load. Check API key / billing.",
          );
        }
      }
    };

    const boot = window.setTimeout(() => {
      void initMap();
    }, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(boot);
      destroyMap();
      mapsApiRef.current = null;
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
                      Search an address or tap the Google Map to drop a pin.
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
                      markerRef.current?.setMap(null);
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
                  <div className="relative h-[340px] w-full sm:h-[400px]">
                    <div ref={mapHostRef} className="h-full w-full" />
                    {!mapReady && !mapError ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <div className="flex items-center gap-2 font-lato text-sm text-maseer-muted">
                          <Spinner size="sm" />
                          Loading Google Map...
                        </div>
                      </div>
                    ) : null}
                    {isPinLoading ? (
                      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 font-lato text-xs font-semibold text-maseer-green shadow-lg">
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
