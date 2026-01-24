"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import ImageCarousel from "@/components/ImageCarousel";

export default function ItemDetailPage() {
  const params = useParams();
  const { itemId } = params;
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const statusTextClass = (status) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "approved" || normalized === "accepted") return "text-green-600";
    if (normalized === "rejected") return "text-red-600";
    if (normalized === "pending") return "text-blue-600";
    return "text-slate-500";
  };

  useEffect(() => {
    const loadItem = async () => {
      if (!getAccessToken()) {
        setMessage("Please login to view item details.");
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch(`/items/${itemId}`);
        setItem(data?.data || null);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (itemId) loadItem();
  }, [itemId]);

  const handleRequest = async () => {
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("message", requestMessage);
      evidenceImages.forEach((file) => {
        formData.append("evidenceImages", file);
      });
      await apiFetch(`/requests/${itemId}`, {
        method: "POST",
        body: formData
      });
      setRequestMessage("");
      setEvidenceImages([]);
      setShowSuccess(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card space-y-2">
        {item.images?.length ? (
          <ImageCarousel
            images={item.images}
            alt={item.title}
            onImageClick={setPreviewImage}
          />
        ) : null}
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <p className="text-slate-600">{item.description}</p>
        <div className="text-sm text-slate-500">
          Category: {item.category} · Condition: {item.condition}
        </div>
        <div className="text-sm text-slate-500">
          Owner: {item.owner?.username || "Unknown"}
        </div>
        <div className={`text-xs uppercase ${statusTextClass(item.status)}`}>
          Status: {item.status}
        </div>
      </div>
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">Request this item</h2>
        <textarea
          className="input min-h-[120px]"
          placeholder="Add a message to the owner"
          value={requestMessage}
          onChange={(event) => setRequestMessage(event.target.value)}
        />
        <p className="text-sm font-medium text-slate-700">
          Upload some evidences
        </p>
        <input
          className="input"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) =>
            setEvidenceImages(Array.from(event.target.files || []))
          }
        />
        <button className="btn-primary" onClick={handleRequest}>
          Send Request
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
          <div className="card max-w-md space-y-3">
            <h2 className="text-lg font-semibold">Request submitted</h2>
            <p className="text-sm text-slate-600">
              Your request is submitted successfully. We will notify you soon.
            </p>
            <div className="flex gap-2">
              <a href="/requests" className="btn-primary">
                Go to My Requests
              </a>
              <a href="/" className="btn-outline">
                Close
              </a>
            </div>
          </div>
        </div>
      ) : null}
      <ImagePreviewModal
        src={previewImage}
        alt={item?.title}
        onClose={() => setPreviewImage("")}
      />
    </div>
  );
}
