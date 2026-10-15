// Real device imagery (self-hosted, Oct 2026 refresh).
// Sources: manufacturer-style renders via GSMArena's public image CDN and
// real device photos from Wikipedia/Wikimedia Commons, cropped to the
// device and compressed. A few 2026 models whose exact render is not yet
// published use the closest official render of their predecessor/sibling
// (noted in the project README) — every image is a real device of the
// correct brand and line, never a generic mockup.
export function phoneImage(slug: string): string {
  return `/phones/${slug}.jpg`;
}

// Graceful degradation (Sprint 5 audit fix): a phone without a published
// image — e.g. a newly added device — must never render as a broken-image
// icon. Any <img> can wire onError={imgFallback} and swap to the placeholder.
export const PLACEHOLDER_IMG = "/phones/placeholder.jpg";

/**
 * Compress an uploaded device photo in the browser (max dimension, JPEG on
 * white) and return it as a data URL — small enough (~100–200 KB) to store
 * with the device record in the local data layer. In production this same
 * file goes to Supabase Storage instead; the publish flow downloads it as
 * <slug>.jpg for public/phones/.
 */
export async function fileToCompressedDataUrl(file: File, maxPx = 900, quality = 0.82): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxPx / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}
export function imgFallback(e: { currentTarget: HTMLImageElement }) {
  const t = e.currentTarget;
  if (!t.src.endsWith("placeholder.jpg")) t.src = PLACEHOLDER_IMG;
}
