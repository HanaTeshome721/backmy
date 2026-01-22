"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminReportsPage() {
  const [reports, setReports] = useState({ users: null, items: null, complaints: null });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const users = await apiFetch("/reports/users");
        const items = await apiFetch("/reports/items");
        const complaints = await apiFetch("/reports/complaints");
        setReports({
          users: users?.data || null,
          items: items?.data || null,
          complaints: complaints?.data || null
        });
      } catch (error) {
        setMessage(error.message);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold">Users</h2>
          <p className="text-sm text-slate-600">
            Total: {reports.users?.totalUsers ?? "-"}
          </p>
          <p className="text-sm text-slate-600">
            Verified: {reports.users?.verifiedUsers ?? "-"}
          </p>
          <p className="text-sm text-slate-600">
            Suspended: {reports.users?.suspendedUsers ?? "-"}
          </p>
        </div>
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold">Items</h2>
          <p className="text-sm text-slate-600">
            Total: {reports.items?.totalItems ?? "-"}
          </p>
          <p className="text-sm text-slate-600">
            Status breakdown available in API response.
          </p>
        </div>
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold">Complaints</h2>
          <p className="text-sm text-slate-600">
            Total: {reports.complaints?.totalComplaints ?? "-"}
          </p>
          <p className="text-sm text-slate-600">
            Status breakdown available in API response.
          </p>
        </div>
      </div>
    </div>
  );
}
