"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import ImageCarousel from "@/components/ImageCarousel";

export default function AdminItemRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const loadRequests = async () => {
    try {
      const data = await apiFetch("/requests/admin");
      setRequests(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, action) => {
    setMessage("");
    try {
      await apiFetch(`/requests/${id}/${action}`, { method: "PUT" });
      await loadRequests();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Item Requests</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{req.item?.title}</h3>
              <span className="status-text" data-status={(req.status || "").toLowerCase()}>
                {req.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{req.message || "No message"}</p>
            <div className="text-xs text-slate-500">
              Requester: {req.requester?.username} · Owner: {req.owner?.username}
            </div>
            {req.evidenceImages?.length ? (
              <ImageCarousel
                images={req.evidenceImages}
                alt="Evidence"
                onImageClick={setPreviewImage}
              />
            ) : null}
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => handleAction(req._id, "approve")}>
                Approve
              </button>
              <button className="btn-outline" onClick={() => handleAction(req._id, "reject")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      <ImagePreviewModal
        src={previewImage}
        alt="Evidence"
        onClose={() => setPreviewImage("")}
      />
    </div>
  );
}
