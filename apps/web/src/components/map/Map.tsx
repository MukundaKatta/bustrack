'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MOCK_BUSES, MockBus, advanceBus } from '@/lib/mockBuses';
import { calculateEtaMinutes } from '@/lib/eta';

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN not set');
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const REFRESH_INTERVAL_MS = 10_000;

function etaLabel(bus: MockBus): string {
  const mins = calculateEtaMinutes(bus.lat, bus.lng, bus.nextStop.lat, bus.nextStop.lng);
  return `Arriving in ${mins} min`;
}

function popupHtml(bus: MockBus): string {
  return `
    <div style="font-family:sans-serif;min-width:140px">
      <strong>${bus.name}</strong><br/>
      <span style="color:#555;font-size:0.85em">Next: ${bus.nextStop.name}</span><br/>
      <span style="color:#1a6b3a;font-weight:600">${etaLabel(bus)}</span>
    </div>
  `;
}

export default function BusMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; popup: mapboxgl.Popup }>>(new Map());
  const [buses, setBuses] = useState<MockBus[]>(MOCK_BUSES);

  // Init map once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-96.7970, 32.7767],
      zoom: 12,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  // Add/update markers when buses change
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    const addMarkers = () => {
      buses.forEach((bus) => {
        const existing = markersRef.current.get(bus.id);

        if (existing) {
          existing.marker.setLngLat([bus.lng, bus.lat]);
          existing.popup.setHTML(popupHtml(bus));
        } else {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml(bus));
          const el = document.createElement('div');
          el.style.cssText = `
            width:36px;height:36px;border-radius:50%;
            background:#f59e0b;border:3px solid #fff;
            box-shadow:0 2px 6px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;cursor:pointer;
          `;
          el.textContent = '🚌';
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([bus.lng, bus.lat])
            .setPopup(popup)
            .addTo(m);
          markersRef.current.set(bus.id, { marker, popup });
        }
      });
    };

    if (m.isStyleLoaded()) {
      addMarkers();
    } else {
      m.once('load', addMarkers);
    }
  }, [buses]);

  // Advance buses every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) => prev.map(advanceBus));
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 12,
        background: 'rgba(255,255,255,0.92)', borderRadius: 8,
        padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: 13,
      }}>
        {buses.map((bus) => (
          <div key={bus.id} style={{ marginBottom: 4 }}>
            <strong>{bus.name}</strong>
            {' — '}
            <span style={{ color: '#1a6b3a' }}>{etaLabel(bus)}</span>
            <span style={{ color: '#888', marginLeft: 6, fontSize: 11 }}>
              → {bus.nextStop.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
