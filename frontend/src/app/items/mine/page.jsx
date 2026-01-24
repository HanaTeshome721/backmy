"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import ImageCarousel from "@/components/ImageCarousel";

export default function MyItemsPage() {
  const statusTextClass = (status) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "approved" || normalized === "accepted") return "text-green-600";
    if (normalized === "rejected") return "text-red-600";
    if (normalized === "pending") return "text-blue-600";
    return "text-slate-500";
  };
  const formatStatusLabel = (status) => {
    if (!status) return "";
    return status.toLowerCase() === "exchanged" ? "donated item" : status;
  };
  const searchParams = useSearchParams();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const donatedCount = items.filter((item) => item.status?.toLowerCase() === "exchanged").length;

  const loadItems = async () => {
    try {
      const data = await apiFetch("/items/mine");
      setItems(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadItems();
    if (searchParams.get("created") === "1") {
      setMessage("Item created successfully and pending for approval.");
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Listings</h1>
        <Link href="/items/new" className="btn-primary">
          New Item
        </Link>
      </div>
      <p className="text-sm text-slate-600">Donated items: {donatedCount}</p>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="card space-y-2">
            {item.images?.length ? (
              <ImageCarousel
                images={item.images}
                alt={item.title}
                onImageClick={setPreviewImage}
              />
            ) : null}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <span className={`text-xs uppercase ${statusTextClass(item.status)}`}>
                {formatStatusLabel(item.status)}
              </span>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
            <div className="text-xs text-slate-500">
              Category: {item.category} · Condition: {item.condition}
            </div>
            {item.status?.toLowerCase() !== "exchanged" ? (
              <div className="flex gap-2">
                <Link href={`/items/${item._id}`} className="btn-outline">
                  View
                </Link>
                <Link href={`/items/${item._id}/edit`} className="btn-outline">
                  Edit
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <ImagePreviewModal
        src={previewImage}
        alt="Item image"
        onClose={() => setPreviewImage("")}
      />
    </div>
  );
}
