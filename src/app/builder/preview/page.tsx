import { redirect } from "next/navigation";
import { getMyPlayer } from "@/lib/actions/builder-actions";
import PlayerTemplate from "@/components/PlayerTemplate";
import PreviewBanner from "@/components/builder/PreviewBanner";

export default async function BuilderPreviewPage() {
  const player = await getMyPlayer();

  if (!player) {
    redirect("/builder");
  }

  return (
    <>
      <PlayerTemplate player={player} />
      <PreviewBanner />
    </>
  );
}
