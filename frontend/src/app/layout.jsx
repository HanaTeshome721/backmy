import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Share Exchange & Donation",
  description: "Community item exchange and donation platform"
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/requests", label: "Requests" },
  { href: "/notifications", label: "Notifications" },
  { href: "/complaints", label: "Complaints" },
  { href: "/admin/users", label: "Admin" }
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold">
              Share Exchange
            </Link>
            <nav className="flex gap-4 text-sm">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-slate-600 hover:text-slate-900">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-2">
              <Link href="/login" className="btn-outline">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
