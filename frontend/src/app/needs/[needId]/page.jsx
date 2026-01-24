"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function NeedDetailPage() {
  const params = useParams();
  const { needId } = params;
  const [need, setNeed] = useState(null);
  const [message, setMessage] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadNeed = async () => {
      if (!getAccessToken()) {
        setMessage("Please login to view request details.");
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch(`/needs/${needId}`);
        setNeed(data?.data || null);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (needId) loadNeed();
  }, [needId]);

  const handleOffer = async () => {
    setMessage("");
    try {
      await apiFetch(`/needs/${needId}/offers`, {
        method: "POST",
        body: JSON.stringify({ message: offerMessage })
      });
      setOfferMessage("");
      setShowSuccess(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!need) return <p>Request not found.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">{need.title}</h1>
        <p className="text-slate-600">{need.description}</p>
        <div className="text-sm text-slate-500">Category: {need.category}</div>
        <div className="status-text" data-status={(need.status || "").toLowerCase()}>
          Status: {need.status}
        </div>
      </div>
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">Offer to Donate</h2>
        <textarea
          className="input min-h-[120px]"
          placeholder="Add a message to the requester"
          value={offerMessage}
          onChange={(event) => setOfferMessage(event.target.value)}
        />
        <button className="btn-primary" onClick={handleOffer}>
          Send Offer
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
          <div className="card max-w-md space-y-3">
            <h2 className="text-lg font-semibold">Offer sent</h2>
            <p className="text-sm text-slate-600">
              Offer sent to requester.
            </p>
            <div className="flex gap-2">
              <a href="/requests" className="btn-primary">
                Go to Requests
              </a>
              <button className="btn-outline" onClick={() => setShowSuccess(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
