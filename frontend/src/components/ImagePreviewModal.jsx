"use client";

export default function ImagePreviewModal({ src, alt, onClose }) {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80">
      <button
        className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-900"
        onClick={onClose}
        aria-label="Close preview"
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt || "Preview"}
        className="max-h-[90vh] max-w-[90vw] rounded-md object-contain"
      />
    </div>
  );
}
