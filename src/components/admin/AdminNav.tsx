"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminNav() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-white/10 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/admin" className="text-sm font-bold text-white">
            Puck Pro Admin
          </a>
          <a
            href="/admin/players/new"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            + New Player
          </a>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
