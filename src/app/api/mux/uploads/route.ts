import { NextRequest, NextResponse } from "next/server";
import { muxRequest } from "@/lib/mux";

type MuxCreateUploadResponse = {
  data: {
    id: string;
    url: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === "string" ? body.title : "Player video";
    const passthrough = JSON.stringify({
      title,
      slug: typeof body.slug === "string" ? body.slug : undefined,
      createdAt: new Date().toISOString(),
    });

    const upload = await muxRequest<MuxCreateUploadResponse>("/video/v1/uploads", {
      method: "POST",
      body: JSON.stringify({
        cors_origin: "*",
        new_asset_settings: {
          playback_policies: ["public"],
          video_quality: "basic",
          passthrough,
        },
      }),
    });

    return NextResponse.json({
      uploadId: upload.data.id,
      uploadUrl: upload.data.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create Mux upload" },
      { status: 500 }
    );
  }
}
