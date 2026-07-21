'use client';

import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';

interface ProfileLocationMapProps {
  latitude: number | null;
  longitude: number | null;
  businessName: string;
}

export default function ProfileLocationMap({ latitude, longitude, businessName }: ProfileLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If no coordinates are provided, do not attempt to render the map
    if (!latitude || !longitude || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [longitude, latitude],
      zoom: 13,
      interactive: true, // Allow user to pan and zoom
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      setIsLoaded(true);

      // Create a premium pulsing marker element
      const el = document.createElement('div');
      el.className = 'relative w-6 h-6 bg-primary border-2 border-white rounded-full shadow-[0_0_15px_rgba(109,40,217,0.6)] z-10 flex items-center justify-center';
      
      const pulseRing = document.createElement('div');
      pulseRing.className = 'absolute -inset-3 bg-primary/30 rounded-full animate-ping';
      el.appendChild(pulseRing);

      const dot = document.createElement('div');
      dot.className = 'w-2 h-2 bg-white rounded-full';
      el.appendChild(dot);

      // Add the marker to the map
      markerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(`<div style="font-family:system-ui,sans-serif;padding:2px 4px"><p style="font-weight:600;font-size:13px;margin:0">${businessName}</p><p style="color:#666;font-size:11px;margin:2px 0 0">Base Location</p></div>`)
        )
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      if (markerRef.current) markerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, businessName]);

  if (!latitude || !longitude) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border/50 text-muted-foreground p-6 text-center">
        <p className="font-medium">Location not provided</p>
        <p className="text-sm mt-1">This artisan has not set a specific service location.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
