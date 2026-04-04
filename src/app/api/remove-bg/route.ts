import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const slug = formData.get("slug") as string;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    // Convert any format (AVIF, HEIC, JPEG, etc.) to PNG via sharp
    const sharp = (await import("sharp")).default;
    const pngBuffer = await sharp(Buffer.from(arrayBuffer)).png().toBuffer();
    const blob = new Blob([new Uint8Array(pngBuffer)], { type: "image/png" });

    // Dynamically import to avoid crashing the route if the package fails to load
    const { removeBackground } = await import("@imgly/background-removal-node");
    const resultBlob = await removeBackground(blob);
    const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());

    const path = `${slug || "temp"}/hero.png`;

    await supabase.storage.from("player-images").remove([path]);

    const { error: uploadError } = await supabase.storage
      .from("player-images")
      .upload(path, resultBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("player-images")
      .getPublicUrl(path);

    return NextResponse.json({ url: `${urlData.publicUrl}?t=${Date.now()}` });
  } catch (err) {
    console.error("Background removal failed:", err);
    return NextResponse.json(
      { error: `Background removal failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
