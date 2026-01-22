"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: ""
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
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });
      saveAuth(response?.data || {});
      setMessage("Registration successful. Check your email to verify.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Register</h1>
      <form className="card space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label" htmlFor="fullName">
            Full name
          </label>
          <input
            className="input"
            type="text"
            name="fullName"
            id="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="username">
            Username
          </label>
          <input
            className="input"
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
    </div>
  );
}
