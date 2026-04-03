"use client";

import { useState } from "react";
import Link from "next/link";

const PLAYER_FEATURES = [
  "Public profile at puckpro.io/your-name",
  "Shareable link for coaches & scouts",
  "Custom domain (yourname.com)",
  "Stats, highlights & socials in one place",
  "Edit your profile anytime",
  "Professional design that stands out",
];

const ELITE_FEATURES = [
  "Everything in Player",
  "Profile view analytics — see when coaches open it",
  "Native video hosting — no YouTube required",
  "Recruiting tracker (coming soon)",
  "PDF resume builder (coming soon)",
  "Priority support",
];

function Check({ elite }: { elite?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 flex-shrink-0 mt-0.5 ${elite ? "text-amber-400" : "text-[#b91c1c]"}`}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

export default function UpgradePage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-5 py-14">
      <div className="max-w-sm mx-auto space-y-8">

        {/* Back button */}
        <Link href="/builder/preview" className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Preview Profile
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white">Go public.</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Coaches can&apos;t find you if your profile is private.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setAnnual(false)}
            className={`text-sm font-medium transition-colors ${!annual ? "text-white" : "text-white/30"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${annual ? "bg-[#b91c1c]" : "bg-white/15"}`}
          >
            <div className={`absolute top-[4px] w-[16px] h-[16px] bg-white rounded-full transition-all duration-200 ${annual ? "left-[calc(100%-20px)]" : "left-[4px]"}`} />
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${annual ? "text-white" : "text-white/30"}`}
          >
            Annual
            <span className="text-[9px] bg-[#b91c1c]/20 text-[#b91c1c] px-1.5 py-0.5 rounded-full font-bold leading-none">
              −45%
            </span>
          </button>
        </div>

        {/* Player card */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Player</p>
            <div className="flex items-end gap-1.5">
              <span className="text-4xl font-black text-white">{annual ? "$79" : "$12"}</span>
              <span className="text-white/40 text-sm mb-1">{annual ? "/year" : "/month"}</span>
            </div>
            {annual && <p className="text-white/25 text-xs mt-0.5">just $6.58/month</p>}
          </div>

          <ul className="space-y-2.5">
            {PLAYER_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                <Check />
                {f}
              </li>
            ))}
          </ul>

          <button disabled className="w-full py-3.5 rounded-2xl bg-white/8 text-white/30 text-sm font-semibold cursor-not-allowed">
            Coming Soon
          </button>
        </div>

        {/* Elite card */}
        <div className="bg-white/4 border border-amber-400/30 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-amber-400/15 border border-amber-400/25 rounded-full px-2 py-0.5">
            <span className="text-amber-400 text-[9px] font-bold tracking-wide">BEST VALUE</span>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-400/70 mb-2">Elite</p>
            <div className="flex items-end gap-1.5">
              <span className="text-4xl font-black text-white">{annual ? "$149" : "$29"}</span>
              <span className="text-white/40 text-sm mb-1">{annual ? "/year" : "/month"}</span>
            </div>
            {annual && <p className="text-white/25 text-xs mt-0.5">just $12.42/month</p>}
          </div>

          <ul className="space-y-2.5">
            {ELITE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                <Check elite />
                {f}
              </li>
            ))}
          </ul>

          <button disabled className="w-full py-3.5 rounded-2xl bg-amber-400/10 text-amber-400/40 text-sm font-semibold cursor-not-allowed border border-amber-400/20">
            Coming Soon
          </button>
        </div>

        <p className="text-center text-white/20 text-xs">
          Stripe integration launching soon.
        </p>


      </div>
    </div>
  );
}
