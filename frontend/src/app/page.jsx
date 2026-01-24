"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function HomePage() {
  const { t } = useLanguage();
  const StepIcons = {
    verified: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    anonymous: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 10V8a6 6 0 1112 0v2" />
        <rect x="6" y="10" width="12" height="10" rx="2" />
      </svg>
    ),
    tracked: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19h16" />
        <path d="M6 16l4-5 4 3 4-6" />
      </svg>
    )
  };

  const RoleIcons = {
    donor: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 14c2.5-1.5 6 0 8 2 2-2 5.5-3.5 8-2" />
        <path d="M12 6a3 3 0 100 6 3 3 0 000-6z" />
      </svg>
    ),
    receiver: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3a5 5 0 110 10 5 5 0 010-10z" />
        <path d="M4 21c1.5-4 14.5-4 16 0" />
      </svg>
    ),
    admin: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l4 2v6c0 4-2.5 7.5-4 8-1.5-.5-4-4-4-8V4l4-2z" />
        <path d="M9 13l3 3 3-3" />
      </svg>
    )
  };

  const WhyIcons = {
    secure: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
      </svg>
    ),
    verified: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    ),
    privacy: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="10" width="12" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 118 0v3" />
      </svg>
    ),
    transparency: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19h16" />
        <path d="M6 16l4-5 4 3 4-6" />
      </svg>
    )
  };

  const TrustIcons = {
    verified: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    tracking: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19h16" />
        <path d="M6 16l4-5 4 3 4-6" />
      </svg>
    ),
    privacy: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="10" width="12" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 118 0v3" />
      </svg>
    ),
    judgment: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  };
  return (
    <div className="space-y-16 text-base md:text-lg">
      <section
        className="-mx-4 flex min-h-[85vh] flex-col items-center justify-center gap-4 rounded-2xl bg-cover bg-center px-6 py-20 text-center text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url('/hero-hands.jpg')"
        }}
      >
        <div className="max-w-2xl">
          <h1 className="text-5xl font-semibold md:text-6xl">{t("home.heroTitle")}</h1>
          <p className="mt-3 text-xl text-white/90 md:text-2xl">{t("home.heroSubtitle")}</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/items"
              className="rounded-xl bg-[#bdb76b] px-6 py-3 text-base font-semibold text-[#2f4f4f] transition hover:scale-105 hover:bg-[#c8c07a]"
            >
              {t("home.donateNow")}
            </Link>
            <Link
              href="/needs"
              className="rounded-xl border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:scale-105 hover:border-white hover:bg-white/10"
            >
              {t("home.requestHelp")}
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold">{t("home.howTitle")}</h2>
          <p className="text-base text-slate-600">{t("home.howSubtitle")}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: t("home.step1Title"),
              heading: t("home.step1Heading"),
              body: t("home.step1Body"),
              icon: StepIcons.verified
            },
            {
              title: t("home.step2Title"),
              heading: t("home.step2Heading"),
              body: t("home.step2Body"),
              icon: StepIcons.anonymous
            },
            {
              title: t("home.step3Title"),
              heading: t("home.step3Heading"),
              body: t("home.step3Body"),
              icon: StepIcons.tracked
            }
          ].map((step) => (
            <div key={step.title} className="card space-y-2">
              <div className="flex justify-center icon-color text-4xl">{step.icon}</div>
              <p className="text-sm uppercase text-slate-400">{step.title}</p>
              <h3 className="text-xl font-semibold">{step.heading}</h3>
              <p className="text-base text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 pt-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold">{t("home.whoTitle")}</h2>
          <p className="text-base text-slate-600">{t("home.whoSubtitle")}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: t("home.donorTitle"),
              body: t("home.donorBody"),
              items: [t("home.donorItem1"), t("home.donorItem2"), t("home.donorItem3")],
              icon: RoleIcons.donor
            },
            {
              title: t("home.receiverTitle"),
              body: t("home.receiverBody"),
              items: [t("home.receiverItem1"), t("home.receiverItem2"), t("home.receiverItem3")],
              icon: RoleIcons.receiver
            },
            {
              title: t("home.adminTitle"),
              body: t("home.adminBody"),
              items: [t("home.adminItem1"), t("home.adminItem2"), t("home.adminItem3")],
              icon: RoleIcons.admin
            }
          ].map((role) => (
            <div key={role.title} className="card space-y-2 text-center">
              <div className="flex justify-center icon-color text-4xl">{role.icon}</div>
              <h3 className="text-xl font-semibold">{role.title}</h3>
              <p className="text-base text-slate-600">{role.body}</p>
              <ul className="space-y-2 text-base text-slate-600 text-left">
                {role.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 icon-color">
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 2a8 8 0 108 8 8 8 0 00-8-8zm-1.2 10.6L6 9.8l1.4-1.4 1.4 1.4 3.8-3.8L14 7.4z" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 pt-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold">{t("home.whyTitle")}</h2>
          <p className="text-base text-slate-600">{t("home.whySubtitle")}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { title: t("home.whySecure"), body: t("home.whySecureBody"), icon: WhyIcons.secure },
            { title: t("home.whyVerified"), body: t("home.whyVerifiedBody"), icon: WhyIcons.verified },
            { title: t("home.whyPrivacy"), body: t("home.whyPrivacyBody"), icon: WhyIcons.privacy },
            { title: t("home.whyTransparent"), body: t("home.whyTransparentBody"), icon: WhyIcons.transparency }
          ].map((item) => (
            <div key={item.title} className="card space-y-2 text-center">
              <div className="flex justify-center icon-color text-4xl">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-base text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-6">
        <h2 className="text-center text-3xl font-semibold">{t("home.trustTitle")}</h2>
        <p className="text-center text-base text-slate-600">{t("home.trustSubtitle")}</p>
        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: t("home.trust1Title"),
              body: t("home.trust1Body"),
              icon: TrustIcons.verified
            },
            {
              title: t("home.trust2Title"),
              body: t("home.trust2Body"),
              icon: TrustIcons.tracking
            },
            {
              title: t("home.trust3Title"),
              body: t("home.trust3Body"),
              icon: TrustIcons.privacy
            },
            {
              title: t("home.trust4Title"),
              body: t("home.trust4Body"),
              icon: TrustIcons.judgment
            }
          ].map((item) => (
            <div key={item.title} className="card flex items-start gap-4 p-6 text-left">
              <div className="icon-color flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-base text-slate-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card no-hover grid gap-6 md:grid-cols-[1fr_2fr] md:items-center">
        <div className="flex h-full items-center justify-center text-center">
          <h2 className="text-4xl font-semibold">{t("home.faqTitle")}</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              q: t("home.faq1Q"),
              a: t("home.faq1A")
            },
            {
              q: t("home.faq2Q"),
              a: t("home.faq2A")
            },
            {
              q: t("home.faq3Q"),
              a: t("home.faq3A")
            },
            {
              q: t("home.faq4Q"),
              a: t("home.faq4A")
            },
            {
              q: t("home.faq5Q"),
              a: t("home.faq5A")
            }
          ].map((faq, index) => (
            <details
              key={faq.q}
              className="no-hover rounded-md border border-slate-200 bg-white p-4"
              onToggle={(event) => {
                if (!event.currentTarget.open) return;
                document.querySelectorAll("details[data-faq]").forEach((el) => {
                  if (el !== event.currentTarget) {
                    el.open = false;
                  }
                });
              }}
              data-faq
            >
              <summary className="cursor-pointer text-base font-medium text-slate-800">
                {faq.q}
              </summary>
              <p className="mt-2 text-base text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
