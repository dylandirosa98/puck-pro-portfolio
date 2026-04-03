import { NextRequest, NextResponse } from "next/server";
import { removeBackground } from "@imgly/background-removal-node";
import { createAdminClient } from "@/lib/supabase/admin";
import sharp from "sharp";

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

    // Convert to PNG first — background-removal-node only supports JPEG/PNG/WebP
    const pngBuffer = await sharp(Buffer.from(arrayBuffer)).png().toBuffer();
    const blob = new Blob([pngBuffer], { type: "image/png" });

    // Remove background
    const resultBlob = await removeBackground(blob);
    const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());

    // Upload processed image to Supabase Storage
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
      { error: "Background removal failed. Try uploading a pre-cut image instead." },
      { status: 500 }
    );
  }
}
