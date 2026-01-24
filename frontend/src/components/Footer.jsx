"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function Footer() {
  const { t } = useLanguage();
  const quickLinks = [
    { href: "/about", labelKey: "nav.about" },
    { href: "/services", labelKey: "nav.services" },
    { href: "/contact", labelKey: "nav.contact" }
  ];

  const resourceLinks = [
    { href: "/items", labelKey: "footer.browseItems" },
    { href: "/register", labelKey: "footer.joinCommunity" },
    { href: "/login", labelKey: "footer.memberLogin" }
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("brand.short")}</h3>
          <p className="text-sm text-slate-600">{t("footer.tagline")}</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t("footer.quickLinks")}
          </h4>
          <div className="flex flex-col gap-2 text-sm">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-600 hover:text-slate-900">
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t("footer.resources")}
          </h4>
          <div className="flex flex-col gap-2 text-sm">
            {resourceLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-600 hover:text-slate-900">
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4">
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
