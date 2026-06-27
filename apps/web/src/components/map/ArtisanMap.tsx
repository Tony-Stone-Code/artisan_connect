'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';

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
  const [isLoaded, setIsLoaded] = useState(false);

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
        width: 36px; height: 36px;
        background: var(--primary, #6d28d9);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(109,40,217,0.3);
        transition: transform 0.2s;
      `;
      el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      el.setAttribute('aria-label', `Map marker for ${artisan.business_name || artisan.user.first_name}`);
      el.setAttribute('role', 'button');
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.15)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

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
    </div>
  );
}
