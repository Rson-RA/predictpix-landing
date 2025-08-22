import React, { useEffect, useMemo, useState } from "react";

/**
 * PredictPix Landing Page (Pre + Post Launch)
 * -------------------------------------------------
 * - Tailwind CSS required
 * - Auto-switches between Pre-Launch (countdown + waitlist) and Post-Launch (stats + CTA)
 * - Email signup (POST /api/subscribe), Pi Login CTA (/login?next=/beta), and Referral tracking (?ref=abc)
 * - Colors follow the PredictPix dark theme with bright accents
 */

// =====================
// Theme / Design Tokens
// =====================
const COLORS = {
  bg: "#0C0F1C", // deep slate/indigo
  card: "#0E1327",
  text: "#FFFFFF",
  borderSoft: "#2A314B",
  accentPink: "#FF2ECF",
  accentCyan: "#00F5FF",
  accentOrange: "#FF7A1C",
};

// Sep 15, 2025 @ 12:00 (UTC-05:00, i.e., America/New_York)
const LAUNCH_AT_ISO = "2025-09-15T12:00:00-05:00";

// ---------------------
// Hooks
// ---------------------
function useRefParam() {
  const [ref, setRef] = useState<string>("");
  useEffect(() => {
    const url = new URL(window.location.href);
    setRef(url.searchParams.get("ref") || "");
  }, []);
  return ref;
}

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { diff, days, hours, minutes, seconds };
}

