"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      const data = await apiFetch("/admin/users");
      setUsers(data?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (id, action, body = {}) => {
    setMessage("");
    try {
      await apiFetch(`/admin/users/${id}/${action}`, {
        method: "PUT",
        body: JSON.stringify(body)
      });
      await loadUsers();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteUser = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
      await loadUsers();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user._id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="text-xs text-slate-400">{user.role}</div>
            </div>
            <div className="text-xs text-slate-500">
              Verified: {user.isVerified ? "Yes" : "No"} · Suspended:{" "}
              {user.isSuspended ? "Yes" : "No"}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-outline" onClick={() => updateUser(user._id, "verify")}>
                Verify
              </button>
              <button className="btn-outline" onClick={() => updateUser(user._id, "suspend")}>
                Suspend
              </button>
              <button className="btn-outline" onClick={() => updateUser(user._id, "role", { role: "recipient" })}>
                Make Agent
              </button>
              <button className="btn-outline" onClick={() => updateUser(user._id, "role", { role: "donor" })}>
                Make Donor
              </button>
              <button className="btn-outline" onClick={() => deleteUser(user._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
