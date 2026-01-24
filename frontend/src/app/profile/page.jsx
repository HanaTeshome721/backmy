"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiFetch("/auth/me");
        const profile = data?.data || null;
        setUser(profile);
        setForm({
          fullName: profile?.fullName || "",
          phoneNumber: profile?.phoneNumber || "",
          address: profile?.address || "",
          email: profile?.email || ""
        });
      } catch (error) {
        setMessage(error.message);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!isEditing) {
      return;
    }
    try {
      const data = await apiFetch("/auth/me", {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setUser(data?.data || user);
      setMessage("Profile updated.");
      setIsEditing(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        {message ? <p className="text-sm text-slate-600">{message}</p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card no-hover space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avater?.url || "https://placehold.co/96x96"}
              alt="Profile avatar"
              className="h-24 w-24 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <p className="text-sm text-slate-500">Username</p>
              <p className="text-lg font-semibold">{user.username}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">Email</p>
          <p>{user.email}</p>
        </div>

        <form className="card no-hover space-y-4" onSubmit={handleSave}>
          <h2 className="text-lg font-semibold">Contact Details</h2>
          <div className="space-y-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              name="email"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="fullName">
              Full name
            </label>
            <input
              className="input"
              name="fullName"
              id="fullName"
              value={form.fullName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="phoneNumber">
              Phone number
            </label>
            <input
              className="input"
              name="phoneNumber"
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="address">
              Address
            </label>
            <textarea
              className="input min-h-[100px]"
              name="address"
              id="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button className="btn-primary" type="submit">
                Save
              </button>
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setForm({
                    fullName: user?.fullName || "",
                    phoneNumber: user?.phoneNumber || "",
                    address: user?.address || "",
                    email: user?.email || ""
                  });
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn-outline"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
