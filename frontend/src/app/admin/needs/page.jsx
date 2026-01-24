"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminNeedsPage() {
  const [needs, setNeeds] = useState([]);
  const [message, setMessage] = useState("");

  const loadNeeds = async () => {
    try {
      const data = await apiFetch("/needs/admin?status=pending");
      setNeeds(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadNeeds();
  }, []);

  const handleAction = async (id, action) => {
    setMessage("");
    try {
      await apiFetch(`/needs/${id}/${action}`, { method: "PUT" });
      await loadNeeds();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pending Requests</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {needs.map((need) => (
          <div key={need._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{need.title}</h3>
              <span className="status-text" data-status={(need.status || "").toLowerCase()}>
                {need.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{need.description}</p>
            <div className="text-xs text-slate-500">
              Category: {need.category}
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => handleAction(need._id, "approve")}>
                Approve
              </button>
              <button className="btn-outline" onClick={() => handleAction(need._id, "reject")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
