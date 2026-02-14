import PlayerTemplate from "@/components/PlayerTemplate";
import { mockPlayer } from "@/lib/mock-data";

export default function Home() {
  return <PlayerTemplate player={mockPlayer} />;
}
