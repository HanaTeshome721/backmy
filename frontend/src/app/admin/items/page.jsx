"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    try {
      const data = await apiFetch("/items/admin?status=pending");
      setItems(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAction = async (id, action) => {
    setMessage("");
    try {
      await apiFetch(`/items/${id}/${action}`, { method: "PUT" });
      await loadItems();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pending Items</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <span className="text-xs text-slate-400">{item.status}</span>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
            <div className="text-xs text-slate-500">
              Category: {item.category} · Condition: {item.condition}
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => handleAction(item._id, "approve")}>
                Approve
              </button>
              <button className="btn-outline" onClick={() => handleAction(item._id, "reject")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
