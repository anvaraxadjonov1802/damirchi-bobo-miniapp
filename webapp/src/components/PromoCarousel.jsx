import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export default function PromoCarousel({ banners = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const ChevronRight, ImageOff } from "lucide-react";

export default function PromoCarousel({ banners = [] }) {
  const [activeIndex, setActiveIndex] = total = banners.length;

  useEffect(() => {
    if (total <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [total, activeIndex]);

  useEffect(() => {
    if (activeIndex >= total && total > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

  if (!total) return null;

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % total);
  };

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? total - 1 : current - 1
    );
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const minimumSwipeDistance = 45;

    if (distance > minimumSwipeDistance) {
      goNext();
    }

    if (distance < -minimumSwipeDistance) {
      goPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleImageError = (index) => {
    setFailedImages((current) => ({
      ...current,
      [index]: true,
    }));
  };

  return (
    <section className="mt-4 px-4">
      <div
        className="relative h-[138px] w-full touch-pan-y overflow-hidden rounded-[22px] bg-[#6F4624] shadow-[0_16px_34px_-24px_rgba(36,24,18,0.65)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${activeIndex * (100 / total)}%)`,
          }}
        >
          {banners.map((banner, index) => {
            const hasImage = banner.image && !failedImages[index];

            return (
              <article
                key={banner.id ?? `${banner.title}-${index}`}
                className="relative h-full shrink-0 overflow-hidden"
                style={{ width: `${100 / total}%` }}
              >
                {hasImage ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    onError={() => handleImageError(index)}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D5A14A] via-[#B77C29] to-[#6F4624]">
                    <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-white/10" />

                    <ImageOff className="absolute right-8 top-1/2 h-10 w-10 -translate-y-1/2 text-white/30" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/5" />

                <div className="relative z-10 flex h-full max-w-[75%] flex-col justify-center px-4 pb-5 pt-4 text-white">
                  {banner.badge && (
                    <span className="mb-2 w-fit rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] backdrop-blur-md">
                      {banner.badge}
                    </span>
                  )}

                  <h2 className="line-clamp-2 min-h-[42px] text-[19px] font-black leading-[1.1] tracking-[-0.035em]">
                    {banner.title}
                  </h2>

                  <p className="mt-1 line-clamp-1 h-[17px] text-[11px] font-bold leading-[17px] text-white/85">
                    {banner.subtitle}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-2 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md sm:flex"
              aria-label="Oldingi banner"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md sm:flex"
              aria-label="Keyingi banner"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-4 z-20 flex items-center gap-1.5">
              {banners.map((banner, index) => (
                <button
                  key={banner.id ?? index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/45"
                  }`}
                  aria-label={`${index + 1}-banner`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}