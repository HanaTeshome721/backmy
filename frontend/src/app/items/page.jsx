"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchItems = async (query = "") => {
    setLoading(true);
    setMessage("");
    try {
      const data = await apiFetch(`/items${query}`);
      setItems(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    fetchItems(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Available Items</h1>
        <Link href="/items/new" className="btn-primary">
          Create Listing
        </Link>
      </div>
      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className="input"
          placeholder="Search items"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn-outline" type="submit">
          Search
        </button>
      </form>
      {loading ? <p>Loading...</p> : null}
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <span className="text-xs uppercase text-slate-500">
                {item.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
            <div className="text-xs text-slate-500">
              Category: {item.category} · Condition: {item.condition}
            </div>
            <Link href={`/items/${item._id}`} className="btn-outline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
