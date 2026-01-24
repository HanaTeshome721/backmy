"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});

  const loadMessages = async () => {
    try {
      const data = await apiFetch("/contact/admin");
      setMessages(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const markRead = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/contact/admin/${id}/read`, { method: "PUT" });
      await loadMessages();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const sendReply = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/contact/admin/${id}/reply`, {
        method: "POST",
        body: JSON.stringify({ reply: replyDrafts[id] || "" })
      });
      setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
      await loadMessages();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Contact Messages</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {messages.map((contact) => (
          <div key={contact._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{contact.name}</p>
              <span className="text-xs text-slate-400">{contact.email}</span>
            </div>
            <p className="text-sm text-slate-600">{contact.message}</p>
            <p className="text-xs text-slate-400">
              Status: {contact.isRead ? "Read" : "Unread"}
            </p>
            {contact.replyMessage ? (
              <p className="text-xs text-slate-500">
                Replied: {new Date(contact.repliedAt).toLocaleString()}
              </p>
            ) : null}
            <p className="text-xs text-slate-400">
              {new Date(contact.createdAt).toLocaleString()}
            </p>
            <div className="space-y-2">
              <textarea
                className="input min-h-[90px]"
                placeholder="Write a reply"
                value={replyDrafts[contact._id] || ""}
                onChange={(event) =>
                  setReplyDrafts((prev) => ({
                    ...prev,
                    [contact._id]: event.target.value
                  }))
                }
              />
              <div className="flex gap-2">
                <button className="btn-outline" onClick={() => markRead(contact._id)}>
                  Mark read
                </button>
                <button
                  className="btn-primary"
                  onClick={() => sendReply(contact._id)}
                  disabled={!((replyDrafts[contact._id] || "").trim())}
                >
                  Send reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
