import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationPickerMap({ lat, lng, onLocationSelect, addressText }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet map if available
    if (window.L && mapContainerRef.current && !leafletMapRef.current) {
      const map = window.L.map(mapContainerRef.current).setView([lat, lng], 14);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom Yellow Paw Pin icon
      const customIcon = window.L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div style="background:#facc15;border:3px solid #1e293b;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 10px rgba(0,0,0,0.3);transform:translate(-50%,-50%); cursor:pointer;">🐾</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = window.L.marker([lat, lng], { draggable: true, icon: customIcon }).addTo(map);

      marker.on('dragend', (event) => {
        const position = marker.getLatLng();
        onLocationSelect(position.lat, position.lng);
      });

      map.on('click', (event) => {
        const { lat: newLat, lng: newLng } = event.latlng;
        marker.setLatLng([newLat, newLng]);
        onLocationSelect(newLat, newLng);
      });

      leafletMapRef.current = map;
      markerRef.current = marker;
    } else if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([lat, lng], 14);
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng, onLocationSelect]);

  return (
    <div className="space-y-2">
      <div className="relative h-56 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full bg-amber-50" />
        
        {/* Map Overlay Banner */}
        <div className="absolute top-2 left-2 z-[400] bg-slate-900/90 text-yellow-400 font-extrabold text-[11px] px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center space-x-1.5 shadow-md">
          <MapPin className="w-3.5 h-3.5" />
          <span>Click map or drag pin to your villa/building</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
        <span className="truncate">
          📍 Lat: <strong className="text-slate-900">{lat.toFixed(5)}</strong>, Lng: <strong className="text-slate-900">{lng.toFixed(5)}</strong>
        </span>
        <a
          href={`https://maps.google.com/?q=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="text-amber-700 hover:text-amber-900 font-extrabold flex items-center space-x-1 underline shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>View on Google Maps</span>
        </a>
      </div>
    </div>
  );
}
