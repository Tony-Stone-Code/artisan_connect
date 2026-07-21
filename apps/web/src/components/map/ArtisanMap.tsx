'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { Locate, Loader2 } from 'lucide-react';

// Center of Accra roughly
const INITIAL_CENTER: [number, number] = [-0.1869, 5.6037];
const INITIAL_ZOOM = 11;

interface ArtisanMapProps {
  artisans: any[];
}

export default function ArtisanMap({ artisans }: ArtisanMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filter artisans with coordinates
  const mapArtisans = artisans.filter(a => a.latitude && a.longitude);

  const createPopupHTML = useCallback((artisan: any) => {
    const name = `${artisan.user.first_name} ${artisan.user.last_name}`;
    const business = artisan.business_name ? `<p style="font-size:12px;color:#888;margin:2px 0 0">${artisan.business_name}</p>` : '';
    const rating = artisan.average_rating?.toFixed(1) || '0.0';
    const services = (artisan.services || [])
      .slice(0, 2)
      .map((s: any) => `<span style="display:inline-block;background:#f1f5f9;border-radius:4px;padding:1px 6px;font-size:10px;margin:2px 2px 0 0">${s.subcategory?.name || 'Service'}</span>`)
      .join('');
    const extra = (artisan.services?.length || 0) > 2
      ? `<span style="display:inline-block;background:#f1f5f9;border-radius:4px;padding:1px 6px;font-size:10px;margin:2px 2px 0 0">+${artisan.services.length - 2}</span>`
      : '';

    return `
      <div style="font-family:system-ui,sans-serif;min-width:200px">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
          <div>
            <h4 style="font-weight:700;font-size:14px;margin:0">${name}</h4>
            ${business}
          </div>
          <div style="display:flex;align-items:center;gap:3px;background:#fef3c7;color:#d97706;padding:2px 6px;border-radius:4px;font-size:12px;font-weight:600">
            ⭐ ${rating}
          </div>
        </div>
        <div style="margin-bottom:10px">${services}${extra}</div>
        <a href="/artisans/${artisan.id}" style="display:block;text-align:center;background:var(--primary, #6d28d9);color:white;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:500">
          View Profile
        </a>
      </div>
    `;
  }, []);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setIsLocating(false);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            duration: 2000,
          });

          // Add or update user marker
          if (!userMarkerRef.current) {
            const el = document.createElement('div');
            el.className = 'relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10';
            
            // Add a pulsing animation ring
            const pulseRing = document.createElement('div');
            pulseRing.className = 'absolute -inset-2 bg-blue-500/40 rounded-full animate-ping';
            el.appendChild(pulseRing);

            userMarkerRef.current = new mapboxgl.Marker({ element: el })
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current);
          } else {
            userMarkerRef.current.setLngLat([longitude, latitude]);
          }
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable it in browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("The request to get user location timed out.");
            break;
          default:
            setLocationError("An unknown error occurred getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      setIsLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add markers when map is loaded or artisans change
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    mapArtisans.forEach((artisan) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.style.cssText = `
        width: 44px; height: 44px;
        background: hsl(var(--primary, 262.1 83.3% 57.8%));
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        border: 3px solid white;
        box-shadow: -4px 4px 12px rgba(0,0,0,0.3);
        margin-top: -22px;
      `;
      el.innerHTML = `
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;
      el.setAttribute('aria-label', `Map marker for ${artisan.business_name || artisan.user.first_name}`);
      el.setAttribute('role', 'button');

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([artisan.longitude, artisan.latitude])
        .addTo(mapRef.current!);

      // Add popup on click
      el.addEventListener('click', () => {
        // Close existing popup
        if (popupRef.current) {
          popupRef.current.remove();
        }

        const popup = new mapboxgl.Popup({ 
          offset: 25, 
          closeButton: true,
          maxWidth: '280px',
        })
          .setLngLat([artisan.longitude, artisan.latitude])
          .setHTML(createPopupHTML(artisan))
          .addTo(mapRef.current!);

        popupRef.current = popup;
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, mapArtisans, createPopupHTML]);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-border shadow-sm relative">
      <div ref={mapContainer} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="animate-pulse text-muted-foreground">Loading map...</div>
        </div>
      )}

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        title="Find my location"
        className="absolute bottom-6 right-6 z-10 bg-background border border-border shadow-md rounded-full p-3 text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Locate me"
      >
        {isLocating ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <Locate className={`w-5 h-5 ${userLocation ? 'text-blue-500' : 'text-muted-foreground'}`} />
        )}
      </button>

      {/* Location Error Toast */}
      {locationError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-destructive/95 text-destructive-foreground px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-3">
          <span>{locationError}</span>
          <button 
            onClick={() => setLocationError(null)} 
            className="text-white hover:text-gray-200"
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
