"use client";

import { useState } from "react";

export default function ImageCarousel({ images, alt, onImageClick }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const total = images.length;
  const current = images[index % total];

  const goPrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setIndex((prev) => (prev + 1) % total);

  return (
    <div className="relative">
      <div className="group overflow-hidden rounded-md">
        <img
          src={current.url || current}
          alt={alt}
          className="h-40 w-full cursor-zoom-in object-cover transition-transform duration-200 group-hover:scale-105"
          onClick={() => onImageClick?.(current.url || current)}
        />
      </div>
      {total > 1 ? (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm text-slate-900"
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm text-slate-900"
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      ) : null}
      {total > 1 ? (
        <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
          {index + 1}/{total}
        </div>
      ) : null}
    </div>
  );
}
