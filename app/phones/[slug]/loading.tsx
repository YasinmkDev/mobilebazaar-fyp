import { DotLoader, SkeletonCard } from "@/components/Skeleton";

export default function PhoneLoading() {
  return (
    <div className="wrap section" aria-busy="true">
      <div className="load-brand">
        <DotLoader />
        <p className="page-loader-text">Loading this phone</p>
      </div>
      <div className="pdp-top" aria-hidden="true">
        <div className="skl skl-stage" />
        <div className="skl-buy">
          <span className="skl skl-line w35" />
          <span className="skl skl-line w80 tall" />
          <span className="skl skl-line w65" />
          <span className="skl skl-line w45 price" />
          <div className="skl-row"><span className="skl skl-pill wide" /><span className="skl skl-pill wide" /></div>
          <span className="skl skl-line w70" />
          <span className="skl skl-line w55" />
          <span className="skl skl-btn" />
          <span className="skl skl-line w85" />
          <span className="skl skl-line w75" />
        </div>
      </div>
      <div className="grid" style={{ marginTop: 26 }} aria-hidden="true">
        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    </div>
  );
}
