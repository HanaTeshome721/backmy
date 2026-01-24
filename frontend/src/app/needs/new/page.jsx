"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function NewNeedPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiFetch("/categories");
        setCategories(data?.data || []);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await apiFetch("/needs", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setShowSuccess(true);
      setForm({ title: "", description: "", category: "" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Request an Item</h1>
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
        <div className="space-y-2">
          <label className="label" htmlFor="category">
            Category
          </label>
          <select
            className="input"
            name="category"
            id="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id || category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
          <div className="card max-w-md space-y-3">
            <h2 className="text-lg font-semibold">Request an Item</h2>
            <p className="text-sm text-slate-600">
              Request submitted and pending approval.
            </p>
            <div className="flex gap-2">
              <Link href="/needs/mine" className="btn-primary">
                Go to My Requests
              </Link>
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
