"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface MediaPhotoUploadProps {
  slug: string;
  index: number;
  currentUrl: string;
  onUpload: (url: string) => void;
}

async function toPng(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Conversion failed")), "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

export default function MediaPhotoUpload({ slug, index, currentUrl, onUpload }: MediaPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const needsConversion = ["image/avif", "image/heic", "image/heif"].includes(file.type);
      const uploadBlob = needsConversion ? await toPng(file) : file;
      const ext = needsConversion ? "png" : file.name.split(".").pop();
      const path = `${slug || "temp"}/media-${index}.${ext}`;

      await supabase.storage.from("player-images").remove([path]);
      const { error } = await supabase.storage
        .from("player-images")
        .upload(path, uploadBlob, { upsert: true });

      if (error) throw new Error(error.message);

      const { data: urlData } = supabase.storage.from("player-images").getPublicUrl(path);
      const url = `${urlData.publicUrl}?t=${Date.now()}`;
      onUpload(url);
      setPreview(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative w-full aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-colors group ${
          uploading ? "cursor-wait" : "cursor-pointer hover:border-white/30"
        }`}
      >
        {preview ? (
          <Image src={preview} alt="media" fill className="object-cover" unoptimized />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30 text-xs">
            Click to upload photo
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs text-white">Uploading...</span>
          </div>
        )}
        {!uploading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {preview ? "Replace" : "Upload"}
            </span>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        className="hidden"
      />
    </div>
  );
}
