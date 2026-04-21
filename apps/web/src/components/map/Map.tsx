'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-96.7970, 32.7767], // Dallas, TX (change to your city)
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '500px' }} 
    />
  );
}