// ---------------------
// Small UI pieces
// ---------------------
function TimeBox({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="px-3 py-2 md:px-4 md:py-3 rounded-xl bg-black/30 ring-1"
        style={{ borderColor: COLORS.borderSoft }}
      >
        <span className="tabular-nums text-3xl md:text-4xl font-semibold">
          {String(n).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs uppercase tracking-widest text-white/70 mt-2">{label}</span>
    </div>
  );
}

function GradientButton({
  children,
  href,
  onClick,
  variant = "pink",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "pink" | "orange";
}) {
  const gradient =
    variant === "pink"
      ? `linear-gradient(30deg, ${COLORS.accentCyan} 0%, ${COLORS.accentPink} 100%)`
      : `linear-gradient(30deg, ${COLORS.accentPink} 0%, ${COLORS.accentOrange} 100%)`;
  const cls =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold text-black shadow-lg hover:opacity-95 transition";
  const style = { background: gradient } as React.CSSProperties;
  return href ? (
    <a href={href} className={cls} style={style}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

// Thin gradient-outline tile used for feature/perk/faq cards.
function HaloBox({
  variant = "pink",
  children,
}: {
  variant?: "pink" | "orange";
  children: React.ReactNode;
}) {
  const borderGrad =
    variant === "pink"
      ? `linear-gradient(135deg, ${COLORS.accentCyan}, ${COLORS.accentPink})`
      : `linear-gradient(135deg, ${COLORS.accentPink}, ${COLORS.accentOrange})`;
  const shadow = variant === "pink" ? "0 0 36px rgba(255,46,207,.22)" : "0 0 36px rgba(255,122,28,.20)";

  // Gradient border + dark interior (just like the Early Access card)
  return (
    <div
      className="rounded-2xl p-0"
      style={{
        background: `linear-gradient(${COLORS.card}, ${COLORS.card}) padding-box, ${borderGrad} border-box`,
        border: "1px solid transparent",
        boxShadow: shadow,
      }}
    >
      <div className="rounded-2xl p-5 md:p-6 bg-transparent">{children}</div>
    </div>
  );
}

// ---------------------
// Page
// ---------------------
export default function PredictPixLanding() {
  const { diff, days, hours, minutes, seconds } = useCountdown(LAUNCH_AT_ISO);
  const preLaunch = diff > 0;
  const refParam = useRefParam();

  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wallet, ref: refParam }),
      });
      if (res.ok) {
        setMessage("You're on the list! Check your email for confirmation.");
        setEmail("");
        setWallet("");
      } else {
        const t = await res.text();
        setMessage(`Signup failed: ${t || res.status}`);
      }
    } catch (err: any) {
      setMessage(`Network error: ${err?.message || "unknown"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: COLORS.bg, color: COLORS.text }} className="min-h-screen w-full">
      {/* Subtle hero backdrop swirl */}
      <div
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          background: `radial-gradient(600px 400px at 15% 10%, ${COLORS.accentPink}22 0%, transparent 70%),
             radial-gradient(700px 600px at 85% 20%, ${COLORS.accentCyan}22 0%, transparent 70%),
             radial-gradient(800px 600px at 50% 90%, ${COLORS.accentOrange}22 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Nav */}
      <header className="w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-8 py-5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl"
              style={{
                background: `linear-gradient(30deg, ${COLORS.accentCyan}, ${COLORS.accentPink})`,
                boxShadow: "0 0 24px rgba(255,46,207,0.35)",
              }}
            />
            <div className="text-xl font-bold tracking-tight">
              Predict<span style={{ color: COLORS.accentOrange }}>Pix</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <a href="#perks" className="hover:text-white">
              Beta perks
            </a>
            <a href="#roadmap" className="hover:text-white">
              Roadmap
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={preLaunch ? "#waitlist" : "/app"}
              className="hidden md:inline-block text-sm px-4 py-2 rounded-xl ring-1 hover:bg-white/5"
              style={{ borderColor: COLORS.borderSoft }}
            >
              {preLaunch ? "Join waitlist" : "Open app"}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="w-full">
        <section className="w-full max-w-6xl mx-auto px-5 md:px-8 pt-8 md:pt-16 pb-10 md:pb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Prediction Markets {" "}
                <span className="block mt-1">
                  Powered by <span style={{ color: COLORS.accentOrange }}>Pi</span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mt-4 max-w-xl">
                Peer-to-peer markets. No AMMs. No liquidity pools. Create a market, trade outcomes, and settle fairly—using only Pi.
              </p>

              {preLaunch ? (
                <div className="mt-6">
                  <div className="text-white/80 mb-3">Closed beta starts in:</div>
                  <div className="flex items-center gap-4">
                    <TimeBox n={days} label="Days" />
                    <TimeBox n={hours} label="Hours" />
                    <TimeBox n={minutes} label="Minutes" />
                    <TimeBox n={seconds} label="Seconds" />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <GradientButton variant="pink" href="#waitlist">
                      Join the Waitlist
                    </GradientButton>
                    <GradientButton variant="orange" href="/login?next=/beta">
                      Join Beta with Pi Login
                    </GradientButton>
                  </div>
                  <p className="text-sm text-white/60 mt-3">
                    Use your referral link <span className="text-white">?ref=YOURCODE</span> to earn early-access boosts.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="text-white/80">We are live!</div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <GradientButton variant="pink" href="/app">
                      Open PredictPix
                    </GradientButton>
                    <a
                      href="#stats"
                      className="px-5 py-3 rounded-2xl ring-1 text-white/90 hover:bg-white/5"
                      style={{ borderColor: COLORS.borderSoft }}
                    >
                      See live stats
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Early Access card with orange halo */}
            <div
              className="relative rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur"
              style={{
                background: `linear-gradient(${COLORS.card}, ${COLORS.card}) padding-box, linear-gradient(135deg, ${COLORS.accentOrange}55, #FFC170AA) border-box`,
                border: "1px solid transparent",
                boxShadow: "0 0 0 1px rgba(255,122,28,.25), 0 0 42px rgba(255,122,28,.25)",
              }}
            >
              {preLaunch ? (
                <div>
                  <h3 className="text-2xl font-semibold">Get Early Access</h3>
                  <p className="text-white/70 mt-2">
                    Be among the first 1,000 to enter beta and claim a Founding Predictor badge.
                  </p>

                  <form id="waitlist" onSubmit={submit} className="mt-5 grid gap-3">
                    <label className="text-sm text-white/80" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-black/30 px-4 py-3 outline-none ring-1 focus:ring-2"
                      style={{ borderColor: COLORS.borderSoft }}
                      placeholder="you@predictpix.com"
                    />

                    <label className="text-sm text-white/80 mt-2" htmlFor="wallet">
                      Pi Wallet (optional)
                    </label>
                    <input
                      id="wallet"
                      type="text"
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="w-full rounded-xl bg-black/30 px-4 py-3 outline-none ring-1 focus:ring-2"
                      style={{ borderColor: COLORS.borderSoft }}
                      placeholder="Pi wallet username"
                    />

                    <div className="flex items-start gap-2 mt-2 text-sm text-white/70">
                      <input id="consent" type="checkbox" required className="mt-1" />
                      <label htmlFor="consent">
                        I agree to receive beta updates and I've read the
                        <a className="underline ml-1" href="/privacy" target="_blank" rel="noreferrer">
                          Privacy Policy
                        </a>
                        .
                      </label>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <GradientButton variant="pink">Join Waitlist</GradientButton>
                      <a
                        href="/login?next=/beta"
                        className="px-5 py-3 rounded-2xl ring-1 hover:bg-white/5"
                        style={{ borderColor: COLORS.borderSoft }}
                      >
                        Pi Login
                      </a>
                    </div>

                    {message && (
                      <div
                        className="text-sm mt-3"
                        style={{ color: message.startsWith("Signup failed") || message.startsWith("Network") ? "#ffb4b4" : "#C6FFD0" }}
                      >
                        {message}
                      </div>
                    )}

                    <div className="text-xs text-white/60 mt-4">
                      Referral detected: <span className="text-white">{refParam || "none"}</span>
                    </div>
                  </form>
                </div>
              ) : (
                <div id="stats" className="grid gap-6">
                  <h3 className="text-2xl font-semibold">Live Snapshot</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl md:text-4xl font-bold tracking-tight">128</div>
                      <div className="text-sm text-white/70 mt-1">Active Markets</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl md:text-4xl font-bold tracking-tight">2391</div>
                      <div className="text-sm text-white/70 mt-1">Total Traders</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl md:text-4xl font-bold tracking-tight">12,540</div>
                      <div className="text-sm text-white/70 mt-1">24h Volume (Pi)</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl md:text-4xl font-bold tracking-tight">76</div>
                      <div className="text-sm text-white/70 mt-1">Markets Resolved</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <GradientButton variant="orange" href="/app">
                      Start Trading
                    </GradientButton>
                    <a
                      href="#how"
                      className="px-5 py-3 rounded-2xl ring-1 hover:bg-white/5"
                      style={{ borderColor: COLORS.borderSoft }}
                    >
                      How it works
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="w-full max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How PredictPix Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Create or Join Markets", d: "Spin up a question in minutes, or jump into trending markets backed by peers." },
              { t: "Trade Outcomes with Pi", d: "Buy YES/NO shares using Pi. Prices shift based on demand—no AMMs, ever." },
              { t: "Resolve Fairly", d: "Outcomes are resolved via clear criteria and community-reviewed sources." },
            ].map((x, i) => (
              <HaloBox key={i} variant="pink">
                <div className="text-lg font-semibold">{x.t}</div>
                <div className="text-white/75 mt-2">{x.d}</div>
              </HaloBox>
            ))}
          </div>
        </section>

        {/* Beta perks */}
        <section id="perks" className="w-full max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Beta Access & Perks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { h: "Founding Predictor", b: "First 1,000 verified beta users get a permanent profile badge and priority invites." },
              { h: "Referral Boosts", b: "Share ?ref=YOU. Each active friend moves you up the waitlist." },
              { h: "Influencer Program", b: "Creators can earn a share of trading fees from referred users—apply early." },
            ].map((x, i) => (
              <HaloBox key={i} variant="orange">
                <div className="text-lg font-semibold">{x.h}</div>
                <div className="text-white/75 mt-2">{x.b}</div>
              </HaloBox>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <GradientButton href="#waitlist">Get on the List</GradientButton>
            <a
              href="/influencers"
              className="px-5 py-3 rounded-2xl ring-1 hover:bg-white/5"
              style={{ borderColor: COLORS.borderSoft }}
            >
              Apply as Influencer
            </a>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="w-full max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Roadmap</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { s: "Now", t: "Private Alpha", d: "Internal testing, security hardening, resolution playbooks." },
              { s: "Pre-Launch", t: "Closed Beta", d: "Invite wave 1–3, referral boosts, influencer onboarding." },
              { s: "Launch", t: "Public Release", d: "Open signups, featured markets, staking for market creation." },
              { s: "+", t: "Growth", d: "Leaderboards, tournaments, more resolution providers, analytics." },
            ].map((x, i) => (
              <HaloBox key={i} variant="orange">
                <div className="text-sm text-white/70">{x.s}</div>
                <div className="text-lg font-semibold mt-1">{x.t}</div>
                <div className="text-white/75 mt-2">{x.d}</div>
              </HaloBox>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "Do I need Pi to join the beta?", a: "You can join the waitlist with email only. Trading uses Pi once your account is activated." },
              { q: "Are there AMMs or liquidity pools?", a: "No. PredictPix is peer-to-peer by design, avoiding AMM/liquidity pool risk." },
              { q: "How are outcomes resolved?", a: "Each market has clear criteria and sources; disputes can be reviewed per our resolution policy." },
              { q: "Can I create markets?", a: "Yes—create with clear criteria and a Pi stake. Abuse or harmful markets are prohibited by policy." },
            ].map((x, i) => (
              <HaloBox key={i} variant="pink">
                <div className="font-semibold">{x.q}</div>
                <div className="text-white/75 mt-2">{x.a}</div>
              </HaloBox>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-8 border-t" style={{ borderColor: COLORS.borderSoft }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-2 gap-6 items-center">
          <div className="text-white/75 text-sm">© {new Date().getFullYear()} PredictPix • All rights reserved.</div>
          <div className="flex md:justify-end gap-5 text-sm">
            <a href="/privacy" className="hover:text-white">Privacy</a>
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="https://t.me/predictpix" target="_blank" rel="noreferrer" className="hover:text-white">Telegram</a>
            <a href="https://x.com/predictpix" target="_blank" rel="noreferrer" className="hover:text-white">X</a>
            <a href="mailto:team@predictpix.com" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
