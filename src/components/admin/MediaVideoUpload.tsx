"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { MediaItem } from "@/lib/types";
import { getMuxPlaybackId, getMuxThumbnailUrl } from "@/lib/video";

interface MediaVideoUploadProps {
  item: MediaItem;
  slug: string;
  inputClass: string;
  labelClass: string;
  onChange: (item: MediaItem) => void;
}

type UploadStatusResponse = {
  uploadStatus?: string;
  assetId?: string | null;
  assetStatus?: string | null;
  playbackId?: string | null;
  url?: string | null;
  thumbnailUrl?: string | null;
  error?: string;
};

function uploadToMux(uploadUrl: string, file: File, onProgress: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Mux upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Mux upload failed"));
    xhr.send(file);
  });
}

async function waitForMuxPlayback(uploadId: string): Promise<UploadStatusResponse> {
  for (let attempt = 0; attempt < 90; attempt++) {
    const response = await fetch(`/api/mux/uploads/${uploadId}`);
    const data = (await response.json()) as UploadStatusResponse;

    if (!response.ok || data.error) {
      throw new Error(data.error || "Unable to check Mux upload");
    }

    if (data.playbackId && data.url) return data;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Mux is still processing this video. Try again in a minute.");
}

export default function MediaVideoUpload({ item, slug, inputClass, labelClass, onChange }: MediaVideoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const playbackId = getMuxPlaybackId(item.url, item.muxPlaybackId);
  const thumbnailUrl = item.thumbnailUrl || (playbackId ? getMuxThumbnailUrl(playbackId) : "");

  async function handleFile(file: File) {
    setUploading(true);
    setProgress(0);
    setStatus("Creating upload...");

    try {
      const response = await fetch("/api/mux/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.title || file.name, slug }),
      });
      const upload = await response.json();

      if (!response.ok || upload.error) {
        throw new Error(upload.error || "Unable to create Mux upload");
      }

      onChange({ ...item, muxUploadId: upload.uploadId });
      setStatus("Uploading to Mux...");
      await uploadToMux(upload.uploadUrl, file, setProgress);

      setStatus("Processing video...");
      const ready = await waitForMuxPlayback(upload.uploadId);

      onChange({
        ...item,
        url: ready.url || "",
        thumbnailUrl: ready.thumbnailUrl || undefined,
        muxPlaybackId: ready.playbackId || undefined,
        muxAssetId: ready.assetId || undefined,
        muxUploadId: upload.uploadId,
      });
      setStatus("Ready");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Video upload failed");
      setStatus("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className={labelClass}>Upload Video to Mux</label>
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative w-full aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-colors group ${
            uploading ? "cursor-wait" : "cursor-pointer hover:border-white/30"
          }`}
        >
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={item.title ?? "video thumbnail"} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/30">
              Click to upload video
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 px-6">
              <span className="text-xs text-white">{status || "Uploading..."}</span>
              <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[10px] text-white/50">{progress}%</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
          className="hidden"
        />
        <p className="mt-1 text-[10px] text-white/25">Uploads are processed by Mux for reliable playback and thumbnails.</p>
      </div>

      <div>
        <label className={labelClass}>Video URL <span className="text-white/20 font-normal">(optional fallback)</span></label>
        <input
          className={inputClass}
          value={item.url}
          onChange={(e) => onChange({ ...item, url: e.target.value, muxPlaybackId: undefined, muxAssetId: undefined, muxUploadId: undefined, thumbnailUrl: undefined })}
          placeholder="YouTube, Vimeo, Google Drive, or Mux playback link"
        />
      </div>
    </div>
  );
}
