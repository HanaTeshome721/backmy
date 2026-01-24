"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

export default function ComplaintsPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    againstUsername: "",
    relatedItem: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await apiFetch("/items");
        setItems(data?.data || []);
      } catch (error) {
        setMessage(error.message);
      }
    };
    const loadWarnings = async () => {
      try {
        const data = await apiFetch("/complaints/mine");
        const rows = data?.data || [];
        setWarnings(rows.filter((warning) => !warning.warningReadAt));
      } catch (error) {
        setMessage(error.message);
      }
    };
    loadItems();
    loadWarnings();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await apiFetch("/complaints", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setMessage("Complaint submitted.");
      setForm({ againstUsername: "", relatedItem: "", description: "" });
      const data = await apiFetch("/complaints/mine");
      setWarnings(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const markRead = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/complaints/${id}/read`, { method: "PUT" });
      setWarnings((prev) => prev.filter((warning) => warning._id !== id));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const sendReply = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/complaints/${id}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyDrafts[id] || "" })
      });
      setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
      const data = await apiFetch("/complaints/mine");
      setWarnings(data?.data || []);
      setMessage("Reply sent to admin.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t("complaints.title")}</h1>
      <p className="text-sm text-slate-600">{t("complaints.helper")}</p>
      <form className="card no-hover space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label" htmlFor="againstUsername">
            {t("complaints.username")}
          </label>
          <input
            className="input"
            name="againstUsername"
            id="againstUsername"
            value={form.againstUsername}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="relatedItem">
            {t("complaints.item")}
          </label>
          <select
            className="input"
            name="relatedItem"
            id="relatedItem"
            value={form.relatedItem}
            onChange={handleChange}
          >
            <option value="">{t("complaints.selectItem")}</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="description">
            {t("complaints.description")}
          </label>
          <textarea
            className="input min-h-[140px]"
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn-primary">{t("complaints.submit")}</button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>

      <div className="space-y-4">
        <div className="space-y-3">
          {warnings.map((warning) => (
            <div key={warning._id} className="card no-hover space-y-2">
              <p className="text-sm text-slate-500">
                Item: {warning.relatedItem?.title || "N/A"}
              </p>
              <p className="text-sm text-slate-600">{warning.description}</p>
              {warning.adminResponse ? (
                <p className="text-xs text-slate-500">
                  {t("complaints.adminResponse")}: {warning.adminResponse}
                </p>
              ) : null}
              <p className="text-xs text-slate-400">
                {warning.adminResponse ? t("complaints.answer") : t("complaints.warning")}
              </p>
              <textarea
                className="input min-h-[90px]"
                placeholder={t("complaints.replyPlaceholder")}
                value={replyDrafts[warning._id] || ""}
                onChange={(event) =>
                  setReplyDrafts((prev) => ({
                    ...prev,
                    [warning._id]: event.target.value
                  }))
                }
              />
              <div className="flex gap-2">
                <button className="btn-outline" onClick={() => markRead(warning._id)}>
                  {t("complaints.markRead")}
                </button>
                <button
                  className="btn-primary"
                  onClick={() => sendReply(warning._id)}
                  disabled={!((replyDrafts[warning._id] || "").trim())}
                >
                  {t("complaints.sendReply")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
