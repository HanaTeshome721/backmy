"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { useLanguage } from "@/contexts/language-context";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: ""
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleFileChange = (event) => {
    setAvatar(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (avatar) {
        formData.append("avatar", avatar);
      }
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: formData
      });
      saveAuth(response?.data || {});
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">{t("auth.registerTitle")}</h1>
      <form className="card space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label" htmlFor="fullName">
            {t("auth.fullName")}
          </label>
          <input
            className="input"
            type="text"
            name="fullName"
            id="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="avatar">
            {t("auth.profileImage")}
          </label>
          <input
            className="input"
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="phoneNumber">
            {t("auth.phoneNumber")}
          </label>
          <input
            className="input"
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="address">
            {t("auth.address")}
          </label>
          <textarea
            className="input min-h-[100px]"
            name="address"
            id="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="username">
            {t("auth.username")}
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
            {t("auth.email")}
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
            {t("auth.password")}
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
          {loading ? t("auth.creatingAccount") : t("auth.registerTitle")}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        <p className="text-sm text-slate-600">
          {t("auth.alreadyRegistered")}{" "}
          <a href="/login" className="text-slate-900 underline dark:text-[#2f4f4f]">
            {t("auth.loginLink")}
          </a>
        </p>
      </form>
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
          <div className="card max-w-md space-y-3">
            <h2 className="text-lg font-semibold">{t("auth.registrationComplete")}</h2>
            <p className="text-sm text-slate-600">{t("auth.registrationBody")}</p>
            <button className="btn-primary" onClick={() => router.push("/login")}>
              {t("auth.goToLogin")}
            </button>
          </div>
        </div>
      ) : null}
      {errorMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
          <div className="card max-w-md space-y-3">
            <h2 className="text-lg font-semibold">Error</h2>
            <p className="text-sm text-slate-600">{errorMessage}</p>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={() => setErrorMessage("")}>
                Close
              </button>
              <a href="/" className="btn-primary">
                Go to Home
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
