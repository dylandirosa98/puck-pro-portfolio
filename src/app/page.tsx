import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("players")
    .select("slug")
    .eq("is_published", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (data) {
    redirect(`/${data.slug}`);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-3xl font-bold mb-4">No Player Pages Yet</h1>
        <p className="text-white/50 mb-6">
          Create your first player page in the admin dashboard.
        </p>
        <a
          href="/admin"
          className="inline-block px-6 py-3 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors"
        >
          Go to Admin
        </a>
      </div>
    </main>
  );
}
