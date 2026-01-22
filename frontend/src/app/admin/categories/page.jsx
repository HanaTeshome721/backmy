"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    try {
      const data = await apiFetch("/categories?includeInactive=true");
      setCategories(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async () => {
    setMessage("");
    try {
      await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify({ name })
      });
      setName("");
      await loadCategories();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deactivateCategory = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/categories/${id}`, { method: "DELETE" });
      await loadCategories();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Categories</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <div className="card space-y-3">
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="New category"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="btn-primary" onClick={createCategory}>
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category._id} className="card flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{category.name}</p>
              <p className="text-xs text-slate-400">
                {category.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            {category.isActive ? (
              <button className="btn-outline" onClick={() => deactivateCategory(category._id)}>
                Deactivate
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
