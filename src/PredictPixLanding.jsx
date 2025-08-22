import React, { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Countdown (plain JS — no TS annotations)                          */
/* ------------------------------------------------------------------ */
function useCountdown(targetIso) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const pad2 = (n) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/*  HaloBox — inline helper (no separate import needed)               */
/*  - thin 1px gradient border                                        */
/*  - soft glow halo                                                   */
/*  - dark interior                                                    */
/* ------------------------------------------------------------------ */
function HaloBox({ children, className = "", colors = "from-cyan-400 via-fuchsia-500 to-orange-400" }) {
  return (
    <div className={`relative rounded-2xl ${className}`}>
      {/* glow halo */}
      <div className={`pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r ${colors} opacity-25 blur-md`} />
      {/* 1px gradient outline */}
      <div className={`relative rounded-2xl p-[1px] bg-gradient-to-r ${colors}`}>
        {/* dark interior */}
        <div className="rounded-2xl bg-[#0d121b] ring-1 ring-white/10">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN LANDING                                                       */
/* ------------------------------------------------------------------ */
export default function PredictPixLanding() {
  // 15 Sept 2025 @ 00:00 in New York (EDT is -04:00 in Sept)
  const { days, hours, minutes, seconds } = useCountdown("2025-09-15T00:00:00-04:00");

  return (
    <main className="min-h-screen bg-[#0a0f17] text-white">
      {/* Top padding/container */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-400 via-cyan-400 to-pink-400" />
          <div className="text-xl font-semibold tracking-tight">
            PredictPi<span className="text-orange-400">x</span>
          </div>
        </div>

        {/* Hero + Form */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          {/* Left */}
          <div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Prediction<br />
              Markets<br />
              Powered by <span className="text-orange-400">Pi</span>
            </h1>

            <p className="mt-6 max-w-xl text-white/70">
              Peer-to-peer markets. No AMMs. No liquidity pools. Create
              a market, trade outcomes, and settle fairly—using only Pi.
            </p>

            {/* Countdown */}
            <div className="mt-8">
              <p className="mb-3 text-sm text-white/60">Closed beta starts in:</p>
              <div className="flex gap-4">
                <TimePill label="DAYS" value={pad2(days)} />
                <TimePill label="HOURS" value={pad2(hours)} />
                <TimePill label="MINUTES" value={pad2(minutes)} />
                <TimePill label="SECONDS" value={pad2(seconds)} />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#waitlist"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2.5 font-medium text-[#0a0f17]"
              >
                Join the Waitlist
              </a>
              <a
                href="#pi-login"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-5 py-2.5 font-medium text-[#0a0f17]"
              >
                Join Beta with Pi Login
              </a>
            </div>

            <p className="mt-3 text-sm text-white/40">
              Use your referral link <span className="text-white/70">?ref=YOURCODE</span> to earn early-access boosts.
            </p>
          </div>

          {/* Right — Early Access form with **orange** halo outline */}
          <div>
            <HaloBox colors="from-amber-400 via-orange-500 to-amber-400" className="shadow-2xl">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-semibold">Get Early Access</h2>
                <p className="mt-2 text-sm text-white/70">
                  Be among the first 1,000 to enter beta and claim a Founding
                  Predictor badge.
                </p>

                <form className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-1 block text-sm text-white/70">Email</span>
                    <input
                      type="email"
                      placeholder="you@predictpix.com"
                      className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 outline-none ring-0 placeholder:text-white/40 focus:border-white/20"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm text-white/70">Pi Wallet (optional)</span>
                    <input
                      type="text"
                      placeholder="Pi wallet username"
                      className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 outline-none ring-0 placeholder:text-white/40 focus:border-white/20"
                    />
                  </label>

                  <label className="mt-1 flex items-center gap-2 text-sm text-white/70">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" />
                    I agree to receive beta updates and I’ve read the{" "}
                    <a href="#" className="text-white hover:underline">Privacy Policy</a>.
                  </label>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2.5 font-medium text-[#0a0f17]"
                    >
                      Join Waitlist
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-white hover:bg-white/10"
                    >
                      Pi Login
                    </button>
                  </div>

                  <p className="pt-2 text-xs text-white/50">
                    Referral detected: <span className="text-white/80">none</span>
                  </p>
                </form>
              </div>
            </HaloBox>
          </div>
        </div>

        {/* How it works — three OUTLINE halo cards with dark interiors */}
        <section className="mt-16">
          <h3 className="mb-6 text-2xl font-semibold">How PredictPix Works</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <HaloBox colors="from-cyan-400 via-blue-400 to-fuchsia-500">
              <div className="p-5">
                <h4 className="text-lg font-semibold">Create or Join Markets</h4>
                <p className="mt-2 text-white/70">
                  Spin up a question in minutes, or jump into trending markets backed by peers.
                </p>
              </div>
            </HaloBox>

            <HaloBox colors="from-fuchsia-500 via-purple-400 to-cyan-400">
              <div className="p-5">
                <h4 className="text-lg font-semibold">Trade Outcomes with Pi</h4>
                <p className="mt-2 text-white/70">
                  Buy YES/NO shares using Pi. Prices shift based on demand—no AMMs, ever.
                </p>
              </div>
            </HaloBox>

            <HaloBox colors="from-pink-400 via-rose-400 to-cyan-400">
              <div className="p-5">
                <h4 className="text-lg font-semibold">Resolve Fairly</h4>
                <p className="mt-2 text-white/70">
                  Outcomes are resolved via clear criteria and community-reviewed sources.
                </p>
              </div>
            </HaloBox>
          </div>
        </section>

      </div>
    </main>
  );
}

/* Small stat pill for the countdown */
function TimePill({ label, value }) {
  return (
    <div className="flex w-16 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3">
      <div className="text-xl font-mono font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-[10px] font-medium text-white/60">{label}</div>
    </div>
  );
}
