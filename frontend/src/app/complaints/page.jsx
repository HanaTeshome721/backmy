"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ComplaintsPage() {
  const [form, setForm] = useState({
    againstUser: "",
    relatedItem: "",
    description: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await apiFetch("/complaints", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setMessage("Complaint submitted.");
      setForm({ againstUser: "", relatedItem: "", description: "" });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Submit Complaint</h1>
      <form className="card space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label" htmlFor="againstUser">
            Against user ID (optional)
          </label>
          <input
            className="input"
            name="againstUser"
            id="againstUser"
            value={form.againstUser}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="relatedItem">
            Related item ID (optional)
          </label>
          <input
            className="input"
            name="relatedItem"
            id="relatedItem"
            value={form.relatedItem}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            className="input min-h-[140px]"
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn-primary">Submit Complaint</button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
    </div>
  );
}
