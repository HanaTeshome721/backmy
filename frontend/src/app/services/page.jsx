"use client";

import { useLanguage } from "@/contexts/language-context";

export default function ServicesPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-10 text-base md:text-lg">
      <section className="card no-hover space-y-3 text-center">
        <h1 className="text-4xl font-semibold md:text-5xl">{t("services.title")}</h1>
        <p className="text-slate-600">{t("services.body")}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: t("services.s1Title"),
            copy: t("services.s1Body")
          },
          {
            title: t("services.s2Title"),
            copy: t("services.s2Body")
          },
          {
            title: t("services.s3Title"),
            copy: t("services.s3Body")
          },
          {
            title: t("services.s4Title"),
            copy: t("services.s4Body")
          }
        ].map((service) => (
          <div key={service.title} className="card no-hover space-y-2 text-center">
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="text-base text-slate-600">{service.copy}</p>
          </div>
        ))}
      </section>

      <section className="card no-hover space-y-3 text-center">
        <h2 className="text-2xl font-semibold">{t("services.adminTitle")}</h2>
        <p className="text-base text-slate-600">{t("services.adminBody")}</p>
      </section>
    </div>
  );
}
