import { DotLoader, SkeletonGrid } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="wrap section" aria-busy="true">
      <div className="load-brand">
        <DotLoader size="lg" />
        <p className="page-loader-text">Loading MobileBazaar</p>
      </div>
      <div className="skl skl-hero" aria-hidden="true" />
      <SkeletonGrid count={8} />
    </div>
  );
}
