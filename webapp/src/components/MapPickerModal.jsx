import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, Crosshair, Loader2, MapPin, X } from "lucide-react";

import { hapticFeedback, showAlert } from "../telegram/telegram";

const DEFAULT_CENTER = [41.2389, 69.2069]; // Sergeli / Tashkent fallback

function createMarkerIcon() {
  return L.divIcon({
    className: "damirchi-map-marker",
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
    if (!isOpen) return;

    document.body.classList.add("map-modal-open");

    return () => {
      document.body.classList.remove("map-modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstanceRef.current) return;

    const hasInitial = Boolean(initialLatitude && initialLongitude);
    const center = hasInitial
      ? [Number(initialLatitude), Number(initialLongitude)]
      : DEFAULT_CENTER;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      tap: true,
    }).setView(center, hasInitial ? 16 : 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

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

        markerRef.current.on("dragend", () => {
          const dragged = markerRef.current.getLatLng();
          setPoint(dragged, false);
        });
      } else {
        markerRef.current.setLatLng(latlng);
      }

      if (shouldPan) {
        map.panTo(latlng);
      }
    }

    if (hasInitial) {
      setPoint(
        {
          lat: Number(initialLatitude),
          lng: Number(initialLongitude),
        },
        false
      );
    }

    map.on("click", (event) => {
      hapticFeedback("medium");
      setPoint(event.latlng);
    });

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      setSelectedPoint(null);
      setLocating(false);
    };
  }, [isOpen, initialLatitude, initialLongitude]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      showAlert("Bu qurilmada geolokatsiya ishlamayapti. Xaritadan joyni belgilang.");
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

          const point = {
            latitude: Number(latlng.lat).toFixed(7),
            longitude: Number(latlng.lng).toFixed(7),
          };

          setSelectedPoint(point);

          if (!markerRef.current) {
            const icon = createMarkerIcon();

            markerRef.current = L.marker(latlng, {
              icon,
              draggable: true,
            }).addTo(map);

            markerRef.current.on("dragend", () => {
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

        hapticFeedback("success");
      },
      () => {
        setLocating(false);
        hapticFeedback("error");
        showAlert("Lokatsiyani aniqlab bo‘lmadi. Xaritadan qo‘lda belgilang.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const confirmPoint = () => {
    if (!selectedPoint) {
      showAlert("Avval xaritadan manzilni belgilang.");
      return;
    }

    hapticFeedback("success");
    onSelect(selectedPoint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-[#120E0B] text-[#F5EFE6]">
      <div className="h-[100dvh] w-full max-w-[480px] mx-auto bg-[#120E0B] flex flex-col overflow-hidden">
        <div className="shrink-0 px-4 pt-4 pb-3 bg-[#1C1511] border-b border-[#D99A2B]/15 safe-top">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-black text-[#F5EFE6] leading-tight">
                Manzilni tanlang
              </h3>
              <p className="text-sm text-[#A8988C] mt-1 font-semibold leading-snug">
                Xaritadan bosing yoki hozirgi joyingizni oling
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-[#120E0B] border border-[#D99A2B]/20 flex items-center justify-center active:scale-95 shrink-0"
              aria-label="Yopish"
            >
              <X className="w-5 h-5 text-[#F5EFE6]" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          <div ref={mapRef} className="absolute inset-0 z-0" />

          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="absolute top-4 left-4 z-[1000] rounded-2xl bg-[#1C1511]/95 border border-[#D99A2B]/25 text-[#F5EFE6] px-4 py-3 text-sm font-black flex items-center gap-2 shadow-xl active:scale-95 disabled:opacity-60 backdrop-blur"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#D99A2B]" />
            ) : (
              <Crosshair className="w-4 h-4 text-[#D99A2B]" />
            )}
            {locating ? "Aniqlanmoqda..." : "Hozirgi joyim"}
          </button>

          <div className="absolute left-4 right-4 bottom-4 z-[1000] rounded-[1.5rem] bg-[#1C1511]/95 border border-[#D99A2B]/20 p-4 shadow-2xl backdrop-blur animate-map-sheet safe-bottom">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-[#D99A2B]/15 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#D99A2B]" />
              </div>

              <div className="min-w-0">
                <p className="text-base font-black text-[#F5EFE6] leading-tight">
                  {selectedPoint ? "Manzil belgilandi" : "Joyni belgilang"}
                </p>

                <p className="text-sm text-[#A8988C] mt-1 leading-snug font-semibold break-words">
                  {selectedPoint
                    ? `${selectedPoint.latitude}, ${selectedPoint.longitude}`
                    : "Xaritaga bosing yoki “Hozirgi joyim” tugmasidan foydalaning."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={confirmPoint}
              disabled={!selectedPoint}
              className="w-full rounded-2xl bg-[#D99A2B] disabled:bg-neutral-800 disabled:text-neutral-500 text-[#120E0B] py-4 text-base font-black flex items-center justify-center gap-2 active:scale-[0.98] transition"
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