"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
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

  const markRead = async (notification) => {
    try {
      await apiFetch(`/notifications/${notification._id}/read`, { method: "PUT" });
      await loadNotifications();
      if (notification?.type === "request") {
        router.push("/requests");
      }
      window.dispatchEvent(new Event("notifications:updated"));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t("notifications.title")}</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification._id} className="card space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{notification.title}</h3>
              <span className="text-xs text-slate-400">
                {notification.isRead ? t("notifications.read") : t("notifications.new")}
              </span>
            </div>
            <p className="text-sm text-slate-600">{notification.message}</p>
            {!notification.isRead ? (
              <button className="btn-outline" onClick={() => markRead(notification)}>
                {t("notifications.markRead")}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
