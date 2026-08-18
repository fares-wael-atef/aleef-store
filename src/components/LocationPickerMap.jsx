import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function LocationPickerMap({ lat, lng, onLocationSelect }) {
  const { isArabic } = useStore();
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

      // Custom Red Pin icon
      const customIcon = window.L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div style="background:#dc2626;border:2.5px solid #ffffff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(220,38,38,0.45);transform:translate(-50%,-50%); cursor:pointer;">🐾</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = window.L.marker([lat, lng], { draggable: true, icon: customIcon }).addTo(map);

      marker.on('dragend', () => {
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
    <div className="space-y-2" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full bg-slate-100" />
        
        {/* Map Instruction Overlay */}
        <div className={`absolute top-2.5 ${isArabic ? 'right-2.5' : 'left-2.5'} z-[400] bg-slate-950/90 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-md`}>
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span>{isArabic ? 'اضغط على الخريطة لتثبيت موقع منزلك' : 'Click on map to pin your exact address'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <span className="truncate font-mono text-[11px]">
          📍 {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
        <a
          href={`https://maps.google.com/?q=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 text-[11px] shrink-0 underline"
        >
          <Navigation className="w-3 h-3" />
          <span>{isArabic ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}</span>
        </a>
      </div>
    </div>
  );
}
