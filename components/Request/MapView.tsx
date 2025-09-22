"use client";
import * as React from "react";
import { loadGoogleMaps } from "@/lib/maps";

declare global {
  interface Window {
    google: any;
  }
}

export function MapView({
  lat,
  lng,
  onChange,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string | undefined,
}: {
  lat?: number;
  lng?: number;
  onChange?: (pos: { lat: number; lng: number }) => void;
  apiKey?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);

  React.useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const key = apiKey || "";
        await loadGoogleMaps(key);
        if (!mounted || !containerRef.current) return;

        const center = {
          lat: typeof lat === "number" ? lat : 42.6977, // Sofia default
          lng: typeof lng === "number" ? lng : 23.3219,
        };

        const map = new window.google.maps.Map(containerRef.current, {
          center,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        mapRef.current = map;

        const placeMarker = (position: { lat: number; lng: number }) => {
          if (markerRef.current) {
            markerRef.current.setPosition(position);
          } else {
            markerRef.current = new window.google.maps.Marker({
              position,
              map,
            });
          }
        };

        if (typeof lat === "number" && typeof lng === "number") {
          placeMarker({ lat, lng });
        }

        map.addListener("click", (e: any) => {
          const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          placeMarker(pos);
          onChange?.(pos);
        });
      } catch (_) {
        /* ignore */
      }
    };
    init();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker if parent-controlled lat/lng change
  React.useEffect(() => {
    if (mapRef.current && typeof lat === "number" && typeof lng === "number") {
      const pos = { lat, lng };
      if (markerRef.current) {
        markerRef.current.setPosition(pos);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: pos,
          map: mapRef.current,
        });
      }
      mapRef.current.setCenter(pos);
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[240px] rounded-lg border border-solid border-[#dadade] bg-gray-20 mt-[16px]"
      role="region"
      aria-label="Google Map"
    />
  );
}
