"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Share Exchange & Donation System</h1>
          <p className="mt-2 text-slate-600">
            List unused items, request what you need, and build a sustainable community together.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/items" className="btn-primary">
              Browse Items
            </Link>
            <Link href="/items/new" className="btn-outline">
              Create Listing
            </Link>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          <p>Verified donors only</p>
          <p>Admin moderation & reporting</p>
          <p>Secure exchange requests</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "List items",
            copy: "Create listings with category, condition, and images."
          },
          {
            title: "Request exchange",
            copy: "Send requests, approve or reject, and confirm exchanges."
          },
          {
            title: "Admin control",
            copy: "Moderate listings, verify users, and resolve complaints."
          }
        ].map((card) => (
          <div key={card.title} className="card">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{card.copy}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
