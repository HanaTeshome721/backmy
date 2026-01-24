"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { useLanguage } from "@/contexts/language-context";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      saveAuth(response?.data || {});
      setMessage("Logged in successfully.");
      router.push("/items");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">{t("auth.loginTitle")}</h1>
      <form className="card space-y-4" onSubmit={handleSubmit}>
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
          {loading ? t("auth.signingIn") : t("auth.login")}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        <p className="text-sm text-slate-600">
          {t("auth.noAccount")}{" "}
          <a href="/register" className="text-slate-900 underline dark:text-[#2f4f4f]">
            {t("auth.registerLink")}
          </a>
        </p>
      </form>
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
