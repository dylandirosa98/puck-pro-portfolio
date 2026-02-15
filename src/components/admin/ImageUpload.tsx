"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ImageUploadProps {
  slug: string;
  folder: "headshot" | "hero";
  currentUrl: string;
  onUpload: (url: string) => void;
}

export default function ImageUpload({ slug, folder, currentUrl, onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(currentUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function uploadDirect(file: File) {
    const ext = file.name.split(".").pop();
    const path = `${slug || "temp"}/${folder}.${ext}`;

    await supabase.storage.from("player-images").remove([path]);

    const { error } = await supabase.storage
      .from("player-images")
      .upload(path, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from("player-images")
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  async function uploadWithBgRemoval(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug || "temp");

    const res = await fetch("/api/remove-bg", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    return data.url as string;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      if (folder === "hero") {
        setStatus("Removing background...");
        const url = await uploadWithBgRemoval(file);
        onUpload(url);
        setPreview(url);
      } else {
        setStatus("Uploading...");
        const url = await uploadDirect(file);
        onUpload(url);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(msg);
    } finally {
      setUploading(false);
      setStatus("");
    }
  }

  return (
    <div>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative w-32 h-32 rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-colors group ${
          uploading ? "cursor-wait" : "cursor-pointer hover:border-white/30"
        }`}
      >
        {preview && !preview.includes("placeholder") ? (
          <Image src={preview} alt={folder} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30 text-xs">
            Click to upload
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs text-white text-center px-2">{status}</span>
          </div>
        )}
        {!uploading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {preview && !preview.includes("placeholder") ? "Replace" : "Upload"}
            </span>
          </div>
        )}
      </div>
      {folder === "hero" && (
        <p className="text-[10px] text-white/20 mt-1.5">
          Background auto-removed
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
