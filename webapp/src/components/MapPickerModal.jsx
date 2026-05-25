import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, MapPin, X, Check, Loader2 } from 'lucide-react';
import { hapticFeedback, showAlert } from '../telegram/telegram';

const DEFAULT_CENTER = [41.2389, 69.2069]; // Sergeli / Tashkent fallback

function createMarkerIcon() {
  return L.divIcon({
    className: 'damirchi-map-marker',
    html: '<div class="damirchi-map-pin">📍</div>',
    iconSize: [42, 42],
    iconAnchor: [21, 38],
  });
}

export default function MapPickerModal({
  isOpen,
  onClose,
  onSelect,
  initialLatitude,
  initialLongitude,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstanceRef.current) return;

    const hasInitial = initialLatitude && initialLongitude;
    const center = hasInitial
      ? [Number(initialLatitude), Number(initialLongitude)]
      : DEFAULT_CENTER;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, hasInitial ? 16 : 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const icon = createMarkerIcon();

    function setPoint(latlng, shouldPan = true) {
      const point = {
        latitude: Number(latlng.lat).toFixed(7),
        longitude: Number(latlng.lng).toFixed(7),
      };

      setSelectedPoint(point);

      if (!markerRef.current) {
        markerRef.current = L.marker(latlng, {
          icon,
          draggable: true,
        }).addTo(map);

        markerRef.current.on('dragend', () => {
          const dragged = markerRef.current.getLatLng();
          setPoint(dragged, false);
        });
      } else {
        markerRef.current.setLatLng(latlng);
      }

      if (shouldPan) map.panTo(latlng);
    }

    if (hasInitial) {
      setPoint({ lat: Number(initialLatitude), lng: Number(initialLongitude) }, false);
    }

    map.on('click', (event) => {
      hapticFeedback('medium');
      setPoint(event.latlng);
    });

    setTimeout(() => map.invalidateSize(), 250);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      setSelectedPoint(null);
    };
  }, [isOpen, initialLatitude, initialLongitude]);

  useEffect(() => {
    if (isOpen && mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      showAlert('Bu qurilmada geolokatsiya ishlamayapti. Xaritadan joyni belgilang.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const map = mapInstanceRef.current;
        if (map) {
          map.setView(latlng, 17);
          if (!markerRef.current) {
            const icon = createMarkerIcon();
            markerRef.current = L.marker(latlng, { icon, draggable: true }).addTo(map);
            markerRef.current.on('dragend', () => {
              const dragged = markerRef.current.getLatLng();
              setSelectedPoint({
                latitude: Number(dragged.lat).toFixed(7),
                longitude: Number(dragged.lng).toFixed(7),
              });
            });
          } else {
            markerRef.current.setLatLng(latlng);
          }
        }

        setSelectedPoint({
          latitude: Number(latlng.lat).toFixed(7),
          longitude: Number(latlng.lng).toFixed(7),
        });
        hapticFeedback('success');
      },
      () => {
        setLocating(false);
        hapticFeedback('error');
        showAlert('Lokatsiyani aniqlab bo‘lmadi. Xaritadan qo‘lda belgilang.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const confirmPoint = () => {
    if (!selectedPoint) {
      showAlert('Avval xaritadan manzilni belgilang.');
      return;
    }

    hapticFeedback('success');
    onSelect(selectedPoint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-[480px] h-[92vh] bg-[#120E0B] rounded-t-[2rem] overflow-hidden border border-[#D99A2B]/20 shadow-2xl flex flex-col animate-map-sheet">
        <div className="px-5 py-4 border-b border-[#D99A2B]/15 bg-[#1C1511] flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#F5EFE6] leading-tight">Manzilni xaritadan tanlang</h3>
            <p className="text-sm text-[#A8988C] mt-1">Pin qo‘ying yoki xaritadan kerakli joyni bosing.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-[#120E0B] border border-[#D99A2B]/20 flex items-center justify-center active:scale-95"
            aria-label="Yopish"
          >
            <X className="w-5 h-5 text-[#F5EFE6]" />
          </button>
        </div>

        <div className="relative flex-1 min-h-0">
          <div ref={mapRef} className="absolute inset-0" />

          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="absolute top-4 left-4 z-[1000] rounded-2xl bg-[#1C1511] border border-[#D99A2B]/25 text-[#F5EFE6] px-4 py-3 text-sm font-black flex items-center gap-2 shadow-xl active:scale-95 disabled:opacity-60"
          >
            {locating ? <Loader2 className="w-4 h-4 animate-spin text-[#D99A2B]" /> : <Crosshair className="w-4 h-4 text-[#D99A2B]" />}
            Hozirgi joyim
          </button>

          <div className="absolute bottom-4 left-4 right-4 z-[1000] rounded-[1.5rem] bg-[#1C1511]/95 border border-[#D99A2B]/20 p-4 shadow-2xl backdrop-blur">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-[#D99A2B]/15 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#D99A2B]" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-black text-[#F5EFE6]">
                  {selectedPoint ? 'Manzil belgilandi' : 'Xaritadan joyni tanlang'}
                </p>
                <p className="text-sm text-[#A8988C] mt-1 leading-relaxed">
                  {selectedPoint
                    ? `${selectedPoint.latitude}, ${selectedPoint.longitude}`
                    : 'Xaritaga bosing yoki “Hozirgi joyim” tugmasidan foydalaning.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={confirmPoint}
              disabled={!selectedPoint}
              className="w-full rounded-2xl bg-[#D99A2B] disabled:bg-neutral-800 disabled:text-neutral-500 text-[#120E0B] py-4 text-base font-black flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Check className="w-5 h-5" />
              Shu manzilni tanlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
