export type VideoInfo =
  | { platform: "youtube"; id: string }
  | { platform: "vimeo"; id: string }
  | { platform: "wistia"; id: string }
  | { platform: "unknown" };

export function detectVideo(url: string): VideoInfo {
  // YouTube
  const ytPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of ytPatterns) {
    const m = url.match(p);
    if (m) return { platform: "youtube", id: m[1] };
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) return { platform: "vimeo", id: vimeoMatch[1] };

  // Wistia
  const wistiaMatch = url.match(
    /(?:wistia\.com\/medias\/|wistia\.net\/embed\/iframe\/|wistia\.com\/embed\/iframe\/)([a-zA-Z0-9]+)/
  );
  if (wistiaMatch) return { platform: "wistia", id: wistiaMatch[1] };

  return { platform: "unknown" };
}

export function getEmbedUrl(video: VideoInfo): string | null {
  switch (video.platform) {
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`;
    case "vimeo":
      return `https://player.vimeo.com/video/${video.id}?autoplay=1&title=0&byline=0&portrait=0`;
    case "wistia":
      return `https://fast.wistia.net/embed/iframe/${video.id}?autoPlay=true&seo=true&videoFoam=false`;
    default:
      return null;
  }
}
