"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ItemDetailPage() {
  const params = useParams();
  const { itemId } = params;
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
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
      await apiFetch(`/requests/${itemId}`, {
        method: "POST",
        body: JSON.stringify({ message: requestMessage })
      });
      setMessage("Request submitted.");
      setRequestMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div className="space-y-6">
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <p className="text-slate-600">{item.description}</p>
        <div className="text-sm text-slate-500">
          Category: {item.category} · Condition: {item.condition}
        </div>
        <div className="text-sm text-slate-500">
          Owner: {item.owner?.username || "Unknown"}
        </div>
        <div className="text-xs uppercase text-slate-400">
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
        <button className="btn-primary" onClick={handleRequest}>
          Send Request
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </div>
  );
}
