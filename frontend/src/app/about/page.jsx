"use client";

import { useLanguage } from "@/contexts/language-context";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-10 text-base md:text-lg">
      <section className="card no-hover flex min-h-[50vh] flex-col items-center justify-center space-y-3 text-center">
        <h1 className="text-4xl font-semibold md:text-5xl">{t("about.title")}</h1>
        <p className="max-w-3xl text-slate-600">{t("about.body")}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: t("about.mission"),
            copy: t("about.missionBody")
          },
          {
            title: t("about.vision"),
            copy: t("about.visionBody")
          },
          {
            title: t("about.values"),
            copy: t("about.valuesBody")
          }
        ].map((card) => (
          <div key={card.title} className="card space-y-2 text-center">
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-base text-slate-600">{card.copy}</p>
          </div>
        ))}
      </section>

      <section className="card no-hover space-y-3 text-center">
        <h2 className="text-2xl font-semibold">{t("about.safetyTitle")}</h2>
        <p className="text-base text-slate-600">{t("about.safetyBody")}</p>
      </section>
    </div>
  );
}
