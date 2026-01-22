"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  const loadNotifications = async () => {
    try {
      const data = await apiFetch("/notifications");
      setNotifications(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      await loadNotifications();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification._id} className="card space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{notification.title}</h3>
              <span className="text-xs text-slate-400">
                {notification.isRead ? "Read" : "New"}
              </span>
            </div>
            <p className="text-sm text-slate-600">{notification.message}</p>
            {!notification.isRead ? (
              <button className="btn-outline" onClick={() => markRead(notification._id)}>
                Mark as read
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
