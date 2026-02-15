import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToPlayer, PlayerRow } from "@/lib/supabase/transforms";
import PlayerForm from "@/components/admin/PlayerForm";
import DeleteButton from "@/components/admin/DeleteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlayerPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const player = rowToPlayer(data as PlayerRow);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">
          Edit: {player.firstName} {player.lastName}
        </h1>
        <DeleteButton
          playerId={player.id}
          playerName={`${player.firstName} ${player.lastName}`}
          redirectAfter
        />
      </div>
      <PlayerForm player={player} />
    </div>
  );
}
