"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function NeedsPage() {
  const [needs, setNeeds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchNeeds = async (query = "") => {
    setLoading(true);
    setMessage("");
    try {
      const data = await apiFetch(`/needs${query}`);
      setNeeds(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
    fetchNeeds();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    fetchNeeds(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Requests</h1>
        {isLoggedIn ? (
          <Link href="/needs/new" className="btn-primary">
            Request Item
          </Link>
        ) : (
          <Link href="/login" className="btn-outline">
            Login to request
          </Link>
        )}
      </div>
      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className="input"
          placeholder={isLoggedIn ? "Search requests" : "Login to search requests"}
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
      <div className="grid gap-4 md:grid-cols-2">
        {needs.map((need) => (
          <div key={need._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{need.title}</h3>
              <span className="status-text" data-status={(need.status || "").toLowerCase()}>
                {need.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{need.description}</p>
            <div className="text-xs text-slate-500">
              Category: {need.category}
            </div>
            {isLoggedIn ? (
              <Link href={`/needs/${need._id}`} className="btn-outline">
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
    </div>
  );
}
