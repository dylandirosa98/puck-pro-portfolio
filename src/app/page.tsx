import Link from "next/link";

/* ─── Phone Mockup ─────────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[240px] flex-shrink-0 select-none">
      {/* Phone shell */}
      <div className="relative rounded-[2.8rem] bg-[#111] border border-white/15 shadow-2xl shadow-black/60 overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 40px 80px rgba(0,0,0,0.7)" }}>

        {/* Dynamic Island */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 w-24 h-6 bg-black rounded-full" />

        {/* Screen */}
        <div className="w-full overflow-hidden" style={{ background: "#0a0a0a", height: 490 }}>

          {/* Hero section */}
          <div className="relative h-52 overflow-hidden"
            style={{ background: "linear-gradient(160deg, #7f1d1d 0%, #1a0505 60%, #0a0a0a 100%)" }}>
            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
            {/* Jersey number watermark */}
            <div className="absolute -right-4 top-0 text-[120px] font-black text-white/5 leading-none select-none">
              14
            </div>
            {/* Player name */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12"
              style={{ background: "linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 100%)" }}>
              <p className="text-[9px] text-white/40 tracking-widest uppercase mb-0.5">Forward · #14</p>
              <p className="text-white font-black text-lg tracking-tight leading-none">JACK SMALLEY</p>
              <p className="text-white/40 text-[9px] mt-0.5">Tri-City Storm · USHL</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 border-b border-white/8 bg-white/3">
            {[["42", "PTS"], ["18", "G"], ["24", "A"], ["38", "GP"]].map(([val, label]) => (
              <div key={label} className="py-2.5 text-center border-r border-white/8 last:border-r-0">
                <p className="text-white font-bold text-xs leading-none">{val}</p>
                <p className="text-white/30 text-[8px] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Bio section */}
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[8px] text-white/25 uppercase tracking-widest mb-1.5">About</p>
            <p className="text-white/60 text-[8px] leading-relaxed line-clamp-2">
              Center ice specialist with a shoot-first mentality. Committed to playing at the next level and proving myself every shift.
            </p>
          </div>

          {/* Highlights section */}
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[8px] text-white/25 uppercase tracking-widest mb-2">Highlights</p>
            <div className="rounded-lg overflow-hidden bg-white/5 border border-white/8 flex items-center gap-2.5 px-3 py-2.5">
              <div className="w-5 h-5 rounded bg-[#b91c1c]/30 flex items-center justify-center flex-shrink-0">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-[#b91c1c] border-b-[4px] border-b-transparent ml-0.5" />
              </div>
              <p className="text-white/60 text-[8px] flex-1">2024–25 Season Reel</p>
            </div>
          </div>

          {/* Socials */}
          <div className="px-4 py-3">
            <p className="text-[8px] text-white/25 uppercase tracking-widest mb-2">Connect</p>
            <div className="flex gap-2">
              {["IG", "YT", "𝕏"].map((s) => (
                <div key={s} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-white/40 text-[8px] font-bold">{s}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Glow */}
      <div className="absolute inset-x-8 bottom-0 h-24 bg-[#b91c1c]/20 blur-2xl rounded-full -z-10" />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 pt-12 pb-4">
        <span className="font-black text-white tracking-tight text-xl">PuckPro</span>
        <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">
          Sign in
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="px-5 pt-8 pb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#b91c1c]/10 border border-[#b91c1c]/25 rounded-full px-3 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] animate-pulse" />
          <span className="text-xs text-[#b91c1c] font-semibold tracking-wide">Free to build</span>
        </div>

        <h1 className="text-[2.6rem] font-black leading-[1.05] tracking-tight mb-4 max-w-xs mx-auto">
          Get noticed<br />
          <span className="text-[#b91c1c]">by coaches.</span>
        </h1>

        <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          One link for your stats, highlights, bio, and socials.
          Built for competitive hockey players in 5 minutes.
        </p>

        <Link
          href="/builder"
          className="inline-flex items-center justify-center gap-2 w-full max-w-xs bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl py-4 text-white font-bold text-base transition-all shadow-lg shadow-[#b91c1c]/25 mx-auto"
        >
          Build My Profile — Free
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
        <p className="text-white/20 text-xs mt-2.5">No account needed to start</p>
      </section>

      {/* Phone mockup */}
      <section className="py-10 flex justify-center">
        <PhoneMockup />
      </section>

      {/* ── League strip ── */}
      <section className="px-5 py-6 border-y border-white/5">
        <p className="text-white/25 text-xs text-center uppercase tracking-widest mb-4">
          Built for players in
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {["USHL", "NAHL", "BCHL", "OJHL", "AJHL", "USAAHL", "AAA Travel"].map((l) => (
            <span key={l} className="text-white/35 text-sm font-semibold">{l}</span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-5 py-14">
        <h2 className="text-2xl font-black text-center mb-2">How it works</h2>
        <p className="text-white/40 text-sm text-center mb-10">Three steps. Five minutes. Done.</p>

        <div className="space-y-5 max-w-sm mx-auto">
          {[
            {
              n: "1",
              title: "Fill out your profile",
              desc: "Stats, highlights, bio, and socials. No design skills needed.",
              color: "#b91c1c",
            },
            {
              n: "2",
              title: "Create a free account",
              desc: "Save your profile — no credit card required.",
              color: "#1d4ed8",
            },
            {
              n: "3",
              title: "Share your link",
              desc: "Upgrade to publish publicly and send to coaches anywhere.",
              color: "#15803d",
            },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
                style={{ backgroundColor: s.color + "22", border: `1px solid ${s.color}44` }}
              >
                <span style={{ color: s.color }}>{s.n}</span>
              </div>
              <div className="pt-1.5">
                <p className="font-bold text-white text-sm">{s.title}</p>
                <p className="text-white/40 text-sm mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-5 pb-14 space-y-3 max-w-sm mx-auto">
        {[
          {
            icon: "🎬",
            title: "Highlight reel front and center",
            desc: "Your video is the first thing a coach sees — not buried in an email attachment.",
          },
          {
            icon: "📊",
            title: "Stats that update instantly",
            desc: "Edit your numbers any time. Your link always shows the latest.",
          },
          {
            icon: "📱",
            title: "Looks perfect on any device",
            desc: "Coaches open it on their phone at the rink. It works flawlessly.",
          },
          {
            icon: "🔗",
            title: "One link for everything",
            desc: "Stats, bio, highlights, socials, and your PDF résumé — all in one place.",
          },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-4 bg-white/4 border border-white/8 rounded-2xl p-4">
            <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
            <div>
              <p className="font-bold text-sm text-white">{f.title}</p>
              <p className="text-white/40 text-sm mt-1 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Pricing ── */}
      <section className="px-5 pb-16 max-w-sm mx-auto">
        <div className="rounded-3xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-[#b91c1c] px-6 py-5 text-center">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Go Public</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-4xl font-black text-white">$29</span>
              <span className="text-white/60 text-sm mb-1">/month</span>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/4 px-6 py-5 space-y-3">
            {[
              "Public link at puckpro.io/your-name",
              "Your own custom domain",
              "Shareable link for coaches & scouts",
              "Edit your profile anytime",
              "Recruiting tracker (coming soon)",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#b91c1c]/20 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-[#b91c1c]">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/65 text-sm">{f}</span>
              </div>
            ))}

            <div className="pt-3">
              <Link
                href="/builder"
                className="block w-full text-center py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white font-bold text-sm transition-all"
              >
                Start Building Free
              </Link>
              <p className="text-center text-white/20 text-xs mt-2">
                Build and preview for free. Upgrade when you&apos;re ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-5 pb-16 text-center max-w-sm mx-auto">
        <h2 className="text-2xl font-black mb-3">Ready to stand out?</h2>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          Every player emailing a PDF résumé is getting ignored. Be the one with the link.
        </p>
        <Link
          href="/builder"
          className="block w-full py-4 bg-white text-[#0a0a0a] font-black text-base rounded-2xl active:scale-95 transition-all"
        >
          Build My Profile — It&apos;s Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-10 pt-6 border-t border-white/5 text-center space-y-1">
        <p className="text-white font-black tracking-tight">PuckPro</p>
        <p className="text-white/20 text-xs">Built for competitive hockey players.</p>
      </footer>

    </div>
  );
}
