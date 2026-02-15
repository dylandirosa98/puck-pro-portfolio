import { createClient } from "@/lib/supabase/server";
import { rowToPlayer, PlayerRow } from "@/lib/supabase/transforms";
import PublishToggle from "@/components/admin/PublishToggle";
import DeleteButton from "@/components/admin/DeleteButton";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-red-400">
        Error loading players: {error.message}
      </div>
    );
  }

  const players = (rows as PlayerRow[]).map(rowToPlayer);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Players</h1>
        <Link
          href="/admin/players/new"
          className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
        >
          + New Player
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 mb-4">No players yet</p>
          <Link
            href="/admin/players/new"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Create your first player page
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: player.themeColor }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {player.firstName} {player.lastName}
                    </span>
                    <span className="text-xs text-white/30">#{player.number}</span>
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {player.team} &middot; {player.position} &middot;{" "}
                    <span className="text-white/20">/{player.slug}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <PublishToggle
                  playerId={player.id}
                  initialPublished={player.isPublished}
                />
                <Link
                  href={`/admin/players/${player.id}`}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/${player.slug}`}
                  target="_blank"
                  className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  View
                </Link>
                <DeleteButton
                  playerId={player.id}
                  playerName={`${player.firstName} ${player.lastName}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
