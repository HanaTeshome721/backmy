import Link from "next/link";

const adminLinks = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/items", label: "Items" },
  { href: "/admin/item-requests", label: "Item Requests" },
  { href: "/admin/needs", label: "Requests" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/complaints", label: "Complaints" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/categories", label: "Categories" }
];

export default function AdminLayout({ children }) {
  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold">Admin</h2>
        <nav className="flex flex-col gap-3 text-sm">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
