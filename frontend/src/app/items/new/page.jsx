"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function NewItemPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "used"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await apiFetch("/items", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setMessage("Item created and pending approval.");
      setForm({ title: "", description: "", category: "", condition: "used" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Item Listing</h1>
      <form className="card space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label" htmlFor="title">
            Title
          </label>
          <input
            className="input"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            className="input min-h-[120px]"
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="label" htmlFor="category">
              Category
            </label>
            <input
              className="input"
              name="category"
              id="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="condition">
              Condition
            </label>
            <select
              className="input"
              name="condition"
              id="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="used">Used</option>
              <option value="old">Old</option>
            </select>
          </div>
        </div>
        <button className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Create Listing"}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
    </div>
  );
}
