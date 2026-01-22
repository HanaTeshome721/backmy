"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function RequestsPage() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [message, setMessage] = useState("");

  const loadRequests = async () => {
    try {
      const inData = await apiFetch("/requests/incoming");
      const outData = await apiFetch("/requests/outgoing");
      setIncoming(inData?.data || []);
      setOutgoing(outData?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDecision = async (id, action) => {
    setMessage("");
    try {
      await apiFetch(`/requests/${id}/${action}`, { method: "PUT" });
      await loadRequests();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Requests</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Incoming</h2>
        <div className="space-y-3">
          {incoming.map((req) => (
            <div key={req._id} className="card space-y-2">
              <div className="text-sm text-slate-600">
                Item: {req.item?.title}
              </div>
              <div className="text-sm">From: {req.requester?.username}</div>
              <div className="text-xs uppercase text-slate-400">
                Status: {req.status}
              </div>
              {req.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    className="btn-primary"
                    onClick={() => handleDecision(req._id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => handleDecision(req._id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Outgoing</h2>
        <div className="space-y-3">
          {outgoing.map((req) => (
            <div key={req._id} className="card space-y-1">
              <div className="text-sm text-slate-600">
                Item: {req.item?.title}
              </div>
              <div className="text-sm">Owner: {req.owner?.username}</div>
              <div className="text-xs uppercase text-slate-400">
                Status: {req.status}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
