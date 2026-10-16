// Loading system — "Signal Dots" loader + layout-true skeletons.
// Skeletons mirror the real components (same boxes, same rhythm) so content
// lands without layout shift; the dot-matrix wave echoes the Doto brand type.

export function DotLoader({ size = "md", label = "Loading" }: { size?: "sm" | "md" | "lg"; label?: string }) {
  // 3×3 grid; delays radiate from the centre so the wave blooms outward.
  const delays = [0.24, 0.12, 0.24, 0.12, 0, 0.12, 0.24, 0.12, 0.24];
  return (
    <span className={`dot-loader ${size}`} role="status" aria-label={label}>
      {delays.map((d, i) => (
        <i key={i} style={{ animationDelay: `${d}s` }} className={i === 4 ? "core" : ""} />
      ))}
    </span>
  );
}

export function SkeletonCard() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="phone-visual skl-media"><DotLoader size="sm" /></div>
      <span className="skl skl-line w35" />
      <span className="skl skl-line w70 tall" />
      <span className="skl skl-line w85" />
      <span className="skl skl-line w55" />
      <div className="skl-row">
        <span className="skl skl-pill" /><span className="skl skl-pill" /><span className="skl skl-pill" />
      </div>
      <div className="skl-row">
        <span className="skl skl-pill wide" /><span className="skl skl-pill wide" />
      </div>
      <span className="skl skl-line w45 price" />
      <span className="skl skl-line w60" />
      <span className="skl skl-btn" />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function PageLoader({ text = "Loading MobileBazaar" }: { text?: string }) {
  return (
    <div className="page-loader" role="status">
      <DotLoader size="lg" />
      <p className="page-loader-text">{text}</p>
    </div>
  );
}
