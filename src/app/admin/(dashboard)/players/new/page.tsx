import PlayerForm from "@/components/admin/PlayerForm";

export const dynamic = "force-dynamic";

export default function NewPlayerPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-8">New Player</h1>
      <PlayerForm />
    </div>
  );
}
