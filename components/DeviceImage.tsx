"use client";
import { useEffect, useRef, useState } from "react";
import { PLACEHOLDER_IMG } from "@/lib/images";
import { DotLoader } from "./Skeleton";

/**
 * Device photo with a designed loading state: the Signal-Dots shimmer sits
 * behind the image until it arrives, then the photo fades in — no blank
 * boxes, no layout jump, and a broken file still degrades to the placeholder.
 */
export default function DeviceImage({
  src, alt, className = "", imgClassName = "", eager = false,
}: {
  src: string; alt: string; className?: string; imgClassName?: string; eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [finalSrc, setFinalSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => { setLoaded(false); setFinalSrc(src); }, [src]);

  // The load event can fire BEFORE React hydration attaches onLoad (small,
  // cached or fast-tunnel images) — the event is then lost and the shimmer
  // would spin forever. Reconcile from the img's real state, with a timed
  // safety net so the loader can never get stuck.
  useEffect(() => {
    const reconcile = () => {
      const img = imgRef.current;
      if (!img || !img.complete) return false;
      if (img.naturalWidth > 0) { setLoaded(true); return true; }
      if (!finalSrc.endsWith("placeholder.jpg")) setFinalSrc(PLACEHOLDER_IMG);
      else setLoaded(true);
      return true;
    };
    if (reconcile()) return;
    const t1 = setTimeout(reconcile, 600);
    const t2 = setTimeout(() => { if (!reconcile()) setLoaded(true); }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [finalSrc]);

  return (
    <span className={`dimg ${loaded ? "ready" : "loading"} ${className}`}>
      {!loaded && (
        <span className="dimg-shimmer" aria-hidden="true">
          <DotLoader size="sm" />
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt}
        className={imgClassName}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!finalSrc.endsWith("placeholder.jpg")) setFinalSrc(PLACEHOLDER_IMG);
          else setLoaded(true);
        }}
      />
    </span>
  );
}
