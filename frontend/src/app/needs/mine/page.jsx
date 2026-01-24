"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import ImageCarousel from "@/components/ImageCarousel";

export default function MyRequestsPage() {
  const [needs, setNeeds] = useState([]);
  const [itemRequests, setItemRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const requestsSentCount = itemRequests.length;
  const approvedRequestsCount = itemRequests.filter(
    (request) => request.status?.toLowerCase() === "approved"
  ).length;
  const pendingRequestsCount = itemRequests.filter(
    (request) => request.status?.toLowerCase() === "pending"
  ).length;

  const loadNeeds = async () => {
    try {
      const data = await apiFetch("/needs/mine");
      const itemData = await apiFetch("/requests/outgoing");
      setNeeds(data?.data || []);
      setItemRequests(itemData?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadNeeds();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Requests</h1>
        <Link href="/needs/new" className="btn-primary">
          New Request
        </Link>
      </div>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {needs.map((need) => (
          <div key={need._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{need.title}</h3>
              <span className="status-text" data-status={(need.status || "").toLowerCase()}>
                {need.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{need.description}</p>
            <div className="text-xs text-slate-500">
              Category: {need.category}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Item Requests</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {itemRequests.map((request) => (
            <div key={request._id} className="card space-y-2">
              {request.item?.images?.length ? (
                <ImageCarousel
                  images={request.item.images}
                  alt={request.item?.title || "Item"}
                  onImageClick={setPreviewImage}
                />
              ) : null}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {request.item?.title}
                </h3>
                <span className="status-text" data-status={(request.status || "").toLowerCase()}>
                  {request.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Owner: {request.owner?.username}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ImagePreviewModal
        src={previewImage}
        alt="Item image"
        onClose={() => setPreviewImage("")}
      />
    </div>
  );
}
