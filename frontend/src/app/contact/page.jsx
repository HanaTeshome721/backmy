"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setStatus("Message sent to admin.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus(error.message);
    }
  };
  return (
    <div className="space-y-10 text-base md:text-lg">
      <section className="card no-hover flex min-h-[60vh] flex-col items-center justify-center space-y-3 text-center">
        <h1 className="text-4xl font-semibold md:text-5xl">{t("contact.title")}</h1>
        <p className="max-w-2xl text-slate-600">{t("contact.body")}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="card no-hover space-y-3">
            <h2 className="text-xl font-semibold">{t("contact.supportTitle")}</h2>
            <p className="text-sm text-slate-600">Email: support@shareexchange.org</p>
            <p className="text-sm text-slate-600">Phone: +1 (555) 012-3456</p>
            <p className="text-sm text-slate-600">Hours: Mon - Fri, 9am - 6pm</p>
          </div>
          <div className="card no-hover space-y-3">
            <h2 className="text-xl font-semibold">{t("contact.communityTitle")}</h2>
            <p className="text-sm text-slate-600">123 Community Lane</p>
            <p className="text-sm text-slate-600">City Center, Region</p>
            <p className="text-sm text-slate-600">Postal Code 10001</p>
          </div>
        </div>
        <section className="card no-hover space-y-4">
          <h2 className="text-xl font-semibold">{t("contact.sendTitle")}</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="label" htmlFor="name">
                {t("contact.name")}
              </label>
              <input
                className="input"
                id="name"
                name="name"
                placeholder={t("contact.placeholderName")}
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="label" htmlFor="email">
                {t("contact.email")}
              </label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder={t("contact.placeholderEmail")}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="label" htmlFor="message">
                {t("contact.message")}
              </label>
              <textarea
                className="input min-h-[120px]"
                id="message"
                name="message"
                placeholder={t("contact.placeholderMessage")}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn-primary" type="submit">
              {t("contact.send")}
            </button>
            {status ? <p className="text-sm text-slate-600">{status}</p> : null}
          </form>
        </section>
      </section>
    </div>
  );
}
