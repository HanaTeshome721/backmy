"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth, getAccessToken, getAuth } from "@/lib/auth";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/language-context";
import { apiFetch } from "@/lib/api";

const baseLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/items", labelKey: "nav.items" },
  { href: "/needs", labelKey: "nav.requests" }
];

const publicLinks = [
  { href: "/about", labelKey: "nav.about" },
  { href: "/services", labelKey: "nav.services" },
  { href: "/contact", labelKey: "nav.contact" }
];

const authLinks = [{ href: "/profile", labelKey: "nav.profile" }];

const donorLinks = [
  { href: "/items/mine", labelKey: "nav.myItems" },
  { href: "/needs/mine", labelKey: "nav.myRequests" },
  { href: "/requests", labelKey: "nav.messages" },
  { href: "/notifications", labelKey: "nav.notifications" },
  { href: "/complaints", labelKey: "nav.complaints" }
];

const adminLinks = [{ href: "/admin/users", labelKey: "nav.admin" }];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const updateAuthState = () => {
      const auth = getAuth();
      setIsLoggedIn(!!auth?.accessToken);
      setRole(auth?.user?.role || null);
    };
    updateAuthState();
    window.addEventListener("auth:changed", updateAuthState);
    window.addEventListener("storage", updateAuthState);
    return () => {
      window.removeEventListener("auth:changed", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }
    const loadUnread = async () => {
      try {
        const data = await apiFetch("/notifications");
        const rows = data?.data || [];
        const count = rows.filter((notification) => !notification.isRead).length;
        setUnreadCount(count);
      } catch {
        setUnreadCount(0);
      }
    };
    loadUnread();
    const handleUpdated = () => loadUnread();
    window.addEventListener("notifications:updated", handleUpdated);
    return () => {
      window.removeEventListener("notifications:updated", handleUpdated);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setRole(null);
    router.push("/");
  };

  const links = isLoggedIn
    ? [
        ...baseLinks,
        ...authLinks,
        ...(role === "admin" ? adminLinks : donorLinks)
      ]
    : [...baseLinks, ...publicLinks];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="order-1 text-lg font-semibold">
          {t("brand.short")}
        </Link>

        <div className="order-2 flex items-center gap-2 md:order-3">
          <LanguageToggle />
          <ThemeSwitcher />
          {isLoggedIn ? (
            <button className="btn-outline" onClick={handleLogout}>
              {t("nav.logout")}
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-outline">
                {t("nav.login")}
              </Link>
              <Link href="/register" className="btn-primary">
                {t("nav.register")}
              </Link>
            </>
          )}
          <button
            type="button"
            className="btn-outline md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={t("nav.toggleNav")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>

        <nav
          className={`order-3 w-full flex-col gap-3 text-sm md:order-2 md:flex md:w-auto md:flex-row md:items-center md:gap-4 ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 ${
                isActive ? "font-semibold text-[#2f4f4f]" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{t(link.labelKey)}</span>
              {link.href === "/notifications" && unreadCount > 0 ? (
                <span className="rounded-full bg-[#bdb76b] px-2 py-0.5 text-xs font-semibold text-[#2f4f4f]">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
