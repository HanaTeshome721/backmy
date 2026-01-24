"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminReportsPage() {
  const [reports, setReports] = useState({ users: null, items: null, complaints: null });
  const [allComplaints, setAllComplaints] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const users = await apiFetch("/reports/users");
        const items = await apiFetch("/reports/items");
        const complaints = await apiFetch("/reports/complaints");
        const complaintsList = await apiFetch("/complaints");
        setReports({
          users: users?.data || null,
          items: items?.data || null,
          complaints: complaints?.data || null
        });
        setAllComplaints(complaintsList?.data || []);
      } catch (error) {
        setMessage(error.message);
      }
    };
    loadReports();
  }, []);

  const normalizeBuckets = (list = []) =>
    list.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

  const itemStatus = normalizeBuckets(reports.items?.byStatus);
  const complaintStatus = normalizeBuckets(reports.complaints?.byStatus);
  const userRoles = normalizeBuckets(reports.users?.byRole);

  const topReportedUsers = useMemo(() => {
    const counts = allComplaints.reduce((acc, complaint) => {
      const key = complaint.againstUser?.username || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([username, count]) => ({ username, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allComplaints]);

  const statBar = (value, total, className) => {
    const width = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div className="h-2 w-full rounded-full bg-muted">
        <div className={`h-2 rounded-full ${className}`} style={{ width: `${width}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold">Users</h2>
          <p className="text-sm text-slate-600">Total: {reports.users?.totalUsers ?? "-"}</p>
          <p className="text-sm text-slate-600">Verified: {reports.users?.verifiedUsers ?? "-"}</p>
          <p className="text-sm text-slate-600">Suspended: {reports.users?.suspendedUsers ?? "-"}</p>
        </div>
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold">Items</h2>
          <p className="text-sm text-slate-600">Total: {reports.items?.totalItems ?? "-"}</p>
          <p className="text-sm text-slate-600">Approved: {itemStatus.approved || 0}</p>
          <p className="text-sm text-slate-600">Rejected: {itemStatus.rejected || 0}</p>
          <p className="text-sm text-slate-600">Pending: {itemStatus.pending || 0}</p>
        </div>
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold">Complaints</h2>
          <p className="text-sm text-slate-600">
            Total: {reports.complaints?.totalComplaints ?? "-"}
          </p>
          <p className="text-sm text-slate-600">Open: {complaintStatus.open || 0}</p>
          <p className="text-sm text-slate-600">Resolved: {complaintStatus.resolved || 0}</p>
          <p className="text-sm text-slate-600">Pending: {complaintStatus.pending || 0}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Items Status</h2>
            <span className="text-xs text-slate-500">Total: {reports.items?.totalItems ?? 0}</span>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Approved</span>
                <span>{itemStatus.approved || 0}</span>
              </div>
              {statBar(itemStatus.approved || 0, reports.items?.totalItems || 0, "bg-green-500")}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Rejected</span>
                <span>{itemStatus.rejected || 0}</span>
              </div>
              {statBar(itemStatus.rejected || 0, reports.items?.totalItems || 0, "bg-red-500")}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Pending</span>
                <span>{itemStatus.pending || 0}</span>
              </div>
              {statBar(itemStatus.pending || 0, reports.items?.totalItems || 0, "bg-blue-500")}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Exchanged</span>
                <span>{itemStatus.exchanged || 0}</span>
              </div>
              {statBar(itemStatus.exchanged || 0, reports.items?.totalItems || 0, "bg-amber-500")}
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Users by Role</h2>
            <span className="text-xs text-slate-500">Total: {reports.users?.totalUsers ?? 0}</span>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            {["admin", "donor", "community_agent", "recipient"].map((role) => (
              <div key={role} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="capitalize">{role.replace("_", " ")}</span>
                  <span>{userRoles[role] || 0}</span>
                </div>
                {statBar(userRoles[role] || 0, reports.users?.totalUsers || 0, "bg-slate-700")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Complaints Status</h2>
            <span className="text-xs text-slate-500">
              Total: {reports.complaints?.totalComplaints ?? 0}
            </span>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            {["open", "pending", "resolved"].map((status) => (
              <div key={status} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="capitalize">{status}</span>
                  <span>{complaintStatus[status] || 0}</span>
                </div>
                {statBar(
                  complaintStatus[status] || 0,
                  reports.complaints?.totalComplaints || 0,
                  "bg-indigo-500"
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">Most Reported Users</h2>
          {topReportedUsers.length ? (
            <div className="space-y-3 text-sm text-slate-600">
              {topReportedUsers.map((entry) => (
                <div key={entry.username} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{entry.username}</span>
                    <span>{entry.count} complaints</span>
                  </div>
                  {statBar(entry.count, topReportedUsers[0]?.count || 1, "bg-rose-500")}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No complaints recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
