import { NextRequest, NextResponse } from "next/server";
import { removeBackground } from "@imgly/background-removal-node";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const slug = formData.get("slug") as string;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    // Convert File to blob for background removal
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

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

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("Background removal failed:", err);
    return NextResponse.json(
      { error: "Background removal failed. Try uploading a pre-cut image instead." },
      { status: 500 }
    );
  }
}
