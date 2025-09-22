let mapsScriptPromise: Promise<void> | null = null;

export function loadGoogleMaps(apiKey?: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // Already loaded
  // @ts-ignore
  if (window.google && window.google.maps) return Promise.resolve();
  if (mapsScriptPromise) return mapsScriptPromise;
  mapsScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const key = apiKey || "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return mapsScriptPromise;
}
