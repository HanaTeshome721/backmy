import Link from "next/link";

const adminLinks = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/items", label: "Items" },
  { href: "/admin/complaints", label: "Complaints" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/categories", label: "Categories" }
];

export default function AdminLayout({ children }) {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="card h-fit space-y-2">
        <h2 className="text-lg font-semibold">Admin</h2>
        <nav className="flex flex-col gap-2 text-sm">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-600 hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
