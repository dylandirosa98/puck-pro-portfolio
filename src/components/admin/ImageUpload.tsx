"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ImageUploadProps {
  slug: string;
  folder: "headshot" | "hero" | "logo";
  currentUrl: string;
  onUpload: (url: string) => void;
}

export default function ImageUpload({ slug, folder, currentUrl, onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const bgRemovalRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Preload the default model when hero/logo uploader mounts
  useEffect(() => {
    if (folder !== "hero" && folder !== "logo") return;
    import("@imgly/background-removal").then(({ preload }) =>
      preload({ proxyToWorker: true }).catch(() => {})
    );
  }, [folder]);

  async function uploadDirect(file: File, heroPath?: boolean) {
    const needsConversion = ["image/avif", "image/heic", "image/heif"].includes(file.type);
    const uploadBlob = needsConversion ? await toPng(file) : file;
    const ext = needsConversion ? "png" : file.name.split(".").pop();
    const path = heroPath
      ? `${slug || "temp"}/hero.${ext}`
      : `${slug || "temp"}/${folder}.${ext}`;

    await supabase.storage.from("player-images").remove([path]);

    const { error } = await supabase.storage
      .from("player-images")
      .upload(path, uploadBlob, { upsert: true });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from("player-images")
      .getPublicUrl(path);

    return `${urlData.publicUrl}?t=${Date.now()}`;
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
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas conversion failed")), "image/png");
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
      img.src = url;
    });
  }

  async function uploadWithBgRemoval(file: File) {
    const { removeBackground } = await import("@imgly/background-removal");
    const pngBlob = await toPng(file);
    const resultBlob = await removeBackground(pngBlob, {
      proxyToWorker: true,
      progress: (key, current, total) => {
        if (key.includes("fetch") && total > 0) {
          setProgress(Math.round((current / total) * 100));
          setStatus("Downloading model");
        } else if (key.includes("compute")) {
          setProgress(0);
          setStatus("Removing background");
        }
      },
    });

    const path = `${slug || "temp"}/${folder === "logo" ? "logo" : "hero"}.png`;
    await supabase.storage.from("player-images").remove([path]);

    const { error } = await supabase.storage
      .from("player-images")
      .upload(path, resultBlob, { contentType: "image/png", upsert: true });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from("player-images")
      .getPublicUrl(path);

    return `${urlData.publicUrl}?t=${Date.now()}`;
  }

  async function handleFile(file: File, removeBg: boolean) {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(0);

    try {
      let url: string;
      if (removeBg) {
        setStatus("Downloading model");
        url = await uploadWithBgRemoval(file);
      } else {
        setStatus("Uploading");
        url = await uploadDirect(file, folder === "hero");
      }
      onUpload(url);
      setPreview(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(msg);
    } finally {
      setUploading(false);
      setStatus("");
      setProgress(0);
    }
  }

  if (folder === "hero" || folder === "logo") {
    return (
      <div className="space-y-2">
        {/* Preview */}
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white/5 border border-white/10">
          {preview && !preview.includes("placeholder") ? (
            <Image src={preview} alt="hero" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex items-center justify-center h-full text-white/30 text-xs text-center px-2">
              No image
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-1.5 px-2">
              <div className="w-full bg-white/10 rounded-full h-1">
                {progress > 0 && (
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
              <span className="text-[10px] text-white/80 text-center">
                {status}{progress > 0 ? ` ${progress}%` : "..."}
              </span>
            </div>
          )}
        </div>

        {/* Two upload buttons */}
        {!uploading && (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => bgRemovalRef.current?.click()}
              className="text-[11px] px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 text-white transition-colors text-left"
            >
              ✦ Upload + Remove BG
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[11px] px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-left"
            >
              ↑ Upload pre-cut image
            </button>
          </div>
        )}

        <input
          ref={bgRemovalRef}
          type="file"
          accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, true); }}
          className="hidden"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, false); }}
          className="hidden"
        />
      </div>
    );
  }

  // Headshot — simple direct upload
  return (
    <div>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative w-32 h-32 rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-colors group ${
          uploading ? "cursor-wait" : "cursor-pointer hover:border-white/30"
        }`}
      >
        {preview && !preview.includes("placeholder") ? (
          <Image src={preview} alt="headshot" fill className="object-cover" unoptimized />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30 text-xs">
            Click to upload
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs text-white">{status}...</span>
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
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, false); }}
        className="hidden"
      />
    </div>
  );
}
