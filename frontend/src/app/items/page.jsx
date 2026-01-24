"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import ImageCarousel from "@/components/ImageCarousel";

export default function ItemsPage() {
  const statusTextClass = (status) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "approved" || normalized === "accepted") return "text-green-600";
    if (normalized === "rejected") return "text-red-600";
    if (normalized === "pending") return "text-blue-600";
    return "text-slate-500";
  };
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const fetchItems = async (query = "") => {
    setLoading(true);
    setMessage("");
    try {
      const data = await apiFetch(`/items${query}`);
      const fetchedItems = data?.data || [];
      const limitedItems = isLoggedIn ? fetchedItems : fetchedItems.slice(0, 6);
      setItems(limitedItems);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedIn = !!getAccessToken();
    setIsLoggedIn(loggedIn);
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
        {isLoggedIn ? (
          <Link href="/items/new" className="btn-primary">
            Create Listing
          </Link>
        ) : (
          <Link href="/login" className="btn-outline">
            Login to create
          </Link>
        )}
      </div>
      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className="input"
          placeholder={
            isLoggedIn ? "Search items" : "Login to search and browse items"
          }
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          disabled={!isLoggedIn}
        />
        <button className="btn-outline" type="submit" disabled={!isLoggedIn}>
          Search
        </button>
      </form>
      {loading ? <p>Loading...</p> : null}
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="card space-y-2">
            {item.images?.length ? (
              <ImageCarousel
                images={item.images}
                alt={item.title}
                onImageClick={setPreviewImage}
              />
            ) : null}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <span className={`text-xs uppercase ${statusTextClass(item.status)}`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
            <div className="text-xs text-slate-500">
              Category: {item.category} · Condition: {item.condition}
            </div>
            {isLoggedIn ? (
              <Link href={`/items/${item._id}`} className="btn-outline">
                View Details
              </Link>
            ) : (
              <Link href="/login" className="btn-outline">
                View
              </Link>
            )}
          </div>
        ))}
      </div>
      {!isLoggedIn ? (
        <div className="flex justify-center">
          <Link href="/login" className="btn-primary">
            Login to browse more items
          </Link>
        </div>
      ) : null}
      <ImagePreviewModal
        src={previewImage}
        alt="Item image"
        onClose={() => setPreviewImage("")}
      />
    </div>
  );
}
