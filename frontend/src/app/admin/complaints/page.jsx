"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState({});

  const loadComplaints = async () => {
    try {
      const data = await apiFetch("/complaints");
      setComplaints(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const resolveComplaint = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/complaints/${id}/resolve`, {
        method: "PUT",
        body: JSON.stringify({ adminResponse: responses[id] || "Resolved" })
      });
      setResponses((prev) => ({ ...prev, [id]: "" }));
      await loadComplaints();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Complaints</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                {complaint.complainant?.username || "User"}
              </p>
              <span className="text-xs text-slate-400">
                {complaint.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Against: {complaint.againstUser?.username || "N/A"}
              {complaint.relatedItem?.title ? ` · Item: ${complaint.relatedItem.title}` : ""}
            </p>
            <p className="text-sm text-slate-600">{complaint.description}</p>
            {complaint.status !== "resolved" ? (
              <div className="space-y-2">
                <textarea
                  className="input min-h-[90px]"
                  placeholder="Write a response to the user"
                  value={responses[complaint._id] || ""}
                  onChange={(event) =>
                    setResponses((prev) => ({
                      ...prev,
                      [complaint._id]: event.target.value
                    }))
                  }
                />
                <button className="btn-outline" onClick={() => resolveComplaint(complaint._id)}>
                  Resolve & Reply
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
