"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createBuilderProfile, updateBuilderProfile } from "@/lib/actions/builder-actions";
import { LS_KEY, EMPTY_WIZARD } from "@/app/builder/page";
import { WizardState } from "@/lib/types";

function SaveForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const supabase = createClient();

  // If already authed (e.g. returning from Google OAuth), save and redirect
  useEffect(() => {
    async function checkAndSave() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await saveProfileAndRedirect();
      } else {
        setCheckingAuth(false);
      }
    }
    checkAndSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveProfileAndRedirect() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const data: WizardState = raw ? JSON.parse(raw) : EMPTY_WIZARD;

      if (data.firstName) {
        const createResult = await createBuilderProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          position: data.position,
          number: data.number,
          team: data.team,
          league: data.league,
          hometown: data.hometown,
          height: data.height,
          weight: data.weight,
          shoots: data.shoots,
          birthYear: data.birthYear,
        });

        if (!("error" in createResult)) {
          await updateBuilderProfile(createResult.id, {
            bio: data.bio,
            headshotUrl: data.headshotUrl,
            heroImageUrl: data.heroImageUrl,
            themeColor: data.themeColor,
            currentStats: data.currentStats,
            seasonHistory: data.seasonHistory,
            highlightReelUrl: data.highlightReelUrl,
            highlights: data.highlights,
            socialLinks: data.socialLinks,
            resumeUrl: data.resumeUrl,
          });
        }
      }

      localStorage.removeItem(LS_KEY);
    } catch { /* ignore */ }

    router.push("/builder/preview");
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/builder/save` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // Auto-confirmed or session available
      if (data.session) {
        await saveProfileAndRedirect();
      } else {
        setMessage("Check your email to confirm your account, then sign in.");
        setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      await saveProfileAndRedirect();
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#b91c1c] animate-spin" />
      </div>
    );
  }

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-5 py-10">
        <div className="max-w-sm mx-auto w-full space-y-7">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#b91c1c]/15 border border-[#b91c1c]/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏒</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Almost there!</h1>
            <p className="text-white/45 text-sm leading-relaxed">
              {mode === "signup"
                ? "Create a free account to save your profile."
                : "Welcome back — sign in to save your profile."}
            </p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white/5 border border-white/10 rounded-2xl text-white/80 text-base font-medium active:scale-95 transition-all disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputCls}
              autoComplete="email"
              inputMode="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputCls}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />

            {error && <p className="text-red-400 text-sm px-1">{error}</p>}
            {message && <p className="text-green-400 text-sm px-1">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white text-base font-bold transition-all disabled:opacity-50"
            >
              {loading
                ? "Saving your profile..."
                : mode === "signup"
                ? "Create Account & Save"
                : "Sign In & Save"}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setMessage(""); }}
              className="text-white/60 hover:text-white underline transition-colors"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>

          <button
            onClick={() => router.push("/builder")}
            className="w-full text-center text-white/20 text-sm hover:text-white/40 transition-colors py-2"
          >
            ← Back to editor
          </button>

        </div>
      </div>
    </div>
  );
}

export default function BuilderSavePage() {
  return (
    <Suspense>
      <SaveForm />
    </Suspense>
  );
}
